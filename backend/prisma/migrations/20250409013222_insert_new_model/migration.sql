/*
  Warnings:

  - Made the column `user_limit` on table `groups` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_count` on table `groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "groups" ALTER COLUMN "user_limit" SET NOT NULL,
ALTER COLUMN "user_limit" SET DEFAULT 5,
ALTER COLUMN "user_count" SET NOT NULL;

-- CreateTable
CREATE TABLE "users_in_group" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_in_group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_in_group" ADD CONSTRAINT "users_in_group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_in_group" ADD CONSTRAINT "users_in_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
