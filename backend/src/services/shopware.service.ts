import Shopware from 'shopware-api-client'
import { Service } from 'typedi'
import { SHOPWARE_HOST, SHOPWARE_ACCESS_TOKEN, SHOPWARE_CLIENT_ID } from '@config'
import { HttpException } from '@exceptions/httpException'

@Service()
export class ShopwareService {
  private client: Shopware;

  constructor() {
    this.client = new Shopware({
      host: `${process.env.SHOPWARE_HOST}`,
      apiKey: `${process.env.SHOPWARE_ACCESS_TOKEN}`,
      user: `${process.env.SHOPWARE_CLIENT_ID}`,
    });
  }

  public async getArticles() {
    try {
      const response = await this.client.getArticles();
      return response;
    } catch (error) {
      throw new HttpException(500, 'Error fetching products from Shopware');
    }
  }

  public async getArticle(productId: string) {
    try {
      const response = await this.client.getArticle(productId);
      return response;
    } catch (error) {
      throw new HttpException(500, 'Error fetching product from Shopware');
    }
  }
}