import { Plus } from 'lucide-react';
import type { MenuItem } from '@/store/useStore';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuCard = ({ item, onAdd }: MenuCardProps) => {
  return (
    <button
      onClick={() => onAdd(item)}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-card pos-shadow hover:pos-shadow-lg transition-all duration-200 active:scale-[0.97] cursor-pointer border border-border"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="text-left">
          <h3 className="font-semibold text-card-foreground text-sm">{item.name}</h3>
          <p className="text-primary font-bold text-lg">₹{item.price}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
          <Plus className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
};

export default MenuCard;
