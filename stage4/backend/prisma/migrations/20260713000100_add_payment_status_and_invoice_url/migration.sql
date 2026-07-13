-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "invoiceUrl" TEXT;

ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus" USING ("status"::"PaymentStatus");
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'pending';
