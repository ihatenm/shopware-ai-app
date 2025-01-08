import { Service } from 'typedi';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { logger } from '@utils/logger';

@Service()
export class urlAnalyzerService {
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

  public async analyzeProductUrlsById(id: number): Promise<void> {
    try {
      const productUrl = await this.prisma.productUrls.findUnique({
        where: { id: id },
      });

      if (!productUrl) {
        throw new Error(`Product URL with ID ${id} not found`);
      }

      for (const url of productUrl.urls) {
        await this.analyzeUrl(url, productUrl.productId, productUrl.id);
      }
    } catch (error) {
      logger.error(`Error analyzing product URLs for ID ${id}:`, error);
      throw error;
    }
  }

  private async analyzeUrl(url: string, productId: number, productUrlId: number): Promise<void> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.setUserAgent(this.getRandomUserAgent());
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const html = await page.content();
      const $ = cheerio.load(html);

      // Extrahiere die benötigten Daten aus dem HTML
      const extractedData = this.extractData($);

      // Speichere die extrahierten Daten in der Datenbank
      await this.prisma.extractedData.create({
        data: {
          productId,
          productUrlId,
          url,
          data: extractedData,
        },
      });

      logger.info(`Successfully analyzed and saved data for URL: ${url}`);
    } catch (error) {
      logger.error(`Error analyzing URL ${url} for product ID ${productId}:`, error);
    } finally {
      await browser.close();
    }
  }

  private extractData($: cheerio.CheerioAPI): any {
    // Implementiere die Logik zur Extraktion der benötigten Daten aus dem HTML
    // Beispiel:
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    // Füge weitere Extraktionslogik hinzu

    return { title, description };
  }
}