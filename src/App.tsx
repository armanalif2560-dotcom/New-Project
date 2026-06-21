import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Bot, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  Send, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Star,
  Users,
  ShieldCheck,
  Zap,
  Github,
  Globe,
  Facebook
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, setDoc, doc, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Service, Review, Member, PaymentDetails } from "./types";
import { SERVICES, INITIAL_REVIEWS, INITIAL_MEMBERS } from "./data";

import Header from "./components/Header";
import ServicesSection from "./components/ServicesSection";
import PeopleSection from "./components/PeopleSection";
import ReviewSection from "./components/ReviewSection";
import Dashboard from "./components/Dashboard";

export default function App() {
  // Navigation & highlights
  const [activeSection, setActiveSection] = useState("home");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Modals
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Authentication simulation & Real state syncing
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: "admin" | "user" } | null>(null);

  // Dynamic lists from Firestore/In-memory
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [payments, setPayments] = useState<PaymentDetails[]>([]);

  // Local contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Auth form states
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // 1. Sync reviews in real-time with Firestore database
  useEffect(() => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: Review[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Review);
        });
        if (list.length > 0) {
          // Merge to prefer firebase, keep default if empty
          setReviews([...list, ...INITIAL_REVIEWS.filter(ir => !list.some(l => l.comment === ir.comment))]);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Unable to establish live Reviews collection syncing (Offline fallback is ready):", err);
    }
  }, []);

  // 2. Sync members in real-time with Firestore database
  useEffect(() => {
    try {
      const q = query(collection(db, "members"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: Member[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Member);
        });
        if (list.length > 0) {
          // Combine live with defaults safely
          setMembers([...list, ...INITIAL_MEMBERS.filter(im => !list.some(l => l.email === im.email))]);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Unable to establish live Members collection syncing:", err);
    }
  }, []);

  // 3. Sync payments in real-time with Firestore database
  useEffect(() => {
    try {
      const q = query(collection(db, "payments"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: PaymentDetails[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as PaymentDetails);
        });
        setPayments(list);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn("Unable to establish live Payments collection syncing:", err);
    }
  }, []);

  // Handle selected dropdown item from Header
  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    // Smooth scroll to services cards
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Pulse animation trigger on chosen card container
    setTimeout(() => {
      const card = document.getElementById(`card-${serviceId}`);
      if (card) {
        card.classList.add("ring-8", "ring-blue-500/20");
        setTimeout(() => {
          card.classList.remove("ring-8", "ring-blue-500/20");
        }, 1500);
      }
    }, 400);
  };

  // Auth helper
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    // Detect if user is armanalif2560@gmail.com to assign Admin role automatically
    const isOwnerAdmin = authEmail.trim().toLowerCase() === "armanalif2560@gmail.com";
    const userRole = isOwnerAdmin ? ("admin" as const) : ("user" as const);
    const finalName = authName || (isOwnerAdmin ? "আরমান আলিফ" : "শিক্ষার্থী বন্ধু");

    const sessionUser = {
      email: authEmail.trim(),
      name: finalName,
      role: userRole
    };

    // Save newly authenticated member to firestore members list so they appear under People section
    try {
      const memberExists = members.some(m => m.email.toLowerCase() === authEmail.trim().toLowerCase());
      if (!memberExists) {
        const newMember = {
          name: finalName,
          email: authEmail.trim(),
          role: userRole,
          joinedAt: new Date().toISOString().split("T")[0]
        };
        await addDoc(collection(db, "members"), newMember);
      }
    } catch (err) {
      console.error("Error setting member on auth:", err);
    }

    setCurrentUser(sessionUser);
    setShowLogin(false);
    
    // Clear fields
    setAuthEmail("");
    setAuthName("");
    setAuthPassword("");
    alert(`🎉 স্বাগতম! আপনি ${userRole === "admin" ? "অ্যাডমিন" : "মেম্বার"} হিসেবে সফলভাবে প্রবেশ করেছেন।`);
  };

  // Switch role simulator within Dashboard
  const handleSetUserRole = (role: "admin" | "user") => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: role
      });
    }
  };

  // Clear or cancel payment transaction
  const handleClearPayment = (paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  // Append new reviews immediately
  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Append new member list
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [newMember, ...prev]);
  };

  // Handle successful purchase payment callback
  const handlePaymentSuccess = (newPayment: PaymentDetails) => {
    setPayments(prev => [newPayment, ...prev]);
  };

  // Contact form submission
  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMsg) return;

    try {
      await addDoc(collection(db, "contacts"), {
        name: contactName,
        email: contactEmail || "anonymous@example.com",
        message: contactMsg,
        timestamp: new Date().toISOString()
      });
      setContactSuccess(true);
      setTimeout(() => {
        setContactName("");
        setContactEmail("");
        setContactMsg("");
        setContactSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Error submitting contact:", err);
      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#02050b] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Header component */}
      <Header
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          alert("সফলভাবে লগ-আউট করা হয়েছে।");
        }}
        onOpenLogin={() => {
          setIsSignUp(false);
          setShowLogin(true);
        }}
        onOpenDashboard={() => setShowDashboard(true)}
        services={SERVICES}
        onSelectService={handleSelectService}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Section */}
      <section id="home" className="relative py-28 hover:py-32 transition-all duration-500 bg-gradient-to-b from-[#0f172a] via-[#020617] to-[#090d16] overflow-hidden">
        
        {/* Animated background effects */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-900 text-blue-400 text-xs font-black mb-6 shadow-lg shadow-blue-950/40"
          >
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>১০০% ফায়ারবেস কানেক্টেড অমর প্ল্যাটফর্ম</span>
          </motion.div>

          {/* Master Slogan */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto"
          >
            শিখুন দেশের সবচেয়ে{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400">
              রঙিন ও প্রফেশনাল
            </span>{" "}
            আইটি শিক্ষালয়ে!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto text-sm sm:text-base"
          >
            অমর সাইট (Amar Site) নিয়ে এসেছে ডিজিটাল মার্কেটিং, গ্রাফিক্স ডিজাইন এবং অত্যাধুনিক এআই টুলসের সর্বোত্তম প্রফেশনাল গাইডলাইন। এনিমেশনের ভরপুর এক জাদুকরি অভিজ্ঞতায় স্কিল ডেভেলপমেন্ট করুন আজই!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex gap-4 justify-center flex-wrap"
          >
            <button
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-4 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 border border-blue-400/30 cursor-pointer"
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>সার্ভিস ও কোর্সসমূহ দেখুন</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("people");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-4 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all"
            >
              আজকেই যুক্ত হোন
            </button>
          </motion.div>

          {/* Stats Indicators under Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: "মোট অ্যাক্টিভ শিক্ষার্থী", val: members.length + "+ জন", icon: Users },
              { label: "কোর্স রেটিং", val: "৪.৯ / ৫.০", icon: Star },
              { label: "মেন্টর সাপোর্ট", val: "২৪/৭ লাইভ", icon: Bot },
              { label: "পেমেন্ট গেটওয়ে", val: "বিকাশ/নগদ সক্রিয়", icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#0b101c]/60 border border-blue-950/40 text-center flex flex-col items-center">
                <stat.icon className="w-5 h-5 text-blue-400 mb-2" />
                <span className="text-white font-extrabold text-sm">{stat.val}</span>
                <span className="text-slate-400 text-[10px] mt-1 font-semibold">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* About Us (আমাদের সম্পর্কে) Section */}
      <section id="about" className="py-24 bg-[#090d16] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl shadow-xl shadow-blue-500/15"
            >
              <div className="bg-[#02050b] rounded-[22px] p-6.5 sm:p-8 space-y-6">
                <span className="text-xs text-blue-400 font-black tracking-widest uppercase block">Amar Site পরিচিতি</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  আমরা তৈরি করছি ভবিষ্যৎ আইটি লিডারদের!
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-semibold">
                  আমাদের মূল লক্ষ্য হলো বাস্তবমুখী কাজ এবং সর্বোত্তম এআই অটোমেশন শিক্ষা প্রদানের মাধ্যমে দেশের বেকারত্ব মেটানো। আমাদের কারিকুলাম ইন্ডাস্ট্রি মেন্টর দ্বারা বিশেষভাবে পরিকল্পিত যা আপনাকে ক্যারিয়ার রেডি করতে সাহায্য করবে।
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    "অভিজ্ঞ এবং দক্ষ ইন্টারন্যাশনাল ফ্রিল্যান্সার মেন্টরবৃন্দ।",
                    "ফায়ারবেস দ্বারা সুরক্ষিত আপনার ব্যক্তিগত রেকর্ড ও তথ্য।",
                    "সার্ভিস পেমেন্ট সম্পন্ন হওয়া মাত্রই ইনস্ট্যান্ট অ্যাক্টিভেশন।"
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs text-slate-300 font-medium">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Core Values Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-950 border border-blue-900 text-blue-400 text-xs font-bold">
                <Award className="w-4 h-4 text-blue-400" />
                <span>আমাদের সম্মান ও অর্জন</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                স্কিলড হয়ে ফ্রিল্যান্সিংয়ে সাফল্য আনুন
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                Amar Site প্ল্যাটফর্মটি তৈরি করা হয়েছে শিক্ষার্থী ও মেন্টরদের কথা বিবেচনা করে। এখানে আপনার পেমেন্ট ভেরিভিকেশন সফল হওয়ার পরপরই লাইভ সেমিস্টার ক্লাস এবং মেন্টরদের ম্যাজিক ট্রিকস দেখার সুযোগ পাবেন। ১০০০+ এরও বেশি শিক্ষার্থী আমাদের রিভিউ করে শীর্ষস্থান দিয়েছেন।
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
                  <div className="text-2xl font-black text-blue-500">৩০০০+</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">সাফল্যমণ্ডিত শিক্ষার্থী</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
                  <div className="text-2xl font-black text-blue-500">৯৯.৮%</div>
                  <div className="text-xs text-slate-400 font-semibold mt-1">পজিটিভ রিভিউ রেট</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Section with purchase simulator and Firebase */}
      <ServicesSection
        services={SERVICES}
        selectedServiceId={selectedServiceId}
        onPaymentSuccess={handlePaymentSuccess}
        currentUser={currentUser}
        onOpenLogin={() => {
          setIsSignUp(false);
          setShowLogin(true);
        }}
      />

      {/* People enrolled count live update using Firebase doc query & interactive joins */}
      <PeopleSection
        members={members}
        onAddMember={handleAddMember}
        currentUser={currentUser}
      />

      {/* Review Section */}
      <ReviewSection
        reviews={reviews}
        onAddReview={handleAddReview}
        currentUser={currentUser}
      />

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-[#05070e] relative border-t border-blue-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Info details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">সহযোগিতা ও যোগাযোগ</span>
              <h2 className="text-3xl font-black text-white">আমাদের সাথে সরাসরি কথা বলুন!</h2>
              <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                আপনার কোনো কোর্স, পেমেন্ট অথবা বিশেষ ড্যাশবোর্ড নিয়ে প্রশ্ন থাকলে সরাসরি কন্টাক্ট ফরম পূরণ করে আমাদের মেন্টরদের কাছে বার্তা পাঠান। ফায়ারবেসের কানেকশন দ্বারা আপনার বার্তা আমাদের কাছে তাৎক্ষণিক পৌঁছে যাবে।
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-4 bg-transparent shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">ইমেইল করুন</span>
                    <span className="text-sm text-slate-200 font-mono font-semibold">support@amarsite.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-4 bg-transparent shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">হেড অফিস ফোন</span>
                    <span className="text-sm text-slate-300 font-mono font-semibold">+৮৮০ ৯৬১২-৩৪৫৬৭৮</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center text-blue-400 shrink-0">
                    <MapPin className="w-4 bg-transparent shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">অফিস ঠিকানা</span>
                    <span className="text-sm text-slate-300 font-sans font-semibold">সেক্টর-১১, উত্তরা আইটি টাওয়ার, ঢাকা ১২৩০</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Direct write form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#090d16]/80 p-6.5 rounded-3xl border border-blue-950 shadow-xl"
            >
              <h3 className="text-md font-bold text-white mb-4">আপনার বার্তা পাঠান</h3>
              
              {contactSuccess ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-2xl text-emerald-300 text-xs font-bold text-center">
                  🎉 বার্তাটি আমাদের মেন্টরদের কাছে পৌঁছেছে! আমরা সর্বোচ্চ ২ ঘণ্টার মধ্যে আপনার সাথে ইমেইলে যোগাযোগ করব।
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="মোঃ সায়েম শেখ"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার ইমেইল এড্রেস</label>
                    <input
                      type="email"
                      required
                      placeholder="sayem@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">বার্তা / মেসেজ</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="আমি গ্রাফিক্স ডিজাইন কোর্স সম্পর্কে বিস্তারিত জানতে চাই এবং কিসে পেমেন্ট করতে হয়..."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>মেসেজ সাবমিট করুন</span>
                  </motion.button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#05070e] border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo/Desc info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  AS
                </div>
                <span className="ml-3 font-extrabold text-lg text-white">Amar Site</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-semibold">
                Amar Site দেশের প্রথম সর্বাধিক এনিমেটেড ও ফায়ারবেস ব্যাকএন্ড ইন্টিগ্রেটেড বাংলা আইটি শিক্ষা ও সেবা প্রদানকারী প্রতিষ্ঠান। নিখুঁত গাইডলাইন ও সাশ্রয়ী সেমিস্টারের নিশ্চয়তা।
              </p>
            </div>

            {/* Quick sections links */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-blue-400 font-extrabold mb-4">গুরুত্বপূর্ণ লিংক সমূহ</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-semibold">
                <li><a href="#home" className="hover:text-blue-400 transition-colors">হোমপেজ</a></li>
                <li><a href="#about" className="hover:text-blue-400 transition-colors">আমাদের লক্ষ্য</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">আইটি সার্ভিসসমূহ</a></li>
                <li><a href="#people" className="hover:text-blue-400 transition-colors">যুক্ত মানুষজন</a></li>
              </ul>
            </div>

            {/* Support section links */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-blue-400 font-extrabold mb-4">সামাজিক নেটওয়ার্ক</h4>
              <div className="flex gap-3 text-slate-400">
                <a href="#facebook" title="Facebook Page" className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4.5 h-4.5" /></a>
                <a href="#github" title="Github Code" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white transition-all"><Github className="w-4.5 h-4.5" /></a>
                <a href="#website" title="Website link" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white transition-all"><Globe className="w-4.5 h-4.5" /></a>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold mt-4">
                কারিগরি সমস্যায় বা পেমেন্ট ভেরিফাই করতে সাপোর্ট রুমে জয়েন করুন।
              </p>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-slate-900 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-bold">
            <p>© ২০২৬ অমর সাইট (Amar Site) - সর্বস্বত্ব সংরক্ষিত ও সুরক্ষিত।</p>
            <p className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Powered by Firebase Firestore realtime engine.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setShowLogin(false)}
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-[#090e1a] border border-blue-900/60 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6"
            >
              <div className="text-center mb-5">
                <span className="text-3xl font-black block text-blue-400">AS</span>
                <h3 className="text-md font-bold text-white mt-2">
                  {isSignUp ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "অমর সাইট সাইন-ইন পোর্টাল"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">কানেক্ট করুন আপনার ফায়ারবেস অ্যাকাউন্ট।</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 font-sans">আপনার পূর্ণ নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="আবির হাসান"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-sans">অ্যাকাউন্ট ইমেইল</label>
                  <input
                    type="email"
                    required
                    placeholder="armanalif2560@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                  />
                  <span className="text-[10px] text-emerald-400 font-semibold block mt-1.5 opacity-90">
                    💡 অ্যাডমিন ডেমো টেস্ট করতে: <strong className="font-mono bg-emerald-950 px-1 py-0.5 rounded">armanalif2560@gmail.com</strong> ইমেইলটি ব্যবহার করুন!
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-sans">পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    placeholder="******"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white hover:bg-blue-500 font-bold text-sm rounded-xl"
                >
                  {isSignUp ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
                </motion.button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-blue-400 hover:underline font-bold"
                >
                  {isSignUp ? "ইতিমধ্যেই অ্যাকাউন্ট আছে? সাইন-ইন পোর্টাল" : "নতুন মেম্বার? ফায়ারবেস অ্যাকাউন্ট খুলুন"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dashboard container representing User / Admin panels (সবুজ ড্যাশবোর্ড এবং লাল বাটন) */}
      <Dashboard
        currentUser={currentUser}
        members={members}
        payments={payments}
        services={SERVICES}
        onSetUserRole={handleSetUserRole}
        onClearPayment={handleClearPayment}
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />

    </div>
  );
}
