import { Router } from 'express';
import { urlAnalyzerController } from '@controllers/urlAnalyzer.controller';
import { Routes } from '@interfaces/routes.interface';

export class urlAnalyzerRoute implements Routes {
  public path = '/urlanalyzer';
  public router = Router();
  public urlAnalyzerController = new urlAnalyzerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/analyze/:id`, this.urlAnalyzerController.analyzeProductUrlsById);
  }
}