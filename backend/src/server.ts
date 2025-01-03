import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ShopwareRoute } from '@routes/shopware.route';
import { ProductValidationRoute } from '@routes/productValidation.route';
import { urlScraperRoute } from '@routes/urlScraper.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([
    new UserRoute(), 
    new AuthRoute(), 
    new ShopwareRoute(), 
    new ProductValidationRoute(), 
    new urlScraperRoute()
]);

app.listen();
