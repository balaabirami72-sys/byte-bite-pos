import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/hooks/useAuth';
import MenuCard from '@/components/MenuCard';
import CartPanel from '@/components/CartPanel';
import AdminPanel from '@/components/AdminPanel';
import ReportsPanel from '@/components/ReportsPanel';
import AdminGate, { lockAdmin, isAdminUnlocked } from '@/components/AdminGate';
import { UtensilsCrossed, LayoutGrid, Settings, BarChart3, ShoppingCart, X, LogIn, LogOut, Unlock } from 'lucide-react';

type Tab = 'menu' | 'admin' | 'reports';

const Index = () => {
  const { menuItems, addToCart, cart } = useStore();
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('menu');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [, force] = useState(0);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const adminUnlocked = isAdminUnlocked();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'menu', label: 'Menu', icon: <LayoutGrid className="h-5 w-5" /> },
    { key: 'admin', label: 'Admin', icon: <Settings className="h-5 w-5" /> },
    { key: 'reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold text-foreground">FoodPOS</h1>
        </div>
        <nav className="flex gap-1">
          {tabs.map((t) => {
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={signOut}
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
              title={user.email ?? ''}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">Sign in</span>
            </Link>
          )}
          {/* Mobile cart toggle */}
          <button
            onClick={() => setMobileCartOpen(!mobileCartOpen)}
            className="relative lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {tab === 'menu' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
              {menuItems.map((item) => (
                <MenuCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </div>
          )}
          {tab === 'admin' && (
            isAdmin ? (
              <AdminPanel />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Lock className="h-7 w-7 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold">Admin access only</h2>
                <p className="text-muted-foreground max-w-sm">
                  Only administrators can edit the menu and prices.
                </p>
                {!user && (
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <LogIn className="h-4 w-4" /> Sign in as admin
                  </Link>
                )}
              </div>
            )
          )}
          {tab === 'reports' && <ReportsPanel />}
        </main>

        {/* Desktop cart */}
        <aside className="hidden lg:flex w-[340px] flex-shrink-0">
          <CartPanel />
        </aside>

        {/* Mobile cart overlay */}
        {mobileCartOpen && (
          <div className="absolute inset-0 z-50 lg:hidden flex">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileCartOpen(false)} />
            <div className="relative ml-auto w-full max-w-sm h-full">
              <button
                onClick={() => setMobileCartOpen(false)}
                className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <CartPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
