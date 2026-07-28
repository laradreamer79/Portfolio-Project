UPDATE "User"
SET "phone" = CASE "email"
  WHEN 'user@example.com' THEN '0511111111'
  WHEN 'instructor@example.com' THEN '0522222222'
  WHEN 'divingcenter@example.com' THEN '0533333333'
  WHEN 'admin@example.com' THEN '0544444444'
  ELSE '0500000000'
END
WHERE "phone" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "phone" SET NOT NULL;
