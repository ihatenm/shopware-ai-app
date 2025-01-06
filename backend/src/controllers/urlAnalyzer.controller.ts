import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { UrlAnalyzerService } from '@services/urlAnalyzer.service';

export class UrlAnalyzerController {
  public urlAnalyzerService = Container.get(UrlAnalyzerService);

  public analyzeProductUrls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { productId } = req.params;
      const analysisResults = await this.urlAnalyzerService.analyzeUrls(parseInt(productId));
      res.status(200).json(analysisResults);
    } catch (error) {
      next(error);
    }
  };
}