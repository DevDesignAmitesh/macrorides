/*
  Warnings:

  - A unique constraint covering the columns `[panNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aadhaarNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_panNumber_key" ON "Vendor"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_aadhaarNumber_key" ON "Vendor"("aadhaarNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_contactNumber_key" ON "Vendor"("contactNumber");
