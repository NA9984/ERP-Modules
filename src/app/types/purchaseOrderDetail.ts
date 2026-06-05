export interface PurchaseOrderDetail {
  id: string;

  purchaseOrderId: string;

  purchaseOrderNumber: string;

  vendorName: string;

  orderDate: string;

  productId: string;

  productName: string;

  uomName: string;

  price: number;

  priceString: string;

  currencyName: string;

  quantity: number;

  subTotal: number;

  subTotalString: string;

  discAmt: number;

  discAmtString: string;

  beforeTax: number;

  beforeTaxString: string;

  taxRate: number;

  taxAmount: number;

  taxAmountString: string;

  total: number;

  totalString: string;

  status: number;

  statusString: string;
}