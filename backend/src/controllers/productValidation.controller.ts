import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ProductValidationService } from '@services/productValidation.service';
import { ShopwareService } from '@services/shopware.service';

export class ProductValidationController {
  public productValidationService = Container.get(ProductValidationService);
  public shopwareService = Container.get(ShopwareService);

  public getProductsWithMissingFields = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.shopwareService.getArticles();
      const sortedProducts = this.productValidationService.sortProductsByMissingFields(products);
      res.json(sortedProducts);
    } catch (error) {
      next(error);
    }
  };
}