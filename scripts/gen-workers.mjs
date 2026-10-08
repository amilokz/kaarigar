// Generates data/workers.json — 30 fictional workers, deterministic seed.
// Run: node scripts/gen-workers.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "data", "workers.json");

// deterministic PRNG (mulberry32)
let s = 42;
const rnd = () => {
  s |= 0; s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const range = (a, b) => Math.round(a + rnd() * (b - a));

const CATS = [
  { id: "electrician", min: 2500, max: 4000, exp: [3, 18], skills: ["Wiring", "Switch board", "Fan fitting", "DB box", "UPS fitting"] },
  { id: "plumber",     min: 2200, max: 3500, exp: [2, 16], skills: ["Pipe fitting", "Sanitary", "Tank cleaning", "Leakage repair", "Motor fitting"] },
  { id: "painter",     min: 2000, max: 3200, exp: [2, 15], skills: ["Wall paint", "Texture", "Polish", "Putty work", "Exterior"] },
  { id: "mason",       min: 2500, max: 4000, exp: [4, 20], skills: ["Brick work", "Plaster", "Tile fixing", "Marble", "Concrete"] },
  { id: "carpenter",   min: 2800, max: 4500, exp: [3, 18], skills: ["Door fitting", "Kitchen", "Wardrobe", "Furniture repair", "False ceiling"] },
  { id: "ac-tech",     min: 3000, max: 5000, exp: [2, 12], skills: ["AC install", "Gas refill", "Service", "Repair", "Split unit"] },
];

const FIRST = ["Muhammad", "Abdul", "Ghulam", "Chaudhry", "Malik", "Rana", "Sheikh", "Mian"];
const NAMES = ["Aslam", "Rashid", "Bilal", "Usman", "Tariq", "Naveed", "Shahid", "Arif", "Javed", "Khalid", "Farooq", "Nasir", "Sajid", "Adnan", "Faisal", "Waseem", "Irfan", "Zahid", "Akram", "Saleem", "Riaz", "Munir", "Anwar", "Hafeez", "Yousuf", "Tanveer", "Shabbir", "Abbas", "Rehman", "Imtiaz"];
const AREAS = ["Saddar", "Gulberg", "DHA Phase 2", "Model Town", "Cantt", "Township", "Johar Town", "Wapda Town", "Iqbal Town", "Shadman"];

const REVIEW_POOL = [
  { n: "Ahmed R.", t: "Waqt par aya, kaam saaf suthra kiya. Rate bhi munasib tha.", r: 5 },
  { n: "Bilal S.", t: "Bohat mehnati banda hai. Kaam ki guarantee di.", r: 5 },
  { n: "Usman T.", t: "Kaam theek hua, thora late aya tha lekin inform kar diya tha.", r: 4 },
  { n: "Kamran M.", t: "Professional kaam, safai ka khayal rakha. Dobara bulayenge.", r: 5 },
  { n: "Faisal J.", t: "Rate pehle se clear tha, koi extra charge nahi. Khush hoon.", r: 5 },
  { n: "Sana K.", t: "Ghar ka kaam tha, tameez se baat ki aur kaam acha kiya.", r: 4 },
  { n: "Hassan D.", t: "Kaam mukammal kar ke gaya, choti moti cheezein bhi theek kar di.", r: 5 },
  { n: "Nadeem P.", t: "Theek kaam kiya, waqt par pohncha.", r: 4 },
];

const used = new Set();
const workers = [];
let n = 0;

for (const cat of CATS) {
  for (let i = 0; i < 5; i++) {
    n++;
    let name = `${pick(FIRST)} ${pick(NAMES)}`;
    while (used.has(name)) name = `${pick(FIRST)} ${pick(NAMES)}`;
    used.add(name);

    const rating = Math.round((3.8 + rnd() * 1.2) * 10) / 10;
    const jobs = range(18, 380);
    const skills = [...cat.skills].sort(() => rnd() - 0.5).slice(0, 3);
    const revCount = range(2, 3);
    const reviews = [];
    const rp = [...REVIEW_POOL].sort(() => rnd() - 0.5);
    for (let k = 0; k < revCount; k++) reviews.push(rp[k]);

    workers.push({
      id: `w${String(n).padStart(2, "0")}`,
      name,
      category: cat.id,
      area: pick(AREAS),
      rate: Math.round(range(cat.min, cat.max) / 100) * 100,
      rating: rating > 5 ? 5 : rating,
      jobs,
      availableToday: rnd() < 0.6,
      verified: rnd() < 0.7,
      experience: range(cat.exp[0], cat.exp[1]),
      phone: `03${range(10, 49)}-${range(1000000, 9999999)}`,
      cnic: `35202-${range(1000000, 9999999)}-${range(1, 9)}`,
      skills,
      reviews,
      about: `${cat.id === "ac-tech" ? "AC" : cat.id} ka ${range(cat.exp[0], cat.exp[1])} saal ka tajurba. Ghar aur office dono ka kaam karta hoon.`,
      source: "seed",
    });
  }
}

writeFileSync(out, JSON.stringify(workers, null, 2) + "\n");
console.log(`wrote ${workers.length} workers -> ${out}`);
