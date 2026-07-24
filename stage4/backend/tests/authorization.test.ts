import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createAuthToken } from "../src/auth/auth.token.js";
import { authenticate } from "../src/middleware/auth.middleware.js";
import {
  ROLES,
  authorize,
} from "../src/middleware/role.middleware.js";

const app = express();

app.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (_request, response) => {
    response.status(200).json({ message: "Admin access granted" });
  },
);

app.post(
  "/booking",
  authenticate,
  authorize(ROLES.USER),
  (_request, response) => {
    response.status(201).json({ message: "Booking allowed" });
  },
);

describe("authorization middleware", () => {
  it("rejects a request without a token", async () => {
    const response = await request(app).get("/admin");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("rejects an authenticated user without the required role", async () => {
    const token = createAuthToken({ id: 1, role: "user" });
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Forbidden" });
  });

  it("allows an authenticated admin", async () => {
    const token = createAuthToken({ id: 1, role: "admin" });
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Admin access granted",
    });
  });

  it("rejects an invalid token", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid token" });
  });

  it.each(["admin", "instructor", "diving_center"] as const)(
    "prevents the %s role from creating a booking",
    async (role) => {
      const token = createAuthToken({ id: 1, role });
      const response = await request(app)
        .post("/booking")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Forbidden" });
    },
  );

  it("allows a customer user to create a booking", async () => {
    const token = createAuthToken({ id: 1, role: "user" });
    const response = await request(app)
      .post("/booking")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Booking allowed" });
  });
});
