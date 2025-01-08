/*
  Warnings:

  - Added the required column `productUrlId` to the `extracted_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "article_no_urls" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ean_urls" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "extracted_data" ADD COLUMN     "productUrlId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "name_urls" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "extracted_data" ADD CONSTRAINT "extracted_data_productUrlId_fkey" FOREIGN KEY ("productUrlId") REFERENCES "product_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
