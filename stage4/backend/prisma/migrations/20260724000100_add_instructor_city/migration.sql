ALTER TABLE "InstructorProfile"
ADD COLUMN "city" TEXT;

CREATE INDEX "InstructorProfile_city_idx"
ON "InstructorProfile"("city");
