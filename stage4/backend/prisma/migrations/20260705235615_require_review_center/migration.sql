/*
  Warnings:

  - Made the column `centerId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "centerId" SET NOT NULL;
