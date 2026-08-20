export type ItemType = {
  item_id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  type: "veg" | "nonveg";
  category: string;
  available: boolean;
  time_to_prepare: number;
};

export type OrderType = {
  order_id: string;
  booking_id: string;
  room: string;
  remarks: string;
  created_at: number;
  total_time_to_prepare: number;
  delay: number;
  discount: number;
  platform_fee?: number;
  gst?: number;
  platform_fee_gst?: number;
  status: string;
  guest_name: string;
  items: ItemType[];
};

export const getOrderTotal = (order: OrderType) => {
  const subtotal = order.items.reduce((total, item) => total + item.price * item.qty, 0);
  const discount = order.discount || 0;
  const platformFee = order.platform_fee || 0;
  const gst = order.gst || 0;
  const platformFeeGst = order.platform_fee_gst || 0;
  return subtotal - discount + gst + platformFee + platformFeeGst;
};
