import { Service } from 'typedi';
import { ShopwareProductData } from '@interfaces/product.interface';

@Service()
export class ProductValidationService {
  public findMissingFields(product: ShopwareProductData): string[] {
    const missingFields: string[] = [];

    if (!product.name) missingFields.push('name');
    if (!product.description) missingFields.push('description');
    if (!product.price) missingFields.push('price');
    if (!product.mainDetail.number) missingFields.push('mainDetail.number');
    if (!product.mainDetail.purchasePrice) missingFields.push('mainDetail.purchasePrice');
    if (!product.mainDetail.inStock) missingFields.push('mainDetail.inStock');
    // Füge weitere Felder hinzu, die überprüft werden sollen

    return missingFields;
  }

  public sortProductsByMissingFields(products: ShopwareProductData[]): ShopwareProductData[] {
    return products.sort((a, b) => this.findMissingFields(a).length - this.findMissingFields(b).length);
  }
}