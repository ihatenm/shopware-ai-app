import { Service } from 'typedi';
import { ShopwareProductData } from '@interfaces/product.interface';

@Service()
export class ProductValidationService {
  public findMissingFields(product: ShopwareProductData): string[] {
    const missingFields: string[] = [];

    // Validate ShopwareProductData fields
    if (!product.name) missingFields.push('name');
    if (!product.description) missingFields.push('description');
    if (!product.descriptionLong) missingFields.push('descriptionLong');
    if (!product.added) missingFields.push('added');
    if (!product.active) missingFields.push('active');
    if (!product.pseudoSales) missingFields.push('pseudoSales');
    if (!product.highlight) missingFields.push('highlight');
    if (!product.keywords) missingFields.push('keywords');
    if (!product.metaTitle) missingFields.push('metaTitle');
    if (!product.changed) missingFields.push('changed');
    if (!product.priceGroupActive) missingFields.push('priceGroupActive');
    if (!product.lastStock) missingFields.push('lastStock');
    if (!product.crossBundleLook) missingFields.push('crossBundleLook');
    if (!product.notification) missingFields.push('notification');
    if (!product.template) missingFields.push('template');
    if (!product.mode) missingFields.push('mode');
    if (!product.availableFrom) missingFields.push('availableFrom');
    if (!product.availableTo) missingFields.push('availableTo');
    
    // Validate MainDetail fields
    if (!product.mainDetail.id) missingFields.push('mainDetail.id');
    if (!product.mainDetail.articleId) missingFields.push('mainDetail.articleId');
    if (!product.mainDetail.unitId) missingFields.push('mainDetail.unitId');
    if (!product.mainDetail.number) missingFields.push('mainDetail.number');
    if (!product.mainDetail.supplierNumber) missingFields.push('mainDetail.supplierNumber');
    if (!product.mainDetail.kind) missingFields.push('mainDetail.kind');
    if (!product.mainDetail.additionalText) missingFields.push('mainDetail.additionalText');
    if (!product.mainDetail.active) missingFields.push('mainDetail.active');
    if (!product.mainDetail.inStock) missingFields.push('mainDetail.inStock');
    if (!product.mainDetail.stockMin) missingFields.push('mainDetail.stockMin');
    if (!product.mainDetail.lastStock) missingFields.push('mainDetail.lastStock');
    if (!product.mainDetail.weight) missingFields.push('mainDetail.weight');
    if (!product.mainDetail.width) missingFields.push('mainDetail.width');
    if (!product.mainDetail.len) missingFields.push('mainDetail.len');
    if (!product.mainDetail.height) missingFields.push('mainDetail.height');
    if (!product.mainDetail.ean) missingFields.push('mainDetail.ean');
    if (!product.mainDetail.purchasePrice) missingFields.push('mainDetail.purchasePrice');
    if (!product.mainDetail.position) missingFields.push('mainDetail.position');
    if (!product.mainDetail.minPurchase) missingFields.push('mainDetail.minPurchase');
    if (!product.mainDetail.purchaseSteps) missingFields.push('mainDetail.purchaseSteps');
    if (!product.mainDetail.maxPurchase) missingFields.push('mainDetail.maxPurchase');
    if (!product.mainDetail.purchaseUnit) missingFields.push('mainDetail.purchaseUnit');
    if (!product.mainDetail.referenceUnit) missingFields.push('mainDetail.referenceUnit');
    if (!product.mainDetail.packUnit) missingFields.push('mainDetail.packUnit');
    if (!product.mainDetail.shippingFree) missingFields.push('mainDetail.shippingFree');
    if (!product.mainDetail.releaseDate) missingFields.push('mainDetail.releaseDate');
    if (!product.mainDetail.shippingTime) missingFields.push('mainDetail.shippingTime');

    // Validate Attribute Fields
    if (!product.mainDetail.attribute.articleDetailId) missingFields.push('mainDetail.attribute.articleDetailId');
    if (!product.mainDetail.attribute.dreiscSeoUrl) missingFields.push('mainDetail.attribute.dreiscSeoUrl');
    if (!product.mainDetail.attribute.dreiscSeoTitle) missingFields.push('mainDetail.attribute.dreiscSeoTitle');
    if (!product.mainDetail.attribute.dreiscSeoTitleReplace) missingFields.push('mainDetail.attribute.dreiscSeoTitleReplace');
    if (!product.mainDetail.attribute.dreiscRobotsTag) missingFields.push('mainDetail.attribute.dreiscRobotsTag');
    if (!product.mainDetail.attribute.dreiscFacebookDescription) missingFields.push('mainDetail.attribute.dreiscFacebookDescription');
    if (!product.mainDetail.attribute.dreiscTwitterDescription) missingFields.push('mainDetail.attribute.dreiscTwitterDescription');
    if (!product.mainDetail.attribute.maxorderprocessingtime) missingFields.push('mainDetail.attribute.maxorderprocessingtime');
    if (!product.mainDetail.attribute.pickwareIncomingStock) missingFields.push('mainDetail.attribute.pickwareIncomingStock');
    if (!product.mainDetail.attribute.pickwarePhysicalStockForSale) missingFields.push('mainDetail.attribute.pickwarePhysicalStockForSale');
    if (!product.mainDetail.attribute.pickwareStockManagementDisabled) missingFields.push('mainDetail.attribute.pickwareStockManagementDisabled');
    if (!product.mainDetail.attribute.pickwareStockInitialized) missingFields.push('mainDetail.attribute.pickwareStockInitialized');
    if (!product.mainDetail.attribute.pickwareStockInitializationTime) missingFields.push('mainDetail.attribute.pickwareStockInitializationTime');
    if (!product.mainDetail.attribute.pickwareNotRelevantForPicking) missingFields.push('mainDetail.attribute.pickwareNotRelevantForPicking');
    if (!product.mainDetail.attribute.swkweShowSoldout) missingFields.push('mainDetail.attribute.swkweShowSoldout');
    if (!product.mainDetail.attribute.swkweCategoryShowSoldout) missingFields.push('mainDetail.attribute.swkweCategoryShowSoldout');
    if (!product.mainDetail.attribute.idealoDirektkauf) missingFields.push('mainDetail.attribute.idealoDirektkauf');
    if (!product.mainDetail.attribute.wish) missingFields.push('mainDetail.attribute.wish');
    if (!product.mainDetail.attribute.auslauf) missingFields.push('mainDetail.attribute.auslauf');
    if (!product.mainDetail.attribute.nomarketplace) missingFields.push('mainDetail.attribute.nomarketplace');
    if (!product.mainDetail.attribute.pixupExcludeSitemap) missingFields.push('mainDetail.attribute.pixupExcludeSitemap');
    if (!product.mainDetail.attribute.digi1Showleftsidebar) missingFields.push('mainDetail.attribute.digi1Showleftsidebar');
    if (!product.mainDetail.attribute.attrBulkyGoods) missingFields.push('mainDetail.attribute.attrBulkyGoods');
    if (!product.mainDetail.attribute.scha1Tabfield1Io) missingFields.push('mainDetail.attribute.scha1Tabfield1Io');
    if (!product.mainDetail.attribute.scha1Tabfield2Io) missingFields.push('mainDetail.attribute.scha1Tabfield2Io');
    if (!product.mainDetail.attribute.scha1Tabfield3Io) missingFields.push('mainDetail.attribute.scha1Tabfield3Io');
    if (!product.mainDetail.attribute.scha1Tabfield4Io) missingFields.push('mainDetail.attribute.scha1Tabfield4Io');
    if (!product.mainDetail.attribute.scha1Tabfield5Io) missingFields.push('mainDetail.attribute.scha1Tabfield5Io');
    if (!product.mainDetail.attribute.scha1Tabfield6Io) missingFields.push('mainDetail.attribute.scha1Tabfield6Io');
    if (!product.mainDetail.attribute.scha1Tabfield7Io) missingFields.push('mainDetail.attribute.scha1Tabfield7Io');
    if (!product.mainDetail.attribute.scha1Tabfield8Io) missingFields.push('mainDetail.attribute.scha1Tabfield8Io');
    if (!product.mainDetail.attribute.scha1Tabfield9Io) missingFields.push('mainDetail.attribute.scha1Tabfield9Io');
    if (!product.mainDetail.attribute.scha1Tabfield10Io) missingFields.push('mainDetail.attribute.scha1Tabfield10Io');
    if (!product.mainDetail.attribute.repricing) missingFields.push('mainDetail.attribute.repricing');
    if (!product.mainDetail.attribute.preisbindung) missingFields.push('mainDetail.attribute.preisbindung');
    if (!product.mainDetail.attribute.ottoGroupAktiv) missingFields.push('mainDetail.attribute.ottoGroupAktiv');
    if (!product.mainDetail.attribute.sonderposten) missingFields.push('mainDetail.attribute.sonderposten');
    if (!product.mainDetail.attribute.googleVerfuegbarkeit) missingFields.push('mainDetail.attribute.googleVerfuegbarkeit');
    if (!product.mainDetail.attribute.aktionspreisBefristet) missingFields.push('mainDetail.attribute.aktionspreisBefristet');
    if (!product.mainDetail.attribute.dvsnArticleShippingMethodRestriction) missingFields.push('mainDetail.attribute.dvsnArticleShippingMethodRestriction');

    return missingFields;
  }

  public sortProductsByMissingFields(products: ShopwareProductData[]): ShopwareProductData[] {
    return products.sort((a, b) => this.findMissingFields(a).length - this.findMissingFields(b).length);
  }
}