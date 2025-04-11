/*
  Warnings:

  - A unique constraint covering the columns `[entry_code]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "entry_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "groups_entry_code_key" ON "groups"("entry_code");
