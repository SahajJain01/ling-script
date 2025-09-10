-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "langId" INTEGER NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lang" (
    "id" SERIAL NOT NULL,
    "code" TEXT,

    CONSTRAINT "Lang_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_langId_fkey" FOREIGN KEY ("langId") REFERENCES "Lang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
