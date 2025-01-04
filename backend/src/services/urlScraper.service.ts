import { Service } from 'typedi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import type { ShopwareProductData } from '@interfaces/product.interface';
import { logger } from '@utils/logger';

@Service()
export class urlScraperService {
  private prisma: PrismaClient;
  private userAgents: string[];

  constructor() {
    this.prisma = new PrismaClient();
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
      'Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/NBD90W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.3',
    ];
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        const name = product.name;

        if (!articleNo && !ean && !name) {
          logger.warn(`Produkt ${product.id} hat keine Artikelnummer, EAN oder Namen, überspringe...`);
          continue;
        }

        // Suche nach URLs basierend auf Artikelnummer, EAN und Name
        const { allUrls, articleNoUrls, eanUrls, nameUrls } = await this.searchProductUrls(articleNo, ean, name);
        logger.info(`Gefundene URLs für Produkt ${product.id}: ${allUrls}`);

        // Speichere URLs in der Datenbank
        await this.prisma.productUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: allUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            ean: ean,
            urls: allUrls,
          },
        });

        await this.prisma.articleNoUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: articleNoUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            urls: articleNoUrls,
          },
        });

        await this.prisma.eanUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: eanUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            ean: ean,
            urls: eanUrls,
          },
        });

        await this.prisma.nameUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: nameUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            name: name || '',
            urls: nameUrls,
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
        const name = product.name;

        if (!articleNo && !ean && !name) {
          logger.warn(`Produkt ${product.id} hat keine Artikelnummer, EAN oder Namen, überspringe...`);
          continue;
        }

        // Suche nach URLs basierend auf Artikelnummer, EAN und Name
        const { allUrls, articleNoUrls, eanUrls, nameUrls } = await this.searchProductUrls(articleNo, ean, name);
        logger.info(`Gefundene URLs für Produkt ${product.id}: ${allUrls}`);

        // Speichere URLs in der Datenbank
        await this.prisma.productUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: allUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            ean: ean,
            urls: allUrls,
          },
        });

        await this.prisma.articleNoUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: articleNoUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            articleNo: articleNo || '',
            urls: articleNoUrls,
          },
        });

        await this.prisma.eanUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: eanUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            ean: ean,
            urls: eanUrls,
          },
        });

        await this.prisma.nameUrls.upsert({
          where: {
            id: product.id,
          },
          update: {
            urls: nameUrls,
            updatedAt: new Date(),
          },
          create: {
            productId: product.id,
            name: name || '',
            urls: nameUrls,
          },
        });

        logger.info(`URLs für Produkt ${product.id} gespeichert`);
      }
    } catch (error) {
      logger.error('Error scraping selected product URLs:', error);
      throw error;
    }
  }

  private async searchProductUrls(articleNo?: string, ean?: string, name?: string): Promise<{ allUrls: string[], articleNoUrls: string[], eanUrls: string[], nameUrls: string[] }> {
    const allUrls: string[] = [];
    const articleNoUrls: string[] = [];
    const eanUrls: string[] = [];
    const nameUrls: string[] = [];
    const URL_LIMIT_PER_TYPE = 5; // Erhöhtes Limit auf 10 URLs pro Suchtyp (articleNo, ean und name)

    try {
      logger.info(`Starte Suche nach URLs für Artikelnummer: ${articleNo}, EAN: ${ean}, Name: ${name}`);
      
      // Suche mit Artikelnummer
      if (articleNo) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(articleNo)}`;
        logger.info(`Suche mit Artikelnummer, URL: ${searchUrl}`);
        const response = await axios.get(searchUrl, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 10000, // 10 Sekunden Timeout
        });
        logger.info(`Antwort von Google für Artikelnummer: ${response.status}`);
        const $ = cheerio.load(response.data);

        // Extrahiere URLs aus Google Suchergebnissen (limitiert auf 10)
        let articleUrlCount = 0;
        $('a').each((_, element) => {
          if (articleUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && url.startsWith('/url?q=')) {
            const cleanUrl = url.split('&')[0].replace('/url?q=', '');
            if (!cleanUrl.includes('google.com') && !cleanUrl.includes('/search')) {
              allUrls.push(cleanUrl);
              articleNoUrls.push(cleanUrl);
              articleUrlCount++;
            }
          }
        });
        logger.info(`Gefundene URLs für Artikelnummer ${articleNo}: ${articleNoUrls}`);
      }

      // Suche mit EAN falls vorhanden
      if (ean) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(ean)}`;
        logger.info(`Suche mit EAN, URL: ${searchUrl}`);
        const response = await axios.get(searchUrl, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 10000, // 10 Sekunden Timeout
        });
        logger.info(`Antwort von Google für EAN: ${response.status}`);
        const $ = cheerio.load(response.data);

        let eanUrlCount = 0;
        $('a').each((_, element) => {
          if (eanUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && url.startsWith('/url?q=')) {
            const cleanUrl = url.split('&')[0].replace('/url?q=', '');
            if (!cleanUrl.includes('google.com') && !cleanUrl.includes('/search')) {
              allUrls.push(cleanUrl);
              eanUrls.push(cleanUrl);
              eanUrlCount++;
            }
          }
        });
        logger.info(`Gefundene URLs für EAN ${ean}: ${eanUrls}`);
      }

      // Suche mit Name falls vorhanden
      if (name) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(name)}`;
        logger.info(`Suche mit Name, URL: ${searchUrl}`);
        const response = await axios.get(searchUrl, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 10000, // 10 Sekunden Timeout
        });
        logger.info(`Antwort von Google für Name: ${response.status}`);
        const $ = cheerio.load(response.data);

        let nameUrlCount = 0;
        $('a').each((_, element) => {
          if (nameUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && url.startsWith('/url?q=')) {
            const cleanUrl = url.split('&')[0].replace('/url?q=', '');
            if (!cleanUrl.includes('google.com') && !cleanUrl.includes('/search')) {
              allUrls.push(cleanUrl);
              nameUrls.push(cleanUrl);
              nameUrlCount++;
            }
          }
        });
        logger.info(`Gefundene URLs für Name ${name}: ${nameUrls}`);
      }

      // Filter URLs basierend auf dem Inhalt der Webseiten
      const filteredUrls = await this.filterUrlsByContent(allUrls, articleNo, ean, name);
      logger.info(`Gefilterte URLs: ${filteredUrls}`);

      return { allUrls: [...new Set(filteredUrls)], articleNoUrls, eanUrls, nameUrls }; // Entferne Duplikate
    } catch (error) {
      logger.error('Error searching product URLs:', error);
      return { allUrls: [], articleNoUrls: [], eanUrls: [], nameUrls: [] };
    }
  }

  private async filterUrlsByContent(urls: string[], articleNo?: string, ean?: string, name?: string): Promise<string[]> {
    const validUrls: string[] = [];

    for (const url of urls) {
      try {
        // Zufällige Verzögerung zwischen 1 und 3 Sekunden
        await this.delay(Math.floor(Math.random() * 2000) + 1000);

        const response = await axios.get(url, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 10000, // 10 Sekunden Timeout
          maxRedirects: 5, // Begrenze die Anzahl der Weiterleitungen
        });
        const $ = cheerio.load(response.data);
        const pageContent = $('body').text();

        if ((articleNo && pageContent.includes(articleNo)) || (ean && pageContent.includes(ean)) || (name && pageContent.includes(name))) {
          validUrls.push(url);
        }
      } catch (error) {
        logger.error(`Error fetching content from URL: ${url}`, error);
      }
    }

    return validUrls;
  }
}