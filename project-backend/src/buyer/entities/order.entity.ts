export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export class OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export class Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  addressId?: string;
  note?: string;
  createdAt: Date;
}