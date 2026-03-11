import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import idlyImg from '@/assets/idly.jpg';
import dosaImg from '@/assets/dosa.jpg';
import pooriImg from '@/assets/poori.jpg';
import vadaiImg from '@/assets/vadai.jpg';
import teaImg from '@/assets/tea.jpg';
import coffeeImg from '@/assets/coffee.jpg';
import juiceImg from '@/assets/juice.jpg';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
}

interface StoreState {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  placeOrder: () => void;
}

const defaultMenu: MenuItem[] = [
  { id: '1', name: 'Idly', price: 30, image: idlyImg },
  { id: '2', name: 'Dosa', price: 50, image: dosaImg },
  { id: '3', name: 'Poori', price: 40, image: pooriImg },
  { id: '4', name: 'Vadai', price: 25, image: vadaiImg },
  { id: '5', name: 'Tea', price: 15, image: teaImg },
  { id: '6', name: 'Coffee', price: 20, image: coffeeImg },
  { id: '7', name: 'Juice', price: 35, image: juiceImg },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      menuItems: defaultMenu,
      cart: [],
      orders: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((c) => c.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((c) => c.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) return { cart: state.cart.filter((c) => c.id !== id) };
          return {
            cart: state.cart.map((c) => (c.id === id ? { ...c, quantity } : c)),
          };
        }),

      clearCart: () => set({ cart: [] }),

      getTotal: () => get().cart.reduce((sum, c) => sum + c.price * c.quantity, 0),

      addMenuItem: (item) =>
        set((state) => ({ menuItems: [...state.menuItems, item] })),

      updateMenuItem: (id, updates) =>
        set((state) => ({
          menuItems: state.menuItems.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      deleteMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((m) => m.id !== id),
        })),

      placeOrder: () =>
        set((state) => {
          const total = state.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
          const order: Order = {
            id: Date.now().toString(),
            items: [...state.cart],
            total,
            date: new Date().toISOString(),
          };
          return { orders: [...state.orders, order], cart: [] };
        }),
    }),
    { name: 'pos-store' }
  )
);
