import { NextFunction, Request, Response } from 'express';
import { ShopwareService } from '@services/shopware.service';

export class ShopwareController {
  public shopwareService = new ShopwareService();

  public getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.shopwareService.getArticles();
      res.status(200).json({ data: products});
    } catch (error) {
      next(error);
    }
  };

  public getArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = req.params.id;
      const product = await this.shopwareService.getArticle(productId);
      res.status(200).json({ data: product});
    } catch (error) {
      next(error);
    }
  };
}