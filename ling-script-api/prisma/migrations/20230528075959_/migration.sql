/*
  Warnings:

  - You are about to drop the column `langId` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_langId_fkey";

-- AlterTable
ALTER TABLE "Prompt" DROP COLUMN "langId",
ADD COLUMN     "unitId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "code" INTEGER,
    "name" TEXT,
    "langId" INTEGER NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Lang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
