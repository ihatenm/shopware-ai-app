/*
  Warnings:

  - You are about to drop the `ProductUrls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProductUrls";

-- CreateTable
CREATE TABLE "product_urls" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "articleNo" TEXT NOT NULL,
    "ean" TEXT,
    "urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_urls_pkey" PRIMARY KEY ("id")
);
