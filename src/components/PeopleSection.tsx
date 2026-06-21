import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, UserPlus, Calendar, Heart, ShieldAlert } from "lucide-react";
import { Member } from "../types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface PeopleSectionProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  currentUser: { email: string; name: string; role: "admin" | "user" } | null;
}

export default function PeopleSection({ members, onAddMember, currentUser }: PeopleSectionProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("ডিজিটাল মার্কেটিং");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleJoinSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("নাম এবং ইমেইল নিশ্চিত করুন!");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const newMemberData = {
        name,
        email,
        role: "user" as const,
        joinedAt: new Date().toISOString().split("T")[0]
      };

      // Add to Firestore database 'members' collection
      const docRef = await addDoc(collection(db, "members"), newMemberData);

      const completeMember: Member = {
        id: docRef.id,
        ...newMemberData
      };

      // Update local state reactive representation
      onAddMember(completeMember);
      
      setStatusMessage("🎉 অভিনন্দন! আপনি সফলভাবে Amar Site পরিবারের সাথে যুক্ত হয়েছেন।");
      setTimeout(() => {
        setName("");
        setEmail("");
        setIsJoining(false);
        setStatusMessage("");
      }, 3000);

    } catch (err) {
      console.error("Error writing member to firestore:", err);
      // Fallback locally
      const mockId = "mem-" + Date.now();
      const completeMember: Member = {
        id: mockId,
        name,
        email,
        role: "user",
        joinedAt: new Date().toISOString().split("T")[0]
      };
      onAddMember(completeMember);
      setStatusMessage("অফলাইন/Fallback মোডে আপনি যুক্ত হয়েছেন!");
      setTimeout(() => {
        setName("");
        setEmail("");
        setIsJoining(false);
        setStatusMessage("");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="people" className="py-24 bg-gradient-to-b from-[#01050e] to-[#090d16] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-900 text-blue-400 text-xs font-bold mb-4"
          >
            <Users className="w-3.5 h-3.5" />
            <span>আমাদের কমিউনিটি ও নেটওয়ার্ক</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4"
          >
            আমাদের প্ল্যাটফর্মে ইতিমধ্যেই{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {members.length.toLocaleString("bn-BD")} জনেরও বেশি
            </span>{" "}
            মানুষ যুক্ত আছেন!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto text-sm"
          >
            শিখুন দেশের সেরা প্রফেশনাল মেন্টরদের তত্ত্বাবধানে। নিচে আমাদের সাথে যুক্ত হওয়া কিছু শিক্ষার্থীর তালিকা দেখতে পারেন এবং সরাসরি আমাদের সাথে যুক্ত হতে পারেন।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsJoining(true)}
              className="py-4 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 border border-blue-400/30 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 animate-bounce" />
              <span>আমাদের সাথে যুক্ত হোন</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Live counter & Dynamic lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Members Showcase */}
          <div className="lg:col-span-8 bg-[#090d16]/60 rounded-3xl p-6.5 border border-slate-900 shadow-xl max-h-[500px] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between border-b border-blue-950/50 pb-3">
              <span>নব্য রেজিস্টার্ড শিক্ষার্থী মডারেটর তালিকা</span>
              <span className="text-xs bg-blue-950 text-blue-400 px-3 py-1 rounded-full border border-blue-900 font-mono">
                লাইভ {members.length} জন
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-2xl bg-[#0b101c]/80 border border-blue-950/40 flex items-center justify-between shadow-sm hover:border-blue-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-950 to-indigo-950 border border-blue-900 flex items-center justify-center font-black text-blue-400">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100">{member.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-semibold font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{member.joinedAt}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-xl shadow-inner ${
                      member.role === "admin" 
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" 
                        : "bg-blue-950/40 text-blue-400 border border-blue-900/30"
                    }`}>
                      {member.role === "admin" ? "অ্যাডমিন" : "মেম্বার"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0c1324]/80 rounded-3xl p-6.5 border border-blue-950/50 shadow-xl">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-red-500 fill-red-500" />
              <span>কেন যুক্ত হবেন আমাদের সাথে?</span>
            </h3>
            
            <ul className="space-y-4">
              {[
                { title: "১০০% প্র্যাক্টিক্যাল লার্নিং", desc: "কোনো থিওরি নয়, সরাসরি কাজ করার মাধ্যমে শিখবেন।" },
                { title: "লাইফ-টাইম রিয়েল সলভিং সাপোর্ট", desc: "কোর্স শেষ হলেও লাইফ-টাইম ডেডিকেটেড মেন্টর সাপোর্ট পাবেন।" },
                { title: "অ্যাক্সেস করুন বিশেষ ড্যাশবোর্ড", desc: "যেকোনো সাহায্য এবং প্রশ্ন করার জন্য ড্যাশবোর্ড সুবিধা।" }
              ].map((adv, idx) => (
                <li key={idx} className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-1">
                  <span className="text-xs font-bold text-blue-300 font-sans">{adv.title}</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed font-semibold">{adv.desc}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Join Overlay Modal */}
      <AnimatePresence>
        {isJoining && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsJoining(false)}
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-[#090e1a] border border-blue-900/60 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6.5"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">যুক্ত হওয়ার চমৎকার সুযোগ!</h3>
                <p className="text-slate-400 text-xs mt-1">আপনার নাম এবং ইমেইল দিয়ে রেজিস্টার করুন।</p>
              </div>

              {statusMessage ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-2xl text-emerald-300 text-xs font-bold leading-relaxed text-center">
                  {statusMessage}
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার নাম</label>
                    <input
                      type="text"
                      required
                      placeholder="মোঃ আসিফ রহমান"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">আপনার ইমেইল (সঠিক লিখুন)</label>
                    <input
                      type="email"
                      required
                      placeholder="asif@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">সবচেয়ে পছন্দের বিষয়</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-[#05070e] border border-blue-900/40 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                    >
                      <option value="ডিজিটাল মার্কেটিং">ডিজিটাল মার্কেটিং</option>
                      <option value="গ্রাফিক্স ডিজাইন">গ্রাফিক্স ডিজাইন</option>
                      <option value="এআই টুলস ব্যবহার">এআই টুলস ব্যবহার</option>
                    </select>
                  </div>

                  <div className="p-2 bg-blue-950/40 border border-blue-900/30 rounded-xl text-[10px] text-blue-300">
                    <span>* রেজিস্টার করলে আপনার নাম লাইভ মানুষজনের তালিকায় যুক্ত করা হবে।</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 text-white hover:bg-blue-500 font-bold text-sm rounded-xl"
                  >
                    {isSubmitting ? "যুক্ত করা হচ্ছে..." : "জয়েনিং সমাপ্ত করুন"}
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
