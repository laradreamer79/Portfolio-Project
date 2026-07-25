UPDATE "DivingCenter"
SET "city" = 'Khobar'
WHERE LOWER(TRIM("city")) IN (
  'al khobar',
  'al-khobar',
  'alkhobar',
  'khobar'
);

UPDATE "InstructorProfile"
SET "city" = 'Khobar'
WHERE LOWER(TRIM("city")) IN (
  'al khobar',
  'al-khobar',
  'alkhobar',
  'khobar'
);
