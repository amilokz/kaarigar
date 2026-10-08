'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'ur' | 'en';

export const CATEGORIES = [
  { id: 'electrician' },
  { id: 'plumber' },
  { id: 'painter' },
  { id: 'mason' },
  { id: 'carpenter' },
  { id: 'ac-tech' },
] as const;

export const AREAS = [
  'Saddar', 'Gulberg', 'DHA Phase 2', 'Model Town', 'Cantt',
  'Township', 'Johar Town', 'Wapda Town', 'Iqbal Town', 'Shadman',
];

const catName: Record<Lang, Record<string, string>> = {
  ur: {
    electrician: 'Bijli Mistry', plumber: 'Plumber', painter: 'Painter',
    mason: 'Raj Mistry', carpenter: 'Barhai', 'ac-tech': 'AC Technician',
  },
  en: {
    electrician: 'Electrician', plumber: 'Plumber', painter: 'Painter',
    mason: 'Mason', carpenter: 'Carpenter', 'ac-tech': 'AC Technician',
  },
};

type StrVal = string | ((n: string) => string);

const STR: Record<Lang, Record<string, StrVal>> = {
  ur: {
    // chrome
    moreDemos: '← More demos by AKCLNT',
    footerNote: 'Demo — sample data. Built by AKCLNT.',
    buildForBusiness: 'Build this for your business',
    aiSimulated: 'AI simulated for demo',
    resetDemo: 'Reset demo data',
    resetConfirm: 'Demo data reset ho gaya. Page reload ho raha hai.',
    langLabel: 'EN',
    back: 'Wapas',
    // home
    heroProblem: 'Roz ki mazdoori ke liye ab chowk par intezaar nahi — bharosemand kaarigar ab aik click par.',
    heroCta: 'Aaj kisi ki zaroorat hai?',
    heroSub: 'Apna ilaqa likhein, kaam chunein — verified kaarigar foran milein ge.',
    searchPlaceholder: 'Ilaqa likhein (masalan Saddar)',
    searchBtn: 'Dhoondein',
    allAreas: 'Tamam ilaqay',
    chooseTrade: 'Kaam chunein',
    howItWorks: 'Kaise kaam karta hai',
    step1t: 'Kaarigar chunein', step1d: 'Ilaqay aur rating ke hisaab se verified kaarigar dekhein.',
    step2t: 'Booking karein', step2d: 'Kaam ki tafseel likhein, tareekh aur waqt chunein.',
    step3t: 'Kaam karwayein', step3d: 'Kaam mukammal honay par rating dein — paisay kaam ke baad.',
    statWorkers: 'Registered kaarigar', statAreas: 'Ilaqay', statJobs: 'Mukammal kaam',
    // workers
    findWorkers: 'Kaarigar dhoondein',
    filterCategory: 'Kaam', filterArea: 'Ilaqa', filterRate: 'Roz ki mazdoori (PKR)',
    filterRating: 'Kam az kam rating', filterVerified: 'Sirf CNIC-verified',
    anyCategory: 'Sab kaam', anyRating: 'Koi bhi', clearFilters: 'Filter saaf karein',
    availableToday: 'Aaj available', notToday: 'Aaj busy',
    verified: 'CNIC Verified', perDay: '/ din', jobsDone: 'kaam mukammal',
    viewProfile: 'Profile dekhein', noResults: 'Koi kaarigar nahi mila. Filter badal kar dekhein.',
    results: 'kaarigar milay',
    // profile
    experience: 'saal ka tajurba', reviews: 'Reviews', skills: 'Maharatein',
    workPhotos: 'Kaam ki tasveerein (demo)', bookNow: 'Abhi book karein',
    about: 'Tafseel', phone: 'Phone', cnic: 'CNIC',
    // booking
    bookTitle: 'Booking karein',
    stepDescribe: 'Kaam ki tafseel', stepWhen: 'Tareekh aur waqt', stepConfirm: 'Confirm',
    describeLabel: 'Kaam ki tafseel likhein',
    describePlaceholder: 'Masalan: kamray ki deewaron par paint karna hai, 2 kamray hain…',
    commonJobs: 'Aam kaam',
    dateLabel: 'Tareekh chunein', timeLabel: 'Waqt chunein',
    paymentNote: 'Payment kaam mukammal honay ke baad — Cash / Easypaisa / JazzCash (demo).',
    confirmBooking: 'Booking confirm karein',
    bookingConfirmed: 'Booking confirm ho gayi!',
    bookingRef: 'Booking number', trackBelow: 'Neeche apni booking ka status dekhein:',
    stageBooked: 'Booked', stageOnWay: 'Raste mein', stageDone: 'Kaam mukammal', stageRate: 'Rating dein',
    simulateProgress: 'Demo: agla step dikhayein',
    ratePrompt: 'Kaam kaisa raha? Rating dein:',
    rateSaved: 'Shukriya! Aapki rating save ho gayi.',
    complaintBtn: 'Shikayat karein',
    complaintTitle: 'Shikayat darj karein',
    complaintPlaceholder: 'Masla likhein…',
    complaintSent: 'Shikayat darj ho gayi. Hamari team rabta karegi (demo).',
    cancel: 'Cancel', send: 'Bhejein',
    needDescribe: 'Pehle kaam ki tafseel likhein.',
    needDateTime: 'Tareekh aur waqt chunein.',
    estCost: 'Mutawaqqa laagat',
    // onboard
    onboardTitle: 'WhatsApp par register karein',
    onboardSub: 'Dekhein kaarigar sirf WhatsApp chat se kaise register hota hai — koi form nahi.',
    chatTitle: 'Kaarigar WhatsApp', online: 'online', typeMsg: 'Message likhein…',
    sendBtn: 'Bhejein', micBtn: 'Bolein (mic)', micListening: 'Sun raha hoon…',
    micUnsupported: 'Is browser mein voice support nahi — text likhein.',
    quickHint: 'Ya neeche likhein, masalan:',
    quick1: 'Main painter hoon, Saddar mein, aaj free hoon',
    quick2: 'Mera naam Rashid hai, bijli ka kaam karta hoon',
    liveProfile: 'Live profile',
    profileHint: 'Chat mein jawab dein — profile yahan live update hogi.',
    registered: 'Mubarak ho! Aapki profile ban gayi ✅',
    registeredSub: 'Admin verification ke baad aap customers ko nazar aayenge (demo).',
    regAgain: 'Dobara register karein',
    botGreet: 'Assalam-o-Alaikum! Kaarigar registration mein khush aamdeed. 👋 Apka naam kya hai?',
    botSkill: (n: string) => `Shukriya ${n}! Aap kaunsa kaam karte hain? (Painter, Electrician, Plumber, Mason, Carpenter, AC Technician)`,
    botArea: 'Zabardast! Aap kis ilaqe mein kaam karte hain?',
    botRate: 'Aur aapki roz ki mazdoori kitni hai? (PKR mein, masalan 2500)',
    botAvail: 'Aakhri sawal: kya aap AAJ kaam ke liye available hain? (haan / nahi)',
    botUnknown: 'Samajh nahi aya — thora wazeh likhein. (AI simulated for demo)',
    botFallback: 'Theek hai, aagay barhte hain.',
    // agent
    agentTitle: 'Field Agent',
    agentSub: 'Chowk aur mohallon mein kaarigar register karein aur commission kamayein.',
    tabRegister: 'Register karein', tabDashboard: 'Dashboard',
    fName: 'Naam', fCnic: 'CNIC number', fPhone: 'Phone number',
    fSkill: 'Kaam (skill)', fArea: 'Ilaqa', fRate: 'Roz ki mazdoori (PKR)',
    fPhoto: 'Tasveer (demo)', photoNote: 'Demo mein tasveer save nahi hoti — initials avatar use hota hai.',
    registerWorker: 'Kaarigar register karein',
    regSuccess: 'Kaarigar register ho gaya! Admin verification ke liye bhej diya (demo).',
    needFields: 'Naam, phone aur kaam zaroor likhein.',
    dashWorkers: 'Aapke registered kaarigar',
    dashCommission: 'Total commission (demo)',
    dashPending: 'Verification pending',
    perReg: 'Fi registration', perBooking: 'Fi booking (5%)',
    // admin
    adminTitle: 'Admin Panel',
    adminLoginTitle: 'Demo admin login',
    adminLoginSub: 'Yeh sirf demo hai — koi asal login nahi.',
    loginDemo: 'Login as demo admin', logout: 'Logout',
    tabVerify: 'Verification', tabBookings: 'Bookings', tabComplaints: 'Shikayat',
    tabCats: 'Categories / Areas', tabCommission: 'Commission', tabPayments: 'Payments',
    approve: 'Approve', reject: 'Reject', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    noPending: 'Koi pending verification nahi.',
    noBookings: 'Koi booking nahi.', noComplaints: 'Koi shikayat nahi.',
    markResolved: 'Hal shuda', resolved: 'Hal ho gayi',
    enable: 'On', disable: 'Off',
    commissionRate: 'Commission per booking (%)',
    regFee: 'Registration fee per worker (PKR)',
    saveSettings: 'Save karein', saved: 'Save ho gaya!',
    payMethod: 'Tareeqa', payAmount: 'Raqam', payStatus: 'Status', payDate: 'Tareekh',
    cashOnDone: 'Kaam ke baad', paid: 'Paid (demo)', workerName: 'Kaarigar',
    custName: 'Customer', jobDesc: 'Kaam', status: 'Status',
    // misc
    demoBadge: 'DEMO',
    sampleDataNote: 'Tamam naam aur data farzi hain — sirf demo ke liye.',
  },
  en: {
    moreDemos: '← More demos by AKCLNT',
    footerNote: 'Demo — sample data. Built by AKCLNT.',
    buildForBusiness: 'Build this for your business',
    aiSimulated: 'AI simulated for demo',
    resetDemo: 'Reset demo data',
    resetConfirm: 'Demo data has been reset. Reloading…',
    langLabel: 'اردو',
    back: 'Back',
    heroProblem: 'No more roadside waiting for daily-wage work — trusted skilled workers, one click away.',
    heroCta: 'Need someone today?',
    heroSub: 'Type your area, pick a trade — verified workers right away.',
    searchPlaceholder: 'Type an area (e.g. Saddar)',
    searchBtn: 'Search',
    allAreas: 'All areas',
    chooseTrade: 'Choose a trade',
    howItWorks: 'How it works',
    step1t: 'Pick a worker', step1d: 'Browse verified workers by area and rating.',
    step2t: 'Book', step2d: 'Describe the job, pick a date and time.',
    step3t: 'Get it done', step3d: 'Rate the work after completion — pay after the job.',
    statWorkers: 'Registered workers', statAreas: 'Areas', statJobs: 'Jobs completed',
    findWorkers: 'Find workers',
    filterCategory: 'Trade', filterArea: 'Area', filterRate: 'Daily rate (PKR)',
    filterRating: 'Minimum rating', filterVerified: 'CNIC-verified only',
    anyCategory: 'All trades', anyRating: 'Any', clearFilters: 'Clear filters',
    availableToday: 'Available today', notToday: 'Busy today',
    verified: 'CNIC Verified', perDay: '/day', jobsDone: 'jobs done',
    viewProfile: 'View profile', noResults: 'No workers found. Try changing the filters.',
    results: 'workers found',
    experience: 'years experience', reviews: 'Reviews', skills: 'Skills',
    workPhotos: 'Work photos (demo)', bookNow: 'Book now',
    about: 'About', phone: 'Phone', cnic: 'CNIC',
    bookTitle: 'Book a worker',
    stepDescribe: 'Describe the job', stepWhen: 'Date & time', stepConfirm: 'Confirm',
    describeLabel: 'Describe the job',
    describePlaceholder: 'E.g. paint the walls of 2 rooms…',
    commonJobs: 'Common jobs',
    dateLabel: 'Pick a date', timeLabel: 'Pick a time',
    paymentNote: 'Pay after the job is done — Cash / Easypaisa / JazzCash (demo).',
    confirmBooking: 'Confirm booking',
    bookingConfirmed: 'Booking confirmed!',
    bookingRef: 'Booking ref', trackBelow: 'Track your booking below:',
    stageBooked: 'Booked', stageOnWay: 'On the way', stageDone: 'Job done', stageRate: 'Rate',
    simulateProgress: 'Demo: show next step',
    ratePrompt: 'How was the work? Leave a rating:',
    rateSaved: 'Thanks! Your rating was saved.',
    complaintBtn: 'File a complaint',
    complaintTitle: 'File a complaint',
    complaintPlaceholder: 'Describe the issue…',
    complaintSent: 'Complaint filed. Our team will contact you (demo).',
    cancel: 'Cancel', send: 'Send',
    needDescribe: 'Please describe the job first.',
    needDateTime: 'Please pick a date and time.',
    estCost: 'Estimated cost',
    onboardTitle: 'Register on WhatsApp',
    onboardSub: 'Watch a worker register through WhatsApp chat alone — no forms.',
    chatTitle: 'Kaarigar WhatsApp', online: 'online', typeMsg: 'Type a message…',
    sendBtn: 'Send', micBtn: 'Speak (mic)', micListening: 'Listening…',
    micUnsupported: 'Voice not supported in this browser — please type.',
    quickHint: 'Or type below, e.g.:',
    quick1: 'I am a painter in Saddar, free today',
    quick2: 'My name is Rashid, I do electrical work',
    liveProfile: 'Live profile',
    profileHint: 'Answer in the chat — the profile updates live here.',
    registered: 'Congratulations! Your profile is ready ✅',
    registeredSub: 'After admin verification you will be visible to customers (demo).',
    regAgain: 'Register again',
    botGreet: 'Assalam-o-Alaikum! Welcome to Kaarigar registration. 👋 What is your name?',
    botSkill: (n: string) => `Thanks ${n}! What work do you do? (Painter, Electrician, Plumber, Mason, Carpenter, AC Technician)`,
    botArea: 'Great! Which area do you work in?',
    botRate: 'And what is your daily rate? (in PKR, e.g. 2500)',
    botAvail: 'Last question: are you available for work TODAY? (yes / no)',
    botUnknown: "Didn't catch that — please say it more clearly. (AI simulated for demo)",
    botFallback: 'OK, moving on.',
    agentTitle: 'Field Agent',
    agentSub: 'Register workers from chowks and neighbourhoods, earn commission.',
    tabRegister: 'Register', tabDashboard: 'Dashboard',
    fName: 'Name', fCnic: 'CNIC number', fPhone: 'Phone number',
    fSkill: 'Trade (skill)', fArea: 'Area', fRate: 'Daily rate (PKR)',
    fPhoto: 'Photo (demo)', photoNote: 'Photo is not saved in demo — an initials avatar is used.',
    registerWorker: 'Register worker',
    regSuccess: 'Worker registered! Sent for admin verification (demo).',
    needFields: 'Name, phone and trade are required.',
    dashWorkers: 'Workers you registered',
    dashCommission: 'Total commission (demo)',
    dashPending: 'Pending verification',
    perReg: 'Per registration', perBooking: 'Per booking (5%)',
    adminTitle: 'Admin Panel',
    adminLoginTitle: 'Demo admin login',
    adminLoginSub: 'This is a demo only — no real login.',
    loginDemo: 'Login as demo admin', logout: 'Logout',
    tabVerify: 'Verification', tabBookings: 'Bookings', tabComplaints: 'Complaints',
    tabCats: 'Categories / Areas', tabCommission: 'Commission', tabPayments: 'Payments',
    approve: 'Approve', reject: 'Reject', pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    noPending: 'No pending verifications.',
    noBookings: 'No bookings.', noComplaints: 'No complaints.',
    markResolved: 'Mark resolved', resolved: 'Resolved',
    enable: 'On', disable: 'Off',
    commissionRate: 'Commission per booking (%)',
    regFee: 'Registration fee per worker (PKR)',
    saveSettings: 'Save', saved: 'Saved!',
    payMethod: 'Method', payAmount: 'Amount', payStatus: 'Status', payDate: 'Date',
    cashOnDone: 'After job', paid: 'Paid (demo)', workerName: 'Worker',
    custName: 'Customer', jobDesc: 'Job', status: 'Status',
    demoBadge: 'DEMO',
    sampleDataNote: 'All names and data are fictional — for demo only.',
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  catName: (id: string) => string;
};

const LangCtx = createContext<Ctx>({
  lang: 'ur',
  setLang: () => {},
  t: (k) => k,
  catName: (id) => id,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ur');

  useEffect(() => {
    try {
      const s = localStorage.getItem('kaarigar-lang');
      if (s === 'en' || s === 'ur') setLangState(s);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('kaarigar-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  const value: Ctx = {
    lang,
    setLang: setLangState,
    t: (k: string) => {
      const v = STR[lang][k] ?? STR.en[k];
      return typeof v === 'string' ? v : k;
    },
    catName: (id: string) => catName[lang][id] ?? catName.en[id] ?? id,
  };

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** bot message helpers that interpolate — exposed via t-like accessor */
export function useBot() {
  const { lang } = useLang();
  return {
    greet: STR[lang].botGreet as string,
    skill: STR[lang].botSkill as (n: string) => string,
    area: STR[lang].botArea as string,
    rate: STR[lang].botRate as string,
    avail: STR[lang].botAvail as string,
    unknown: STR[lang].botUnknown as string,
    fallback: STR[lang].botFallback as string,
  };
}
