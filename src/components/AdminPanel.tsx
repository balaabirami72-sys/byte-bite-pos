import { useState } from 'react';
import { useStore, type MenuItem } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<MenuItem>>({});
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '' });

  const handleEdit = (item: MenuItem) => {
    setEditing(item.id);
    setEditData({ name: item.name, price: item.price });
  };

  const handleSave = (id: string) => {
    updateMenuItem(id, editData);
    setEditing(null);
    toast.success('Item updated!');
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    toast.success('Item deleted!');
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Please fill name and price');
      return;
    }
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: Number(newItem.price),
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    };
    addMenuItem(item);
    setNewItem({ name: '', price: '', image: '' });
    setAdding(false);
    toast.success('Item added!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewItem((p) => ({ ...p, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Manage Menu</h2>
        <Button onClick={() => setAdding(!adding)} className="bg-primary text-primary-foreground">
          <Plus className="mr-1 h-4 w-4" /> Add Item
        </Button>
      </div>

      {adding && (
        <div className="mb-6 rounded-lg border border-border bg-card p-4 space-y-3">
          <Input placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
          <Input type="number" placeholder="Price (₹)" value={newItem.price} onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))} />
          <div>
            <label className="text-sm text-muted-foreground">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
          </div>
          {newItem.image && <img src={newItem.image} alt="preview" className="h-20 w-20 rounded object-cover" />}
          <div className="flex gap-2">
            <Button onClick={handleAdd} className="bg-accent text-accent-foreground"><Save className="mr-1 h-4 w-4" /> Save</Button>
            <Button variant="outline" onClick={() => setAdding(false)}><X className="mr-1 h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
            {editing === item.id ? (
              <>
                <Input className="flex-1" value={editData.name || ''} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} />
                <Input className="w-24" type="number" value={editData.price || ''} onChange={(e) => setEditData((p) => ({ ...p, price: Number(e.target.value) }))} />
                <Button size="sm" onClick={() => handleSave(item.id)} className="bg-accent text-accent-foreground"><Save className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium text-card-foreground">{item.name}</span>
                <span className="font-bold text-primary">₹{item.price}</span>
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
