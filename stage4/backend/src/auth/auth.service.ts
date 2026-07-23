import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import { createAuthToken } from "./auth.token.js";
import type {
  InstructorCityInput,
  LoginInput,
  RegisterInput,
} from "./auth.validation.js";

const PASSWORD_SALT_ROUNDS = 10;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  instructorProfile: {
    select: {
      licenseNumber: true,
      city: true,
      status: true,
    },
  },
} satisfies Prisma.UserSelect;

function throwRegistrationConflict(
  error: unknown,
  role: RegisterInput["role"],
): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = String(error.meta?.target ?? "");

    if (target.includes("email")) {
      throw new HttpError(409, "Email already exists");
    }

    const message =
      role === "instructor"
        ? "Instructor license number already exists"
        : "Diving center license number already exists";

    throw new HttpError(409, message);
  }

  throw error;
}

async function register(data: RegisterInput) {
  const passwordHash = await bcrypt.hash(
    data.password,
    PASSWORD_SALT_ROUNDS,
  );

  try {
    const userId = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: data.role,
        },
        select: { id: true },
      });

      if (
        data.role === "instructor" &&
        data.instructorLicenseNumber &&
        data.instructorCity
      ) {
        await transaction.instructorProfile.create({
          data: {
            licenseNumber: data.instructorLicenseNumber,
            city: data.instructorCity,
            userId: createdUser.id,
          },
        });
      }

      if (
        data.role === "diving_center" &&
        data.centerName &&
        data.centerCity &&
        data.centerLicenseNumber
      ) {
        await transaction.divingCenter.create({
          data: {
            name: data.centerName,
            city: data.centerCity,
            licenseNumber: data.centerLicenseNumber,
            contactEmail: data.email,
            ownerId: createdUser.id,
          },
        });
      }

      return createdUser.id;
    });

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: publicUserSelect,
    });

    return {
      message: "User registered successfully",
      token: createAuthToken({
        id: user.id,
        role: user.role,
      }),
      user,
    };
  } catch (error) {
    throwRegistrationConflict(error, data.role);
  }
}

async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
    },
  });

  if (
    !user ||
    !(await bcrypt.compare(data.password, user.passwordHash))
  ) {
    throw new HttpError(401, "Invalid email or password");
  }

  const { passwordHash: _passwordHash, ...publicUser } = user;

  return {
    token: createAuthToken({
      id: publicUser.id,
      role: publicUser.role,
    }),
    user: publicUser,
  };
}

async function getCurrentUser(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
}

async function updateInstructorCity(
  userId: number,
  data: InstructorCityInput,
) {
  try {
    return await prisma.instructorProfile.update({
      where: { userId },
      data: { city: data.city },
      select: {
        licenseNumber: true,
        city: true,
        status: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new HttpError(404, "Instructor profile not found");
    }

    throw error;
  }
}

export const authService = {
  register,
  login,
  getCurrentUser,
  updateInstructorCity,
};
