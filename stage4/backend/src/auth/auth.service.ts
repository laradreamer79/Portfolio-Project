import bcrypt from "bcryptjs";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import { createAuthToken } from "./auth.token.js";
import type {
  LoginInput,
  RegisterInput,
} from "./auth.validation.js";

const PASSWORD_SALT_ROUNDS = 10;

type RegistrationConflictField =
  | "email"
  | "instructorLicenseNumber"
  | "centerLicenseNumber";

type RegistrationFieldErrors = Partial<
  Record<RegistrationConflictField, string>
>;

type RegistrationConflictLookupInput = {
  email: string;
  role: RegisterInput["role"];
  instructorLicenseNumber?: string;
  centerLicenseNumber?: string;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
} satisfies Prisma.UserSelect;

function registrationConflict(
  field: RegistrationConflictField,
  message: string,
): never {
  throw new HttpError(409, message, {
    field,
    fieldErrors: { [field]: message },
  });
}

async function getRegistrationConflicts(
  data: RegistrationConflictLookupInput,
): Promise<RegistrationFieldErrors> {
  const licenseLookup =
    data.role === "instructor" && data.instructorLicenseNumber
      ? prisma.instructorProfile.findUnique({
          where: { licenseNumber: data.instructorLicenseNumber },
          select: { id: true },
        })
      : data.role === "diving_center" && data.centerLicenseNumber
        ? prisma.divingCenter.findUnique({
            where: { licenseNumber: data.centerLicenseNumber },
            select: { id: true },
          })
        : Promise.resolve(null);

  const [existingUser, existingLicense] = await Promise.all([
    prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    }),
    licenseLookup,
  ]);

  const fieldErrors: RegistrationFieldErrors = {};

  if (existingUser) {
    fieldErrors.email = "Email already exists";
  }

  if (existingLicense && data.role === "instructor") {
    fieldErrors.instructorLicenseNumber =
      "Instructor license number already exists";
  }

  if (existingLicense && data.role === "diving_center") {
    fieldErrors.centerLicenseNumber =
      "Diving center license number already exists";
  }

  return fieldErrors;
}

async function ensureRegistrationIsUnique(data: RegisterInput) {
  const fieldErrors = await getRegistrationConflicts(data);
  const messages = Object.values(fieldErrors);
  if (messages.length > 0) {
    throw new HttpError(409, messages[0], { fieldErrors });
  }
}

function throwRegistrationConflict(
  error: unknown,
  role: RegisterInput["role"],
): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const conflictMetadata = JSON.stringify(error.meta ?? {}).toLowerCase();

    if (
      conflictMetadata.includes("email") ||
      conflictMetadata.includes('"modelname":"user"')
    ) {
      registrationConflict("email", "Email already exists");
    }

    if (role === "instructor") {
      registrationConflict(
        "instructorLicenseNumber",
        "Instructor license number already exists",
      );
    }

    if (role === "diving_center") {
      registrationConflict(
        "centerLicenseNumber",
        "Diving center license number already exists",
      );
    }

    throw new HttpError(409, "An account with these details already exists");
  }

  throw error;
}

async function register(data: RegisterInput) {
  await ensureRegistrationIsUnique(data);

  const passwordHash = await bcrypt.hash(
    data.password,
    PASSWORD_SALT_ROUNDS,
  );

  try {
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          passwordHash,
          role: data.role,
        },
        select: publicUserSelect,
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
            contactPhone: data.phone,
            ownerId: createdUser.id,
          },
        });
      }

      return createdUser;
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

export const authService = {
  register,
  login,
  getCurrentUser,
};
