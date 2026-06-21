import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Trash2, 
  Unlock, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  Plus, 
  CheckCircle,
  FileText,
  XCircle
} from "lucide-react";
import { Member, PaymentDetails, Service } from "../types";

interface DashboardProps {
  currentUser: { email: string; name: string; role: "admin" | "user" } | null;
  members: Member[];
  payments: PaymentDetails[];
  services: Service[];
  onSetUserRole: (role: "admin" | "user") => void;
  onClearPayment: (paymentId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Dashboard({
  currentUser,
  members,
  payments,
  services,
  onSetUserRole,
  onClearPayment,
  isOpen,
  onClose
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "members">("overview");

  if (!isOpen || !currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  // Filter payments for standard users
  const userPayments = payments.filter(p => p.userEmail === currentUser.email);
  const enrolledServiceIds = userPayments.filter(p => p.status === "success").map(p => p.serviceId);

  // Generate Bengali numbers helper
  const toBengaliNumber = (num: number) => {
    return num.toLocaleString("bn-BD");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      ></motion.div>

      {/* Main Panel Content - Emerald/Green Theme (সবুজ ড্যাসবোর্ড কালার) */}
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="relative bg-[#022c22] border-2 border-emerald-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-emerald-950/50 flex flex-col"
      >
        
        {/* Dashboard Header */}
        <div className="bg-[#064e3b] p-6 border-b border-emerald-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-inner">
              {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-emerald-50">
                  {isAdmin ? "মাস্টার অ্যাডমিন ড্যাসবোর্ড" : "শিক্ষার্থী ড্যাসবোর্ড"}
                </h2>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  isAdmin ? "bg-red-600 text-white shadow shadow-red-900" : "bg-emerald-850 text-emerald-300 border border-emerald-700"
                }`}>
                  {isAdmin ? "সবুজ ড্যাসবোর্ড - অ্যাডমিন অ্যাক্সেস" : "ইউজার ড্যাসবোর্ড"}
                </span>
              </div>
              <p className="text-emerald-300 text-xs mt-1 font-semibold">
                লগইন করা ইমেইল: <span className="text-white font-mono font-bold">{currentUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-700/30 border border-red-500/50 transition-colors cursor-pointer"
          >
            বন্ধ করুন (X)
          </button>
        </div>

        {/* Dashboard Menu Buttons */}
        <div className="p-4 bg-[#022c22] border-b border-emerald-800 flex justify-between items-center gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-inner"
                  : "bg-emerald-900Item bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/40"
              }`}
            >
              আজকের তথ্যচিত্র (Overview)
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "payments"
                      ? "bg-emerald-600 text-white shadow-inner"
                      : "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/40"
                  }`}
                >
                  পেমেন্ট হিস্ট্রি ({toBengaliNumber(payments.length)} টি)
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "members"
                      ? "bg-emerald-600 text-white shadow-inner"
                      : "bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/40"
                  }`}
                >
                  যুক্ত মানুষজন ({toBengaliNumber(members.length)})
                </button>
              </>
            )}
          </div>

          {/* Core Admin Simulator Toggle */}
          <div className="flex items-center gap-2 bg-emerald-950/80 p-2 rounded-2xl border border-emerald-800">
            <span className="text-[11px] font-bold text-emerald-400">রোড টেস্ট করুন:</span>
            <button
              onClick={() => onSetUserRole(isAdmin ? "user" : "admin")}
              className="py-1.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow shadow-red-900 flex items-center gap-1 transition-all cursor-pointer"
            >
              {isAdmin ? "ইউজার মোডে যান" : "অ্যাডমিন মোডে যান"}
            </button>
          </div>
        </div>

        {/* Dashboard Body Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* If Admin */}
              {isAdmin ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5.5 rounded-2xl bg-[#064e3b]/80 border border-emerald-500/40 shadow">
                      <span className="text-xs text-emerald-300 block mb-1">মোট শিক্ষার্থী সংখ্যা</span>
                      <span className="text-3xl font-black text-white font-mono">
                        {toBengaliNumber(members.length)} জন
                      </span>
                    </div>

                    <div className="p-5.5 rounded-2xl bg-[#064e3b]/80 border border-emerald-500/40 shadow">
                      <span className="text-xs text-emerald-300 block mb-1">সফল পেমেন্ট ভেরিফিকেশন</span>
                      <span className="text-3xl font-black text-white font-mono">
                        {toBengaliNumber(payments.filter(p => p.status === "success").length)} বার
                      </span>
                    </div>

                    <div className="p-5.5 rounded-2xl bg-[#064e3b]/80 border border-emerald-500/40 shadow">
                      <span className="text-xs text-emerald-300 block mb-1">মোট অর্জিত রাজস্ব (Revenue)</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-white font-mono">
                        ৳ {toBengaliNumber(payments.filter(p => p.status === "success").reduce((acc, curr) => acc + curr.amount, 0))}
                      </span>
                    </div>
                  </div>

                  {/* Admin Specific Action Box */}
                  <div className="p-6 rounded-2xl bg-[#043329] border border-emerald-500/30">
                    <h3 className="text-md font-bold text-emerald-50 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>মাস্টার অডিটিং টুলস</span>
                    </h3>
                    <p className="text-emerald-300 text-xs leading-relaxed mb-4 font-semibold">
                      অ্যাডমিন ড্যাশবোর্ড সম্পূর্ণ কার্যকর। আপনি এই প্যানেল থেকে সমস্ত শিক্ষার্থীর ক্রিয়াকলাপ রেকর্ড দেখতে পারেন এবং শিক্ষার্থীদের পেমেন্ট স্ট্যাটাস সরাসরি দেখতে এবং ডিলিট করতে পারবেন।
                    </p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("payments")}
                        className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-700/30 transition-colors inline-flex items-center gap-1.5"
                      >
                        পেমেন্ট রেকর্ড অডিট করুন
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* If standard User */
                <div className="space-y-6">
                  
                  {/* User Profile Card */}
                  <div className="p-5.5 rounded-2xl bg-[#064e3b]/80 border border-emerald-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white">স্বাগতম, {currentUser.name}!</h3>
                      <p className="text-emerald-300 text-xs mt-1 font-semibold">
                        অ্যাকাউন্ট টাইপ: <span className="bg-emerald-900 border border-emerald-700 px-2 py-0.5 rounded text-white font-bold">সাধারণ ইউজার</span>
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800 text-xs text-emerald-300 font-semibold leading-relaxed">
                      💡 আপনি অ্যাডমিন প্যানেল এবং সিক্রেট পেমেন্ট লগ দেখতে চাইলে উপরে থাকা <span className="text-red-400 font-bold">"অ্যাডমিন মোডে যান"</span> বাটনে ক্লিক করে ড্যাশবোর্ড সুইচ করতে পারেন!
                    </div>
                  </div>

                  {/* User Active Courses (সার্ভিস কিনতে পেমেন্ট করতে হবে) */}
                  <div>
                    <h4 className="text-sm font-bold text-emerald-50 mb-4 uppercase tracking-wider">
                      আমার সক্রিয় কোর্সসমূহ ও সেবা
                    </h4>

                    {enrolledServiceIds.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-emerald-950/50 border border-yellow-600/30 flex flex-col items-center text-center">
                        <Lock className="w-10 h-10 text-yellow-500 mb-3" />
                        <span className="text-yellow-400 text-sm font-bold">আপনি এখনো কোনো সার্ভিসের জন্য পেমেন্ট করেননি!</span>
                        <p className="text-emerald-300 text-xs mt-2 max-w-sm font-medium leading-relaxed">
                          "সার্ভিস কিনতে হলে পেমেন্ট করতে হবে নইলে কোর্সে জয়েন করতে পারবেন না"। অনুগ্রহ করে কোর্স সেকশনে গিয়ে আপনার প্রিয় সার্ভিসটি অর্ডার করুন!
                        </p>
                        
                        <button
                          onClick={onClose}
                          className="mt-4 py-2 px-6 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                        >
                          সার্ভিস কিনতে চলে যান
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.filter(s => enrolledServiceIds.includes(s.id)).map(service => (
                          <div key={service.id} className="p-4 rounded-2xl bg-[#043329] border border-emerald-500/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-[#022c22] font-black text-[9px] uppercase tracking-wider rounded-bl-xl flex items-center gap-1">
                              <Unlock className="w-3 h-3" /> সক্রিয়
                            </div>
                            
                            <h5 className="text-sm font-extrabold text-emerald-50">{service.bengaliName}</h5>
                            <span className="text-[11px] text-emerald-300 block mt-1 font-bold">ভর্তি পরিশোধিত: {toBengaliNumber(service.price)} ৳</span>
                            
                            {/* Primary green dashboard button specified as red! */}
                            <button
                              onClick={() => alert(`অভিনন্দন! ${service.bengaliName} কোর্সের প্রথম সেমিস্টারের ক্লাস ইতিমধ্যেই শুরু হয়েছে। মডিউলসমূহ আপনার ইমেইলে পাঠিয়ে দেয়া হয়েছে!`)}
                              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-500 text-white/95 font-bold text-xs rounded-xl shadow transition-colors"
                            >
                              ক্লাসে জয়েন করুন
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Tab: Payments (Only Admin can access) */}
          {activeTab === "payments" && isAdmin && (
            <div className="space-y-4">
              <h3 className="text-md font-bold text-emerald-50 flex items-center justify-between">
                <span>শিক্ষার্থীদের পেমেন্ট ট্রানজেকশন সূচি</span>
                <span className="text-xs bg-[#064e3b] px-3 py-1 rounded-full border border-emerald-500">
                  মোট: {payments.length} টি রেকর্ড
                </span>
              </h3>

              {payments.length === 0 ? (
                <div className="p-8 text-center bg-emerald-950/40 rounded-2xl text-emerald-300 text-xs">
                  কোনো পেমেন্ট রেকর্ড খুঁজে পাওয়া যায়নি।
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => {
                    const matchedService = services.find(s => s.id === p.serviceId);
                    return (
                      <div key={p.id} className="p-4 rounded-2xl bg-[#043e30] border border-emerald-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white font-bold">{p.userEmail}</span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded font-mono">
                              {p.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-200 mt-1.5 font-semibold">
                            সার্ভিস: <span className="text-yellow-300">{matchedService ? matchedService.bengaliName : p.serviceId}</span> | ট্রানজেকশন আইডি: <span className="text-white font-mono font-bold">{p.transactionId}</span>
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1 font-mono">সময়: {p.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                          <span className="text-sm font-black text-emerald-300">
                            ৳ {toBengaliNumber(p.amount)}
                          </span>

                          {/* Primary Red Button on Dashboard for deletion/clearing */}
                          <button
                            onClick={() => {
                              if (confirm("আপনি কি এই পেমেন্ট রেকর্ডটি মুছে ফেলতে চান?")) {
                                onClearPayment(p.id);
                              }
                            }}
                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors shadow shadow-red-900"
                            title="পেমেন্ট বাতিল / ডিলিট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab: Members (Only Admin can access) */}
          {activeTab === "members" && isAdmin && (
            <div className="space-y-4">
              <h3 className="text-md font-bold text-emerald-50 flex items-center justify-between">
                <span>নিবন্ধিত শিক্ষার্থীরা এবং তাদের রোল</span>
                <span className="text-xs bg-[#064e3b] px-3 py-1 rounded-full border border-emerald-500">
                  মোট: {members.length} জন
                </span>
              </h3>

              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="p-3.5 rounded-2xl bg-[#043e30] border border-emerald-500/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                        <span className="text-xs text-emerald-300 block font-mono">{member.email}</span>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${
                      member.role === "admin" 
                        ? "bg-red-600 text-white shadow-sm" 
                        : "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    }`}>
                      {member.role === "admin" ? "অ্যাডমিন" : "মেম্বার"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Dashboard Footer info */}
        <div className="p-4 bg-[#064e3b] border-t border-emerald-500/30 text-center text-[11px] text-emerald-300 font-semibold">
          © অমর সাইট মাস্টার ড্যাশবোর্ড প্যানেল | ডার্ক থিম মোডে ফায়ারবেস সংযোগ সম্পূর্ণরূপে সক্রিয়
        </div>

      </motion.div>
    </div>
  );
}
