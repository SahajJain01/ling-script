/*
  Warnings:

  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_langId_fkey";

-- DropTable
DROP TABLE "Word";

-- CreateTable
CREATE TABLE "Prompt" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "answer" TEXT,
    "langId" INTEGER NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Lang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
