import { Router } from 'express';
import { ShopwareController } from '@controllers/shopware.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class ShopwareRoute implements Routes {
  public path = '/shopware';
  public router = Router();
  public shopwareController = new ShopwareController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/products`, this.shopwareController.getArticles);
    this.router.get(`${this.path}/products/:id`, this.shopwareController.getArticle);
  }
}
