-- CreateTable
CREATE TABLE "ProductUrls" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "articleNo" TEXT NOT NULL,
    "ean" TEXT,
    "urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductUrls_pkey" PRIMARY KEY ("id")
);
