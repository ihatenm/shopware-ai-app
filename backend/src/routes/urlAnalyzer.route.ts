import { Router } from 'express';
import { UrlAnalyzerController } from '@controllers/urlAnalyzer.controller';
import { Routes } from '@interfaces/routes.interface';

export class UrlAnalyzerRoute implements Routes {
  public path = '/urlanalyzer';
  public router = Router();
  public urlAnalyzerController = new UrlAnalyzerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/analyze/:productId`,
      this.urlAnalyzerController.analyzeProductUrls
    );
  }
}