-- AlterTable
ALTER TABLE "DriverPersonalDetails" ALTER COLUMN "license" DROP NOT NULL,
ALTER COLUMN "aadhaarCard" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DriverVehicleDetails" ALTER COLUMN "insurance" DROP NOT NULL,
ALTER COLUMN "rc" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;
