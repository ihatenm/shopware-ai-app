import { Service } from 'typedi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import type { ShopwareProductData } from '@interfaces/product.interface';

@Service()
export class urlScraperService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

        // Debugging-Log: Überprüfe die extrahierten URLs
        console.log(`Extrahierte URLs für Produkt ${product.id}:`, urls);

        if (urls.length > 0) {
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
          console.log(`URLs in der Datenbank gespeichert für Produkt ${product.id}:`, urls); // Debugging-Log
        } else {
          console.log(`Keine URLs gefunden für Produkt ${product.id}`);
        }

        // Füge eine zufällige Verzögerung zwischen 1 und 3 Sekunden ein
        await this.delay(Math.random() * 2000 + 1000);
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

        // Debugging-Log: Überprüfe die extrahierten URLs
        console.log(`Extrahierte URLs für Produkt ${product.id}:`, urls);

        if (urls.length > 0) {
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
          console.log(`URLs in der Datenbank gespeichert für Produkt ${product.id}:`, urls); // Debugging-Log
        } else {
          console.log(`Keine URLs gefunden für Produkt ${product.id}`);
        }

        // Füge eine zufällige Verzögerung zwischen 1 und 3 Sekunden ein
        await this.delay(Math.random() * 2000 + 1000);
      }
    } catch (error) {
      console.error('Error scraping selected product URLs:', error);
      throw error;
    }
  }

  private async searchProductUrls(articleNo: string, ean?: string): Promise<string[]> {
    const urls: string[] = [];
    const URL_LIMIT_PER_TYPE = 3; // 3 URLs pro Suchtyp (articleNo und EAN)
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0.3 Safari/602.3.12',
      // Weitere User-Agent-Strings hinzufügen
    ];

    try {
      // Suche mit Artikelnummer
      if (articleNo) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(articleNo)}`;
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
          },
        });
        const $ = cheerio.load(response.data);

        // Extrahiere URLs aus Google Suchergebnissen (limitiert auf 3)
        let articleUrlCount = 0;
        $('.g .r a').each((_, element) => {
          if (articleUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && !url.includes('google.com')) {
            urls.push(url);
            articleUrlCount++;
            console.log(`Extrahierte URL: ${url}`); // Debugging-Log
          }
        });

        // Verzögerung einfügen
        await this.delay(Math.random() * 2000 + 1000); // Zufällige Verzögerung zwischen 1 und 3 Sekunden
      }

      // Suche mit EAN falls vorhanden
      if (ean) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(ean)}`;
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
          },
        });
        const $ = cheerio.load(response.data);

        let eanUrlCount = 0;
        $('.g .r a').each((_, element) => {
          if (eanUrlCount >= URL_LIMIT_PER_TYPE) return;
          const url = $(element).attr('href');
          if (url && !url.includes('google.com')) {
            urls.push(url);
            eanUrlCount++;
            console.log(`Extrahierte URL: ${url}`); // Debugging-Log
          }
        });

        // Verzögerung einfügen
        await this.delay(Math.random() * 2000 + 1000); // Zufällige Verzögerung zwischen 1 und 3 Sekunden
      }

      console.log(`Gesammelte URLs: ${urls}`); // Debugging-Log
      return [...new Set(urls)]; // Entferne Duplikate
    } catch (error) {
      console.error('Error searching product URLs:', error);
      return [];
    }
  }
}