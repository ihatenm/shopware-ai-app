-- CreateTable
CREATE TABLE "article_no_urls" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "articleNo" TEXT NOT NULL,
    "urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_no_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ean_urls" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "ean" TEXT,
    "urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ean_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "name_urls" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "urls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "name_urls_pkey" PRIMARY KEY ("id")
);
