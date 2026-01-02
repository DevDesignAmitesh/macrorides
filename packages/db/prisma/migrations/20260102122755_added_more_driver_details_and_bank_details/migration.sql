-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "vehicleType" AS ENUM ('TWO_WHEELER', 'THREE_WHEELER', 'FOUR_WHEELER');

-- CreateEnum
CREATE TYPE "ownershipStatus" AS ENUM ('OWNED', 'RENTED');

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "isVerified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverPersonalDetails" (
    "id" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "aadhaarCard" TEXT NOT NULL,
    "vehicleOwnerShipProof" TEXT,
    "driverId" TEXT NOT NULL,
    "gender" "gender" NOT NULL,
    "isPolicyAccepted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverPersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverVehicleDetails" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "rcNumber" TEXT NOT NULL,
    "identificationNumber" TEXT,
    "range" TEXT NOT NULL,
    "type" "vehicleType" NOT NULL,
    "ownershipStatus" "ownershipStatus" NOT NULL,
    "isElectric" BOOLEAN NOT NULL,
    "insurance" TEXT NOT NULL,
    "rc" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverVehicleDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankDetails_accountId_key" ON "BankDetails"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverPersonalDetails_driverId_key" ON "DriverPersonalDetails"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverVehicleDetails_driverId_key" ON "DriverVehicleDetails"("driverId");

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverPersonalDetails" ADD CONSTRAINT "DriverPersonalDetails_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverVehicleDetails" ADD CONSTRAINT "DriverVehicleDetails_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
