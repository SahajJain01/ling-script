/*
  Warnings:

  - You are about to drop the column `code` on the `Lang` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `name` to the `Lang` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Prompt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `answer` on table `Prompt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Unit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lang" DROP COLUMN "code",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "number",
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "answer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "number",
ALTER COLUMN "name" SET NOT NULL;
