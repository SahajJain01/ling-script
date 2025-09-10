/*
  Warnings:

  - You are about to drop the column `code` on the `Unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "number" INTEGER;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "code",
ADD COLUMN     "number" INTEGER;
