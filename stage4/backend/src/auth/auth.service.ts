import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret: string = JWT_SECRET;

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "user" | "instructor" | "diving_center";
  instructorLicenseNumber?: string;
  centerName?: string;
  centerCity?: string;
  centerLicenseNumber?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw {
      status: 409,
      message: "Email already exists",
    };
  }

  if (data.role === "instructor" && data.instructorLicenseNumber) {
    const existingInstructorProfile = await prisma.instructorProfile.findUnique({
      where: {
        licenseNumber: data.instructorLicenseNumber,
      },
    });

    if (existingInstructorProfile) {
      throw {
        status: 409,
        message: "Instructor license number already exists",
      };
    }
  }

  if (data.role === "diving_center" && data.centerLicenseNumber) {
    const existingCenter = await prisma.divingCenter.findUnique({
      where: {
        licenseNumber: data.centerLicenseNumber,
      },
    });

    if (existingCenter) {
      throw {
        status: 409,
        message: "Diving center license number already exists",
      };
    }
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    if (data.role === "instructor" && data.instructorLicenseNumber) {
      await transaction.instructorProfile.create({
        data: {
          licenseNumber: data.instructorLicenseNumber,
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

    return createdUser;
  });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  return {
    message: "User registered successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw {
      status: 401,
      message: "Invalid email or password",
    };
  }

  const validPassword = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!validPassword) {
    throw {
      status: 401,
      message: "Invalid email or password",
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getCurrentUser(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
