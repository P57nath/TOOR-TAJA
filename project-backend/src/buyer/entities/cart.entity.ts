export class CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export class Cart {
  buyerId: string;
  items: CartItem[];
  coupon?: string;
  updatedAt: Date;
}
