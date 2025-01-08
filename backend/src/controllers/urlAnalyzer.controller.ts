import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { urlAnalyzerService } from '@services/urlAnalyzer.service';

export class urlAnalyzerController {
  public urlAnalyzerService = Container.get(urlAnalyzerService);

  public analyzeProductUrlsById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.urlAnalyzerService.analyzeProductUrlsById(parseInt(id, 10));
      res.status(200).json({ message: 'Product URLs analyzed successfully' });
    } catch (error) {
      next(error);
    }
  };
}