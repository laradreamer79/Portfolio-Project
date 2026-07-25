ALTER TABLE "Trip" ALTER COLUMN "centerId" DROP NOT NULL;

ALTER TABLE "Course" ALTER COLUMN "centerId" DROP NOT NULL;

UPDATE "Trip"
SET "instructorId" = NULL
WHERE "centerId" IS NOT NULL AND "instructorId" IS NOT NULL;

UPDATE "Course"
SET "instructorId" = NULL
WHERE "centerId" IS NOT NULL AND "instructorId" IS NOT NULL;

ALTER TABLE "Trip"
ADD CONSTRAINT "Trip_exactly_one_owner_check"
CHECK (
  ("centerId" IS NOT NULL AND "instructorId" IS NULL)
  OR
  ("centerId" IS NULL AND "instructorId" IS NOT NULL)
);

ALTER TABLE "Course"
ADD CONSTRAINT "Course_exactly_one_owner_check"
CHECK (
  ("centerId" IS NOT NULL AND "instructorId" IS NULL)
  OR
  ("centerId" IS NULL AND "instructorId" IS NOT NULL)
);
