export interface PurchaseOrder {
  id: string;

  number: string;

  description: string;

  status: number;

  statusString: string;

  orderDate: string;

  vendorId: string;

  vendorName: string;

  buyerId: string;

  buyerName: string;

  currencyName: string;

  total: number;
}