import { Service, Review } from "./types";

export const SERVICES: Service[] = [
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    bengaliName: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
    price: 3500,
    description: "আপনার ব্যবসাকে ডিজিটাল প্ল্যাটফর্মে সফল করতে এবং সোশ্যাল মিডিয়া মার্কেটিংয়ের মাধ্যমে বিক্রয় বা সেলস সর্বোচ্চ করতে শিখুন।",
    features: [
      "ফেসবুক ও ইনস্টাগ্রাম অ্যাডভার্টাইজিং",
      "সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)",
      "কন্টেন্ট স্ট্র্যাটেজি ও ইমেইল মার্কেটিং",
      "রিয়েল-টাইম লাইভ প্রজেক্ট ওয়ার্ক"
    ]
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    bengaliName: "প্রফেশনাল গ্রাফিক্স ডিজাইন",
    price: 4000,
    description: "অ্যাডোবি ফটোশপ ও ইলাস্ট্রেটর ব্যবহার করে ক্রিয়েটিভ ব্যানার, লোগো এবং প্রফেশনাল ইউআই/ইউএক্স কন্টেন্ট তৈরি করুন।",
    features: [
      "ব্র্যান্ডিং এবং লোগো ডিজাইন কনসেপ্ট",
      "ফটোশপ ফটো রিটাচিং এবং ম্যানিপুলেশন",
      "ইনস্টাগ্রাম ও ফেসবুক পোস্ট ডিজাইন",
      "পোর্টফোলিও বিল্ডিং এবং গাইডলাইন"
    ]
  },
  {
    id: "ai-tools",
    name: "AI Tools Usage",
    bengaliName: "এআই টুলস ব্যবহার ও অটোমেশন",
    price: 4500,
    description: "চ্যাটজিপিটি, মিডজার্নি এবং কোডিং এআই অ্যাসিস্ট্যান্টগুলো ব্যবহার করে কাজের উৎপাদনশীলতা ১০ গুণ পর্যন্ত বৃদ্ধি করুন।",
    features: [
      "চ্যাটজিপিটি প্রম্পট ইঞ্জিনিয়ারিং",
      "মিডজার্নি দিয়ে এআই ইমেজ জেনারেশন",
      "এআই ব্যবহার করে অটোমেটেড কনটেন্ট তৈরি",
      "ফ্রিল্যান্সিংয়ে এআই টুলসের স্মার্ট ভূমিকা"
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    studentName: "মোহাম্মদ আল-আমিন",
    courseName: "ডিজিটাল মার্কেটিং মাস্টারক্লাস",
    rating: 5,
    comment: "কোর্সটি করার পর আমি এখন লোকাল ও ইন্টারন্যাশনাল ক্লায়েন্টদের প্রজেক্ট সামলাচ্ছি। বিশেষ করে ফেসবুক অ্যাডস মডিউলটি ছিল অসাধারণ।",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-05-15"
  },
  {
    id: "r2",
    studentName: "নাসরিন ফাতেমা",
    courseName: "প্রফেশনাল গ্রাফিক্স ডিজাইন",
    rating: 5,
    comment: "একজন গৃহিণী হয়ে ঘরে বসেই গ্রাফিক্সের কাজ শিখেছি এবং এখন আপওয়ার্কে নিয়মিত ইনকাম করছি। মেন্টরদের সাপোর্ট ছিল অতুলনীয়।",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-06-01"
  },
  {
    id: "r3",
    studentName: "তানভীর রহমান সাকিব",
    courseName: "এআই টুলস ব্যবহার ও অটোমেশন",
    rating: 5,
    comment: "এআই টুলস নিয়ে এমন আকর্ষণীয় কারিকুলাম আগে দেখিনি। প্রম্পট লেখার সিক্রেট ট্রিকসগুলো শিখে আমার কাজের স্পিড ১০০% বৃদ্ধি পেয়েছে!",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2026-06-18"
  }
];

export const INITIAL_MEMBERS = [
  { id: "m1", name: "মিনহাজুল আবেদিন", email: "minhaj@example.com", role: "user", joinedAt: "2026-04-10" },
  { id: "m2", name: "আরমান আলিফ (অ্যাডমিন)", email: "armanalif2560@gmail.com", role: "admin", joinedAt: "2026-03-01" },
  { id: "m3", name: "সাদিয়া চৌধুরী", email: "sadia@example.com", role: "user", joinedAt: "2026-04-22" },
  { id: "m4", name: "ইশতিয়াক আহমেদ", email: "ish@example.com", role: "user", joinedAt: "2026-05-02" },
  { id: "m5", name: "তাজুল ইসলাম", email: "tazul@example.com", role: "user", joinedAt: "2026-05-20" }
];
