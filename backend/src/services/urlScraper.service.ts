import { Service } from 'typedi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import type { ShopwareProductData } from '@interfaces/product.interface';
import { logger } from '@utils/logger';

@Service()
export class urlScraperService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async scrapeProductUrls() {
    try {
      logger.info('Starte scrapeProductUrls');
      // Hole Produkte von der Validation API
      const response = await axios.get('http://localhost:3000/products/validation');
      const products: ShopwareProductData[] = response.data;
      logger.info(`Gefundene Produkte: ${products.length}`);

      for (const product of products) {
        const articleNo = product.mainDetail?.number;
        const ean = product.mainDetail?.ean;

        if (!articleNo && !ean) {
          logger.warn(`Produkt ${product.id} hat keine Artikelnummer oder EAN, überspringe...`);
          continue;
        }

        // Suche nach URLs basierend auf Artikelnummer und EAN
        const urls = await this.searchProductUrls(articleNo, ean);
        logger.info(`Gefundene URLs für Produkt ${product.id}: ${urls}`);

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
        logger.info(`URLs für Produkt ${product.id} gespeichert`);
      }
    } catch (error) {
      logger.error('Error scraping product URLs:', error);
      throw error;
    }
  }

  public async scrapeSelectedProductUrls(productIds: string[]) {
    try {
      logger.info('Starte scrapeSelectedProductUrls');
      // Hole Produkte von der Validation API
      const response = await axios.get('http://localhost:3000/products/validation');
      const products: ShopwareProductData[] = response.data;
      logger.info(`Gefundene Produkte: ${products.length}`);

      const selectedProducts = products.filter(product => productIds.includes(product.id.toString()));
      logger.info(`Ausgewählte Produkte: ${selectedProducts.length}`);

      for (const product of selectedProducts) {
        const articleNo = product.mainDetail?.number;
        const ean = product.mainDetail?.ean;

        if (!articleNo && !ean) {
          logger.warn(`Produkt ${product.id} hat keine Artikelnummer oder EAN, überspringe...`);
          continue;
        }

        // Suche nach URLs basierend auf Artikelnummer und EAN
        const urls = await this.searchProductUrls(articleNo, ean);
        logger.info(`Gefundene URLs für Produkt ${product.id}: ${urls}`);

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
        logger.info(`URLs für Produkt ${product.id} gespeichert`);
      }
    } catch (error) {
      logger.error('Error scraping selected product URLs:', error);
      throw error;
    }
  }

  private async searchProductUrls(articleNo: string, ean?: string): Promise<string[]> {
    const urls: string[] = [];
    const URL_LIMIT_PER_TYPE = 3; // 3 URLs pro Suchtyp (articleNo und EAN)

    try {
      logger.info(`Starte Suche nach URLs für Artikelnummer: ${articleNo}, EAN: ${ean}`);
      // Suche mit Artikelnummer
      if (articleNo) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(articleNo)}`;
        logger.info(`Suche mit Artikelnummer, URL: ${searchUrl}`);
        const response = await axios.get(searchUrl);
        logger.info(`Antwort von Google für Artikelnummer: ${response.status}`);
        const $ = cheerio.load(response.data);

        // Extrahiere URLs aus Google Suchergebnissen (limitiert auf 3)
        let articleUrlCount = 0;
        $('a').each((_, element) => {
          if (articleUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && url.startsWith('/url?q=')) {
            const cleanUrl = url.split('&')[0].replace('/url?q=', '');
            if (!cleanUrl.includes('google.com') && !cleanUrl.includes('/search')) {
              urls.push(cleanUrl);
              articleUrlCount++;
            }
          }
        });
        logger.info(`Gefundene URLs für Artikelnummer ${articleNo}: ${urls}`);
      }

      // Suche mit EAN falls vorhanden
      if (ean) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(ean)}`;
        logger.info(`Suche mit EAN, URL: ${searchUrl}`);
        const response = await axios.get(searchUrl);
        logger.info(`Antwort von Google für EAN: ${response.status}`);
        const $ = cheerio.load(response.data);

        let eanUrlCount = 0;
        $('a').each((_, element) => {
          if (eanUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && url.startsWith('/url?q=')) {
            const cleanUrl = url.split('&')[0].replace('/url?q=', '');
            if (!cleanUrl.includes('google.com') && !cleanUrl.includes('/search')) {
              urls.push(cleanUrl);
              eanUrlCount++;
            }
          }
        });
        logger.info(`Gefundene URLs für EAN ${ean}: ${urls}`);
      }

      // Filter URLs basierend auf dem Inhalt der Webseiten
      const filteredUrls = await this.filterUrlsByContent(urls, articleNo, ean);
      logger.info(`Gefilterte URLs: ${filteredUrls}`);

      return [...new Set(filteredUrls)]; // Entferne Duplikate
    } catch (error) {
      logger.error('Error searching product URLs:', error);
      return [];
    }
  }

  private async filterUrlsByContent(urls: string[], articleNo: string, ean?: string): Promise<string[]> {
    const validUrls: string[] = [];

    for (const url of urls) {
      try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageContent = $('body').text();

        if (pageContent.includes(articleNo) || (ean && pageContent.includes(ean))) {
          validUrls.push(url);
        }
      } catch (error) {
        logger.error(`Error fetching content from URL: ${url}`, error);
      }
    }

    return validUrls;
  }
}