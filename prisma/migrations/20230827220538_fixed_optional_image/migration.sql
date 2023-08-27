/*
  Warnings:

  - You are about to drop the column `Image` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "Image",
ADD COLUMN     "image" TEXT;
