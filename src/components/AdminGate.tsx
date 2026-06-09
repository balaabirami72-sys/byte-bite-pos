import { useEffect, useRef, useState } from 'react';
import { Lock, Delete } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PIN = '1234';
const STORAGE_KEY = 'admin_unlocked';

export const isAdminUnlocked = () => sessionStorage.getItem(STORAGE_KEY) === '1';
export const lockAdmin = () => sessionStorage.removeItem(STORAGE_KEY);

interface Props {
  title?: string;
  children: React.ReactNode;
}

const AdminGate = ({ title = 'Admin access', children }: Props) => {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!unlocked) inputRef.current?.focus();
  }, [unlocked]);

  const submit = (value: string) => {
    if (value === ADMIN_PIN) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
      toast.success('Admin unlocked');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setPin('');
      toast.error('Wrong admin password');
    }
  };

  const handleChange = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4);
    setPin(clean);
    if (clean.length === 4) submit(clean);
  };

  const pressKey = (k: string) => {
    if (k === 'del') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) submit(next);
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">Enter the 4-digit admin password</p>
      </div>

      <div className={`flex gap-3 ${shake ? 'animate-[shake_0.4s]' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-14 w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
              pin.length > i ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            {pin[i] ? '•' : ''}
          </div>
        ))}
      </div>

      {/* hidden native input for keyboard typing */}
      <input
        ref={inputRef}
        value={pin}
        onChange={(e) => handleChange(e.target.value)}
        inputMode="numeric"
        className="sr-only"
        autoFocus
      />

      <div className="grid grid-cols-3 gap-3 w-64">
        {['1','2','3','4','5','6','7','8','9'].map((n) => (
          <button
            key={n}
            onClick={() => pressKey(n)}
            className="h-14 rounded-xl bg-secondary text-secondary-foreground text-xl font-semibold hover:bg-secondary/80 active:scale-95 transition"
          >
            {n}
          </button>
        ))}
        <div />
        <button
          onClick={() => pressKey('0')}
          className="h-14 rounded-xl bg-secondary text-secondary-foreground text-xl font-semibold hover:bg-secondary/80 active:scale-95 transition"
        >
          0
        </button>
        <button
          onClick={() => pressKey('del')}
          className="h-14 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 active:scale-95 transition"
        >
          <Delete className="h-5 w-5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">Hint: default password is 1234</p>
    </div>
  );
};

export default AdminGate;
