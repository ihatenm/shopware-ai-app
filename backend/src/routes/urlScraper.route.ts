import { Router } from 'express';
import { urlScraperController } from '@controllers/urlScraper.controller';
import { Routes } from '@interfaces/routes.interface';

export class urlScraperRoute implements Routes {
  public path = '/urlscraper';
  public router = Router();
  public urlScraperController = new urlScraperController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/products`, this.urlScraperController.scrapeProducts);
    this.router.post(`${this.path}/products/selected`, this.urlScraperController.scrapeSelectedProducts);
  }
}