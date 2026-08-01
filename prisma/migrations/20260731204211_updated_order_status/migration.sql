/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kindeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_productId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdOn" TIMESTAMP(3),
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "failedSignIns" INTEGER,
ADD COLUMN     "familyName" TEXT,
ADD COLUMN     "givenName" TEXT,
ADD COLUMN     "identities" JSONB,
ADD COLUMN     "isSuspended" BOOLEAN DEFAULT false,
ADD COLUMN     "kindeId" TEXT,
ADD COLUMN     "lastSignedIn" TIMESTAMP(3),
ADD COLUMN     "organizations" JSONB,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "providedId" TEXT,
ADD COLUMN     "totalSignIns" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "images";

-- CreateIndex
CREATE UNIQUE INDEX "users_kindeId_key" ON "users"("kindeId");
