/*
  Warnings:

  - A unique constraint covering the columns `[contactNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendor_contactNumber_key" ON "Vendor"("contactNumber");
