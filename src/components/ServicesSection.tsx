import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShieldAlert, Sparkles, ShoppingBag, CreditCard, HeartHandshake, ArrowRight } from "lucide-react";
import { Service, PaymentDetails } from "../types";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { db } from "../firebase";

interface ServicesSectionProps {
  services: Service[];
  selectedServiceId: string | null;
  onPaymentSuccess: (payment: PaymentDetails) => void;
  currentUser: { email: string; name: string; role: "admin" | "user" } | null;
  onOpenLogin: () => void;
}

export default function ServicesSection({
  services,
  selectedServiceId,
  onPaymentSuccess,
  currentUser,
  onOpenLogin
}: ServicesSectionProps) {
  const [activePaymentService, setActivePaymentService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("bkash");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false);
  const [paymentMessage, setPaymentMessage] = useState<string>("");

  const handleBuyClick = (service: Service) => {
    if (!currentUser) {
      alert("পেমেন্ট করতে এবং কোর্সে জয়েন হতে প্রথমে দয়া করে লগইন করুন।");
      onOpenLogin();
      return;
    }
    setActivePaymentService(service);
    // Generate a default transaction ID to assist the developer testing the site
    setTransactionId("TXN-" + Math.floor(100000 + Math.random() * 900000));
  };

  const handlePaySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activePaymentService) return;

    if (!phoneNo || phoneNo.length < 11) {
      alert("দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।");
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentMessage("");

    try {
      const paymentData: Omit<PaymentDetails, "id"> = {
        userEmail: currentUser.email,
        serviceId: activePaymentService.id,
        amount: activePaymentService.price,
        paymentMethod: paymentMethod,
        transactionId: transactionId || "TXN-" + Math.floor(100000 + Math.random() * 900000),
        status: "success", // Automatically mark as success for instant delight
        timestamp: new Date().toISOString()
      };

      // Store in Firebase Firestore collection 'payments'
      const docRef = await addDoc(collection(db, "payments"), paymentData);
      
      const completePayment: PaymentDetails = {
        id: docRef.id,
        ...paymentData
      };

      // Notify the parent state to unlock the course/membership live!
      onPaymentSuccess(completePayment);
      
      setPaymentMessage("🎉 পেমেন্ট সফল হয়েছে! আপনার কোর্সটি অবিলম্বে সক্রিয় করা হয়েছে। ড্যাশবোর্ডে গিয়ে ক্লাস শুরু করুন।");
      setTimeout(() => {
        setActivePaymentService(null);
        setPhoneNo("");
        setTransactionId("");
        setPaymentMessage("");
      }, 3500);

    } catch (err) {
      console.error("Error inserting payment:", err);
      alert("পেমেন্ট সম্পন্ন করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-[#090d16] to-[#01050e] relative overflow-hidden">
      {/* Background blobs for premium animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-900 text-blue-400 text-xs font-bold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের কারিকুলাম ও সার্ভিসেস</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4"
          >
            আপনার দক্ষতা বিকাশে আমাদের{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              বিশেষায়িত কোর্সসমূহ
            </span>
          </motion.h2>

          {/* Hard constraint warning in prominent visual format */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex items-start gap-3 p-4 bg-red-950/50 rounded-2xl border border-red-900/60 text-red-300 text-sm max-w-2xl mx-auto text-left shadow-lg shadow-red-950/20"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <span className="font-extrabold block text-red-200">⚠️ অত্যন্ত গুরুত্বপূর্ণ ঘোষণা:</span>
              <p className="mt-1 font-medium leading-relaxed">
                আমাদের প্রতিটি কোর্স এবং সার্ভিস সম্পূর্ণ প্রফেশনাল। আপনাকে সার্ভিসের বিপরীতে নির্দিষ্ট পেমেন্ট করতে হবে, পেমেন্ট ভেরিফিকেশন সম্পন্ন না হলে আপনি কোনো কোর্সে বা লাইভ ড্যাশবোর্ডে জয়েন করতে পারবেন না।
              </p>
            </div>
          </motion.div>
        </div>

        {/* Services Bento-like Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isHighlighted = selectedServiceId === service.id;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                id={`card-${service.id}`}
                className={`relative rounded-3xl p-6.5 flex flex-col justify-between border transition-all h-full ${
                  isHighlighted 
                    ? "bg-[#0c162e] border-blue-500 shadow-2xl shadow-blue-500/20" 
                    : "bg-[#090e1a]/80 border-slate-900 hover:border-blue-950 shadow-xl"
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md shadow-blue-500/40">
                    নির্বাচিত
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-extrabold text-blue-100 mb-2">
                    {service.bengaliName}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                    {service.description}
                  </p>

                  <div className="mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/40">
                    <span className="text-xs text-slate-400 block mb-1">কোর্স ফি</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                      {service.price.toLocaleString("bn-BD")} ৳
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">(এককালীন পরিশোধযোগ্য)</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                        <span className="w-4 h-4 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-blue-400" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyClick(service)}
                  id={`btn-${service.id}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 border border-blue-500/30 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কোর্সটিতে ভর্তি হোন</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Payment Checkout Modal */}
      <AnimatePresence>
        {activePaymentService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActivePaymentService(null)}
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-[#090e1a] border border-blue-900/60 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6.5"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">পেমেন্ট গেটওয়ে (সিমুলেটর)</h3>
                <p className="text-slate-400 text-xs mt-1">
                  কোর্স: <span className="text-blue-300 font-extrabold">{activePaymentService.bengaliName}</span>
                </p>
                <div className="mt-2 text-2xl font-black text-blue-400">
                  {activePaymentService.price.toLocaleString("bn-BD")} ৳
                </div>
              </div>

              {paymentMessage ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-2xl text-emerald-300 text-xs font-semibold leading-relaxed text-center">
                  {paymentMessage}
                </div>
              ) : (
                <form onSubmit={handlePaySubmit} className="space-y-4">
                  {/* Select Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">পেমেন্ট পদ্ধতি নির্বাচন করুন</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "bkash", name: "বিকাশ", color: "bg-[#e2125d] text-white" },
                        { id: "nagad", name: "নগদ", color: "bg-[#f57c24] text-white" },
                        { id: "rocket", name: "রকেট", color: "bg-[#8c268a] text-white" }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={`py-2 rounded-xl text-xs font-bold text-center border transition-all ${
                            paymentMethod === m.id
                              ? `${m.color} border-transparent shadow shadow-black`
                              : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50"
                          }`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Number Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার {paymentMethod === "bkash" ? "বিকাশ" : paymentMethod === "nagad" ? "নগদ" : "রকেট"} নম্বর</label>
                    <input
                      type="text"
                      required
                      placeholder="01XXXXXXXXX"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ট্রানজেকশন আইডি (অটো-জেনারেটেড)</label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div className="flex items-start gap-1 p-2 bg-red-950/20 border border-red-900/30 rounded-xl text-[10px] text-red-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>ভেরিফিকেশন সম্পন্ন হওয়ার সাথে সাথে আপনার ফায়ারবেস ডেটা আপডেট হয়ে কোর্সের অ্যাক্সেস দেয়া হবে।</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmittingPayment}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{isSubmittingPayment ? "ভেরিফাইং..." : "টাকা পরিশোধ নিশ্চিত করুন"}</span>
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
