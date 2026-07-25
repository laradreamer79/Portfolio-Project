UPDATE "DivingCenter"
SET "city" = CASE
  WHEN LOWER(TRIM("city")) = 'jeddah' THEN 'Jeddah'
  WHEN LOWER(TRIM("city")) = 'yanbu' THEN 'Yanbu'
  WHEN LOWER(TRIM("city")) = 'dammam' THEN 'Dammam'
  WHEN LOWER(TRIM("city")) IN ('al khobar', 'al-khobar', 'alkhobar', 'khobar') THEN 'Khobar'
  WHEN LOWER(TRIM("city")) = 'neom' THEN 'NEOM'
  WHEN LOWER(TRIM("city")) = 'jazan' THEN 'Jazan'
  ELSE "city"
END;

UPDATE "InstructorProfile"
SET "city" = CASE
  WHEN LOWER(TRIM("city")) = 'jeddah' THEN 'Jeddah'
  WHEN LOWER(TRIM("city")) = 'yanbu' THEN 'Yanbu'
  WHEN LOWER(TRIM("city")) = 'dammam' THEN 'Dammam'
  WHEN LOWER(TRIM("city")) IN ('al khobar', 'al-khobar', 'alkhobar', 'khobar') THEN 'Khobar'
  WHEN LOWER(TRIM("city")) = 'neom' THEN 'NEOM'
  WHEN LOWER(TRIM("city")) = 'jazan' THEN 'Jazan'
  ELSE "city"
END;

CREATE TYPE "DivingCity" AS ENUM (
  'Jeddah',
  'Yanbu',
  'Dammam',
  'Khobar',
  'NEOM',
  'Jazan'
);

ALTER TABLE "DivingCenter"
ALTER COLUMN "city" TYPE "DivingCity"
USING ("city"::TEXT::"DivingCity");

ALTER TABLE "InstructorProfile"
ALTER COLUMN "city" TYPE "DivingCity"
USING ("city"::TEXT::"DivingCity");
