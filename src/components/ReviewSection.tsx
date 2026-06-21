import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Star, Plus, ThumbsUp, Sparkles, User } from "lucide-react";
import { Review } from "../types";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
  currentUser: { email: string; name: string; role: "admin" | "user" } | null;
}

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
];

export default function ReviewSection({ reviews, onAddReview, currentUser }: ReviewSectionProps) {
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("ডিজিটাল মার্কেটিং মাস্টারক্লাস");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentName || !comment) {
      alert("অনুগ্রহ করে আপনার নাম এবং মতামত প্রদান করুন!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const newReview = {
      studentName,
      courseName,
      rating: Number(rating),
      comment,
      avatarUrl: AVATARS[avatarIndex],
      createdAt: new Date().toISOString().split("T")[0]
    };

    try {
      // Write review data directly to Firebase Firestore
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      
      const savedReview: Review = {
        id: docRef.id,
        ...newReview
      };

      // Instantly render in the parent state
      onAddReview(savedReview);
      
      setMessage("🎉 আপনার মূল্যবান রিভিউ সফলভাবে ফায়ারবেসে সংরক্ষিত হয়েছে এবং যুক্ত করা হয়েছে!");
      setTimeout(() => {
        setStudentName("");
        setComment("");
        setIsAddingReview(false);
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error("Firestore Review Error, using fallback:", err);
      // Fallback
      const completeReview: Review = {
        id: "rev-" + Date.now(),
        ...newReview
      };
      onAddReview(completeReview);
      setMessage("অফলাইন/Fallback মোডে রিভিউ যুক্ত করা হয়েছে!");
      setTimeout(() => {
        setStudentName("");
        setComment("");
        setIsAddingReview(false);
        setMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-[#090d16] to-[#02050b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-900 text-blue-400 text-xs font-bold mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>শিক্ষার্থীদের মতামত ও ভালোবাসা</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              আমাদের স্টুডেন্ট{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                রিভিউ এবং সাফল্য গাঁথা
              </span>
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              আমাদের বিভিন্ন কোর্স সম্পন্ন করে আমাদের শিক্ষার্থীরা যে প্রতিক্রিয়া জানিয়েছেন তা নিচে দেখে নিন।
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddingReview(true)}
            className="self-start md:self-end py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 border border-blue-400/30 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>একটি রিভিউ প্রদান করুন</span>
          </motion.button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl bg-[#090e1a]/80 border border-slate-900 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-750"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-blue-950/40 pt-4">
                  <img
                    referrerPolicy="no-referrer"
                    src={review.avatarUrl}
                    alt={review.studentName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{review.studentName}</h4>
                    <span className="text-[11px] text-blue-400 font-bold block">{review.courseName}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Review Submission Modal overlay */}
      <AnimatePresence>
        {isAddingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setIsAddingReview(false)}
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-[#090e1a] border border-blue-900/60 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">আপনার মতামত দিন</h3>
                <p className="text-slate-400 text-xs mt-1">আমাদের কোর্স নিয়ে আপনার সত্যিকারের অভিজ্ঞতা শেয়ার করুন।</p>
              </div>

              {message ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-2xl text-emerald-300 text-xs font-semibold leading-relaxed text-center">
                  {message}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="সাব্বির হোসেন"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  {/* Course select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">কোর্সের নাম</label>
                    <select
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                    >
                      <option value="ডিজিটাল মার্কেটিং মাস্টারক্লাস">ডিজিটাল মার্কেটিং মাস্টারক্লাস</option>
                      <option value="প্রফেশনাল গ্রাফিক্স ডিজাইন">প্রফেশনাল গ্রাফিক্স ডিজাইন</option>
                      <option value="এআই টুলস ব্যবহার ও অটোমেশন">এআই টুলস ব্যবহার ও অটোমেশন</option>
                    </select>
                  </div>

                  {/* Avatar picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">পছন্দের প্রোফাইল পিকচার সিলেক্ট করুন</label>
                    <div className="flex gap-3 justify-center">
                      {AVATARS.map((av, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAvatarIndex(idx)}
                          className={`relative rounded-full overflow-hidden w-11 h-11 border-2 transition-all ${
                            avatarIndex === idx ? "border-blue-500 scale-110 shadow-lg shadow-blue-500/20" : "border-transparent opacity-60"
                          }`}
                        >
                          <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">রেটিং বা স্কোর</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          type="button"
                          key={stars}
                          onClick={() => setRating(stars)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              stars <= rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার বিস্তারিত মতামত</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="মেন্টরদের বোঝানোর পদ্ধতি চমৎকার ছিল এবং গাইডলাইন ফলো করে আমি প্রথম প্রজেক্ট পেয়েছি..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans resize-none"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmitting ? "সংরক্ষণ করা হচ্ছে..." : "রিভিউ সাবমিট করুন"}</span>
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
