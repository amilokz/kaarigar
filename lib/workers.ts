// Worker data access: seed JSON + locally registered workers.
import seedWorkers from '@/data/workers.json';
import { load, save } from './store';

export type Review = { n: string; t: string; r: number };

export type Worker = {
  id: string;
  name: string;
  category: string;
  area: string;
  rate: number;
  rating: number;
  jobs: number;
  availableToday: boolean;
  verified: boolean;
  experience: number;
  phone: string;
  cnic: string;
  skills: string[];
  reviews: Review[];
  about: string;
  source: string;
  status?: 'pending' | 'approved' | 'rejected';
  photoPreview?: string | null;
};

export type Booking = {
  ref: string;
  workerId: string;
  workerName: string;
  category: string;
  area: string;
  job: string;
  date: string;
  time: string;
  stage: number; // 0..3
  rating: number | null;
  createdAt: string;
  paymentMethod?: 'Cash' | 'Easypaisa' | 'JazzCash';
  paid?: boolean;
};

export type Complaint = {
  id: string;
  ref?: string;
  name: string;
  text: string;
  createdAt: string;
  resolved: boolean;
};

const SEED: Worker[] = seedWorkers as Worker[];

/** All workers = seed + user-registered (localStorage). */
export function getWorkers(): Worker[] {
  const extra = typeof window === 'undefined' ? [] : load<Worker[]>('extra-workers', []);
  return [...extra, ...SEED];
}

export function getWorker(id: string): Worker | undefined {
  return getWorkers().find((w) => w.id === id);
}

export function addWorker(w: Worker): void {
  const extra = load<Worker[]>('extra-workers', []);
  save('extra-workers', [w, ...extra]);
}

/** Update a registered (non-seed) worker, e.g. approve/reject, availability. */
export function updateWorker(id: string, patch: Partial<Worker>): void {
  const extra = load<Worker[]>('extra-workers', []);
  save('extra-workers', extra.map((w) => (w.id === id ? { ...w, ...patch } : w)));
}

export function getBookings(): Booking[] {
  return typeof window === 'undefined' ? [] : load<Booking[]>('bookings', []);
}

export function addBooking(b: Booking): void {
  const all = load<Booking[]>('bookings', []);
  save('bookings', [b, ...all]);
}

export function updateBooking(ref: string, patch: Partial<Booking>): void {
  const all = load<Booking[]>('bookings', []);
  save('bookings', all.map((b) => (b.ref === ref ? { ...b, ...patch } : b)));
}

export function getComplaints(): Complaint[] {
  return typeof window === 'undefined' ? [] : load<Complaint[]>('complaints', []);
}

export function addComplaint(c: Complaint): void {
  const all = load<Complaint[]>('complaints', []);
  save('complaints', [c, ...all]);
}

export function updateComplaint(id: string, patch: Partial<Complaint>): void {
  const all = load<Complaint[]>('complaints', []);
  save('complaints', all.map((c) => (c.id === id ? { ...c, ...patch } : c)));
}

/** Admin-disabled categories / areas (stored in localStorage). */
export function getDisabledCats(): string[] {
  return typeof window === 'undefined' ? [] : load<string[]>('disabled-cats', []);
}
export function getDisabledAreas(): string[] {
  return typeof window === 'undefined' ? [] : load<string[]>('disabled-areas', []);
}
export function toggleDisabled(kind: 'cats' | 'areas', id: string): void {
  const key = kind === 'cats' ? 'disabled-cats' : 'disabled-areas';
  const cur = load<string[]>(key, []);
  save(key, cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
}

export function initials(name: string): string {  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

const AVATAR_COLORS = [
  'bg-orange-600', 'bg-stone-700', 'bg-amber-600', 'bg-orange-800',
  'bg-stone-800', 'bg-yellow-700', 'bg-orange-500', 'bg-neutral-700',
];

export function avatarColor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
