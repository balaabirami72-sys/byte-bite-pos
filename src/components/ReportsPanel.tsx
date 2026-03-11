import { useStore } from '@/store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Award } from 'lucide-react';

const ReportsPanel = () => {
  const { orders } = useStore();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;

  // Most sold items
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemCounts[item.id]) {
        itemCounts[item.id] = { name: item.name, count: 0, revenue: 0 };
      }
      itemCounts[item.id].count += item.quantity;
      itemCounts[item.id].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  // Monthly data
  const monthlyData: Record<string, number> = {};
  orders.forEach((order) => {
    const month = new Date(order.date).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyData[month] = (monthlyData[month] || 0) + order.total;
  });

  const chartData = Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Sales Reports</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-card border border-border p-5 pos-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-card-foreground">₹{totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card border border-border p-5 pos-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-card-foreground">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-card border border-border p-5 pos-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
              <Award className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Item</p>
              <p className="text-2xl font-bold text-card-foreground">{topItems[0]?.name || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="rounded-lg bg-card border border-border p-5 pos-shadow">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(25 95% 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg bg-card border border-border p-5 pos-shadow">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Most Sold Items</h3>
        {topItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders yet. Start billing to see reports!</p>
        ) : (
          <div className="space-y-2">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3 rounded-md bg-secondary p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</span>
                <span className="flex-1 font-medium text-secondary-foreground">{item.name}</span>
                <span className="text-sm text-muted-foreground">{item.count} sold</span>
                <span className="font-bold text-primary">₹{item.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPanel;
