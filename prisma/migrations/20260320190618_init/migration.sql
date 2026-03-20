/*
  Warnings:

  - You are about to drop the column `create_app` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `update_app` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the `renenues` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `update_at` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "create_app",
DROP COLUMN "update_app",
ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "renenues";

-- CreateTable
CREATE TABLE "revenues" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL,

    CONSTRAINT "revenues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revenues_month_key" ON "revenues"("month");
