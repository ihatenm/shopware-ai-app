import { Service } from 'typedi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';

@Service()
export class UrlAnalyzerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async analyzeUrls(productId: number): Promise<{
    prices: number[];
    descriptions: string[];
    specifications: Record<string, string>[];
  }> {
    try {
      // Hole gespeicherte URLs aus der Datenbank
      const urlData = await this.prisma.productUrls.findUnique({
        where: { id: productId }
      });

      if (!urlData || !urlData.urls.length) {
        logger.warn(`Keine URLs für Produkt ${productId} gefunden`);
        return { prices: [], descriptions: [], specifications: [] };
      }

      const results = {
        prices: [] as number[],
        descriptions: [] as string[],
        specifications: [] as Record<string, string>[]
      };

      // Analysiere jede URL
      for (const url of urlData.urls) {
        try {
          const pageData = await this.scrapePageData(url);
          if (pageData.price) results.prices.push(pageData.price);
          if (pageData.description) results.descriptions.push(pageData.description);
          if (pageData.specifications) results.specifications.push(pageData.specifications);
        } catch (error) {
          logger.error(`Fehler beim Analysieren von URL ${url}:`, error);
          continue;
        }
      }

      return results;
    } catch (error) {
      logger.error(`Fehler beim URL-Analysevorgang für Produkt ${productId}:`, error);
      throw error;
    }
  }

  private async scrapePageData(url: string): Promise<{
    price?: number;
    description?: string;
    specifications?: Record<string, string>;
  }> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    return {
      price: this.extractPrice($),
      description: this.extractDescription($),
      specifications: this.extractSpecifications($)
    };
  }

  private extractPrice($: cheerio.CheerioAPI): number | undefined {
    // Suche nach typischen Preiselementen
    const priceText = $('[itemprop="price"], .price, span[class*="price"]')
      .first()
      .text()
      .trim()
      .replace(/[^0-9.,]/g, '');
    
    return priceText ? parseFloat(priceText.replace(',', '.')) : undefined;
  }

  private extractDescription($: cheerio.CheerioAPI): string | undefined {
    return $('[itemprop="description"], .description, div[class*="description"]')
      .first()
      .text()
      .trim();
  }

  private extractSpecifications($: cheerio.CheerioAPI): Record<string, string> {
    const specs: Record<string, string> = {};
    
    // Suche nach Produktspezifikationen in verschiedenen Formaten
    $('table[class*="specification"], dl[class*="specification"]').each((_, element) => {
      $(element).find('tr, dt').each((_, row) => {
        const key = $(row).find('th, dt').text().trim();
        const value = $(row).find('td, dd').text().trim();
        if (key && value) specs[key] = value;
      });
    });

    return specs;
  }
}