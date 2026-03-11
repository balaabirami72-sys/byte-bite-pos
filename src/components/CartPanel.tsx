import { Minus, Plus, Trash2, ShoppingCart, QrCode, Printer, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const CartPanel = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, placeOrder } = useStore();
  const [showQR, setShowQR] = useState(false);
  const total = getTotal();

  const handlePay = () => {
    setShowQR(true);
  };

  const handleConfirmPayment = () => {
    placeOrder();
    setShowQR(false);
    toast.success('Payment received! Order placed successfully.');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Bill sent to printer!');
  };

  return (
    <div className="flex h-full flex-col bg-card border-l border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-card-foreground">Current Order</h2>
        {cart.length > 0 && (
          <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {cart.reduce((s, c) => s + c.quantity, 0)}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-sm">Tap items to add</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-md bg-secondary p-2">
              <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded bg-muted text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-bold text-card-foreground">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <p className="w-14 text-right text-sm font-bold text-card-foreground">₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex justify-between text-lg font-bold text-card-foreground">
            <span>Total</span>
            <span className="text-primary">₹{total}</span>
          </div>

          {showQR ? (
            <div className="flex flex-col items-center gap-3 rounded-lg bg-secondary p-4">
              <p className="text-sm font-medium text-secondary-foreground">Scan to Pay ₹{total}</p>
              <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-card border-2 border-primary">
                <QrCode className="h-28 w-28 text-foreground" />
              </div>
              <div className="flex gap-2 w-full">
                <Button onClick={() => setShowQR(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleConfirmPayment} className="flex-1 bg-accent text-accent-foreground hover:opacity-90">
                  Paid ✓
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handlePay} className="flex-1 bg-accent text-accent-foreground hover:opacity-90 h-12 text-base font-bold">
                <QrCode className="mr-2 h-5 w-5" /> Pay Now
              </Button>
              <Button onClick={handlePrint} variant="outline" className="h-12">
                <Printer className="h-5 w-5" />
              </Button>
              <Button onClick={clearCart} variant="outline" className="h-12 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPanel;
