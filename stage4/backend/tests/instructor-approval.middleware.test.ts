import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const instructorProfileFindUnique = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    instructorProfile: { findUnique: instructorProfileFindUnique },
  },
}));

const { createAuthToken } = await import("../src/auth/auth.token.js");
const { authenticate } = await import("../src/middleware/auth.middleware.js");
const { requireApprovedInstructor } = await import(
  "../src/middleware/instructor-approval.middleware.js"
);

const app = express();

app.post(
  "/instructor-action",
  authenticate,
  requireApprovedInstructor,
  (_request, response) => {
    response.status(200).json({ message: "Action allowed" });
  },
);

describe("approved instructor middleware", () => {
  beforeEach(() => {
    instructorProfileFindUnique.mockReset();
  });

  it("allows an approved instructor", async () => {
    instructorProfileFindUnique.mockResolvedValue({ status: "approved" });
    const token = createAuthToken({ id: 8, role: "instructor" });

    const response = await request(app)
      .post("/instructor-action")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(instructorProfileFindUnique).toHaveBeenCalledWith({
      where: { userId: 8 },
      select: { status: true },
    });
  });

  it.each(["pending", "rejected"])(
    "blocks an instructor with %s status",
    async (status) => {
      instructorProfileFindUnique.mockResolvedValue({ status });
      const token = createAuthToken({ id: 8, role: "instructor" });

      const response = await request(app)
        .post("/instructor-action")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: "Your instructor account must be approved by an admin",
      });
    },
  );

  it("does not query instructor approval for an admin", async () => {
    const token = createAuthToken({ id: 1, role: "admin" });

    const response = await request(app)
      .post("/instructor-action")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(instructorProfileFindUnique).not.toHaveBeenCalled();
  });
});
