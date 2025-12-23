/*
  Warnings:

  - You are about to drop the column `closingTime` on the `FoodVendor` table. All the data in the column will be lost.
  - You are about to drop the column `is247` on the `FoodVendor` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `FoodVendor` table. All the data in the column will be lost.
  - You are about to drop the column `aadhaarNumber` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `panNumber` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `ClothingCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodCategories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[panNumber]` on the table `VendorOwner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aadhaarNumber]` on the table `VendorOwner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadhaarNumber` to the `VendorOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `panNumber` to the `VendorOwner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClothingCategories" DROP CONSTRAINT "ClothingCategories_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "ClothingCategories" DROP CONSTRAINT "ClothingCategories_clothVendorId_fkey";

-- DropForeignKey
ALTER TABLE "FoodCategories" DROP CONSTRAINT "FoodCategories_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "FoodCategories" DROP CONSTRAINT "FoodCategories_foodVendorId_fkey";

-- DropIndex
DROP INDEX "Vendor_aadhaarNumber_key";

-- DropIndex
DROP INDEX "Vendor_contactNumber_key";

-- DropIndex
DROP INDEX "Vendor_panNumber_key";

-- AlterTable
ALTER TABLE "Categories" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FoodVendor" DROP COLUMN "closingTime",
DROP COLUMN "is247",
DROP COLUMN "openingTime";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "aadhaarNumber",
DROP COLUMN "panNumber",
ADD COLUMN     "closingTime" TIMESTAMP(3),
ADD COLUMN     "is247" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openingTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VendorOwner" ADD COLUMN     "aadhaarNumber" TEXT NOT NULL,
ADD COLUMN     "panNumber" TEXT NOT NULL;

-- DropTable
DROP TABLE "ClothingCategories";

-- DropTable
DROP TABLE "FoodCategories";

-- CreateIndex
CREATE UNIQUE INDEX "VendorOwner_panNumber_key" ON "VendorOwner"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOwner_aadhaarNumber_key" ON "VendorOwner"("aadhaarNumber");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
