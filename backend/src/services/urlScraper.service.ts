import { Service } from 'typedi';
import axios from 'axios';
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import type { ShopwareProductData } from '@interfaces/product.interface';

@Service()
export class urlScraperService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async scrapeProductUrls() {
    try {
      // Hole Produkte von der Validation API
      const response = await axios.get('http://localhost:3000/products/validation');
      const products: ShopwareProductData[] = response.data;

      for (const product of products) {
        const articleNo = product.mainDetail?.number;
        const ean = product.mainDetail?.ean;

        if (!articleNo && !ean) continue;

        // Suche nach URLs basierend auf Artikelnummer und EAN
        const urls = await this.searchProductUrls(articleNo, ean);

        // Speichere URLs in der Datenbank
        await this.prisma.productUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: urls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            ean: ean,
            urls: urls,
          },
        });
      }
    } catch (error) {
      console.error('Error scraping product URLs:', error);
      throw error;
    }
  }

  public async scrapeSelectedProductUrls(productIds: string[]) {
    try {
      // Hole Produkte von der Validation API
      const response = await axios.get('http://localhost:3000/products/validation');
      const products: ShopwareProductData[] = response.data;

      const selectedProducts = products.filter(product => productIds.includes(product.id.toString()));

      for (const product of selectedProducts) {
        const articleNo = product.mainDetail?.number;
        const ean = product.mainDetail?.ean;

        if (!articleNo && !ean) continue;

        // Suche nach URLs basierend auf Artikelnummer und EAN
        const urls = await this.searchProductUrls(articleNo, ean);

        // Speichere URLs in der Datenbank
        await this.prisma.productUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: urls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            ean: ean,
            urls: urls,
          },
        });
      }
    } catch (error) {
      console.error('Error scraping selected product URLs:', error);
      throw error;
    }
  }

  private async searchProductUrls(articleNo: string, ean?: string): Promise<string[]> {
    const urls: string[] = [];
    const URL_LIMIT_PER_TYPE = 3; // 3 URLs pro Suchtyp (articleNo und EAN)

    try {
      // Suche mit Artikelnummer
      if (articleNo) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(articleNo)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);

        // Extrahiere URLs aus Google Suchergebnissen (limitiert auf 3)
        let articleUrlCount = 0;
        $('.g .r a').each((_, element) => {
          if (articleUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && !url.includes('google.com')) {
            urls.push(url);
            articleUrlCount++;
          }
        });
      }

      // Suche mit EAN falls vorhanden
      if (ean) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(ean)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);

        let eanUrlCount = 0;
        $('.g .r a').each((_, element) => {
          if (eanUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && !url.includes('google.com')) {
            urls.push(url);
            eanUrlCount++;
          }
        });
      }

      return [...new Set(urls)]; // Entferne Duplikate
    } catch (error) {
      console.error('Error searching product URLs:', error);
      return [];
    }
  }
}