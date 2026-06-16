import { CartItem } from "./CartItem";

interface CartItemData {
  productId: number;
  thumbnail: string;
  category: string;
  title: string;
  quantity: number;
  price: number;
}

interface CartListProps {
  items: CartItemData[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

export function CartList({ items, onIncrease, onDecrease, onRemove }: CartListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <CartItem
          key={item.productId}
          {...item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}