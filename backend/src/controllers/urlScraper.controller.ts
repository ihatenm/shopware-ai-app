import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { urlScraperService } from '@services/urlScraper.service';

export class urlScraperController {
  public urlScraperService = Container.get(urlScraperService);

  public scrapeProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.urlScraperService.scrapeProductUrls();
      res.status(200).json({ message: 'Product URLs scraped successfully' });
    } catch (error) {
      next(error);
    }
  };
  
  public scrapeSelectedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productIds } = req.body;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        res.status(400).json({ message: 'Invalid product IDs' });
        return;
      }

      await this.urlScraperService.scrapeSelectedProductUrls(productIds);
      res.status(200).json({ message: 'Selected product URLs scraped successfully' });
    } catch (error) {
      next(error);
    }
  };
}