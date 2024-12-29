import { Router } from 'express';
import { ProductValidationController } from '@controllers/productValidation.controller';
import { Routes } from '@interfaces/routes.interface';

export class ProductValidationRoute implements Routes {
  public path = '/products/validation';
  public router = Router();
  public productValidationController = new ProductValidationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.productValidationController.getProductsWithMissingFields);
  }
}