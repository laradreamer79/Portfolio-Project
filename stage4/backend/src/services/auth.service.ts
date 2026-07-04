import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "instructor" | "diving_center" | "admin";
};

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(data: RegisterInput) {
  const { name, email, password, role = "user" } = data;

  if (!name || !email || !password) {
    throw {
      status: 400,
      message: "Name, email and password are required",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw {
      status: 409,
      message: "Email already exists",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}

export async function loginUser(data: LoginInput) {
  const { email, password } = data;

  if (!email || !password) {
    throw {
      status: 400,
      message: "Email and password are required",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw {
      status: 401,
      message: "Invalid email or password",
    };
  }

  const validPassword = await bcrypt.compare(
    password,
    user.passwordHash
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
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}
