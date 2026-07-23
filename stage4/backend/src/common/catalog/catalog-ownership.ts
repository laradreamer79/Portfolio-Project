import type { ApprovalStatus } from "../../generated/prisma/client.js";
import type { AuthTokenPayload } from "../../auth/auth.token.js";
import { prisma } from "../../prisma/client.js";
import { HttpError } from "../../utils/http-error.js";

export type CatalogActor = AuthTokenPayload;
export type CatalogStatusFilter = ApprovalStatus | "all";

type OwnershipSelection = {
  centerId?: number | null;
  instructorId?: number | null;
};

type CatalogOwnerWhere = {
  instructorId?: number;
  center?: { ownerId: number };
};

type CatalogVisibilityWhere = CatalogOwnerWhere & {
  status?: ApprovalStatus;
  OR?: Array<CatalogOwnerWhere & { status?: ApprovalStatus }>;
};

type CatalogOwnershipRecord = {
  instructorId: number | null;
  center: { ownerId: number } | null;
};

async function assertCenterExists(centerId: number) {
  const center = await prisma.divingCenter.findUnique({
    where: { id: centerId },
    select: { id: true },
  });

  if (!center) {
    throw new HttpError(404, "Diving center not found");
  }
}

async function resolveOwnedCenterId(
  actor: CatalogActor,
  requestedCenterId?: number,
) {
  const ownedCenters = await prisma.divingCenter.findMany({
    where: { ownerId: actor.id },
    select: { id: true },
    orderBy: { id: "asc" },
  });

  if (ownedCenters.length === 0) {
    throw new HttpError(
      403,
      "No diving center is linked to this user",
    );
  }

  if (requestedCenterId !== undefined) {
    const ownsRequestedCenter = ownedCenters.some(
      (center) => center.id === requestedCenterId,
    );

    if (!ownsRequestedCenter) {
      throw new HttpError(403, "Forbidden");
    }

    return requestedCenterId;
  }

  if (ownedCenters.length > 1) {
    throw new HttpError(
      400,
      "centerId is required when the user owns multiple centers",
    );
  }

  return ownedCenters[0].id;
}

function assertExactlyOneOwner({
  centerId,
  instructorId,
}: OwnershipSelection) {
  if (Boolean(centerId) === Boolean(instructorId)) {
    throw new HttpError(
      400,
      "Provide exactly one owner: centerId or instructorId",
    );
  }
}

export async function resolveCatalogCreateOwnership(
  actor: CatalogActor,
  ownership: OwnershipSelection,
) {
  if (actor.role === "admin") {
    assertExactlyOneOwner(ownership);

    if (ownership.centerId) {
      await assertCenterExists(ownership.centerId);
    }

    return {
      centerId: ownership.centerId ?? null,
      instructorId: ownership.instructorId ?? null,
    };
  }

  if (actor.role === "instructor") {
    return {
      centerId: null,
      instructorId: actor.id,
    };
  }

  if (actor.role === "diving_center") {
    return {
      centerId: await resolveOwnedCenterId(actor, ownership.centerId ?? undefined),
      instructorId: null,
    };
  }

  throw new HttpError(403, "Forbidden");
}

export async function resolveCatalogUpdateOwnership(
  ownership: OwnershipSelection,
) {
  if (
    ownership.centerId === undefined &&
    ownership.instructorId === undefined
  ) {
    return {};
  }

  assertExactlyOneOwner(ownership);

  if (ownership.centerId) {
    await assertCenterExists(ownership.centerId);
  }

  return {
    centerId: ownership.centerId ?? null,
    instructorId: ownership.instructorId ?? null,
  };
}

export function catalogOwnerWhere(
  actor: CatalogActor,
): CatalogOwnerWhere | undefined {
  if (actor.role === "instructor") {
    return { instructorId: actor.id };
  }

  if (actor.role === "diving_center") {
    return { center: { ownerId: actor.id } };
  }

  return undefined;
}

export function catalogVisibilityWhere(
  actor: CatalogActor | undefined,
  status?: CatalogStatusFilter,
): CatalogVisibilityWhere {
  if (!status || status === "approved") {
    return { status: "approved" };
  }

  if (!actor) {
    return { status: "approved" };
  }

  if (actor.role === "admin") {
    return status === "all" ? {} : { status };
  }

  const ownerWhere = catalogOwnerWhere(actor);

  if (!ownerWhere) {
    return { status: "approved" };
  }

  return status === "all"
    ? ownerWhere
    : { ...ownerWhere, status };
}

export function catalogDetailVisibilityWhere(
  actor: CatalogActor | undefined,
): CatalogVisibilityWhere {
  if (actor?.role === "admin") {
    return {};
  }

  const ownerWhere = actor ? catalogOwnerWhere(actor) : undefined;

  return ownerWhere
    ? { OR: [{ status: "approved" }, ownerWhere] }
    : { status: "approved" };
}

export function assertCatalogAccess(
  actor: CatalogActor,
  item: CatalogOwnershipRecord,
) {
  if (actor.role === "admin") {
    return;
  }

  if (
    actor.role === "instructor" &&
    item.instructorId === actor.id
  ) {
    return;
  }

  if (
    actor.role === "diving_center" &&
    item.center?.ownerId === actor.id
  ) {
    return;
  }

  throw new HttpError(403, "Forbidden");
}
