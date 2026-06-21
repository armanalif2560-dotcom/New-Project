import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, ShieldCheck, LogOut, ArrowRight, CreditCard } from "lucide-react";
import { Service } from "../types";

interface HeaderProps {
  currentUser: { email: string; name: string; role: "admin" | "user" } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenDashboard: () => void;
  services: Service[];
  onSelectService: (serviceId: string) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Header({
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenDashboard,
  services,
  onSelectService,
  activeSection,
  setActiveSection
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const navItems = [
    { id: "home", label: "হোম" },
    { id: "about", label: "আমাদের সম্পর্কে" },
    { id: "services", label: "সার্ভিসেস" },
    { id: "people", label: "যুক্ত মানুষজন" },
    { id: "reviews", label: "স্টুডেন্ট রিভিউ" },
    { id: "contact", label: "যোগাযোগ" }
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-blue-950/50 shadow-lg shadow-blue-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white font-black text-2xl tracking-tighter shadow-md shadow-blue-500/30 border border-blue-400/30 cursor-pointer"
              onClick={() => handleNavClick("home")}
            >
              AS
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300 opacity-25 blur-sm -z-10 animate-pulse"></div>
            </motion.div>
            <span className="ml-3 font-sans font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-white">
              Amar Site
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item) => {
              if (item.id === "services") {
                return (
                  <div 
                    key={item.id} 
                    className="relative group py-2"
                    onMouseEnter={() => setServiceDropdownOpen(true)}
                    onMouseLeave={() => setServiceDropdownOpen(false)}
                  >
                    <button 
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        activeSection === "services" 
                          ? "bg-blue-950/60 text-blue-400 border border-blue-800/50 shadow-inner" 
                          : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-300 ${serviceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Services Dropdown */}
                    <AnimatePresence>
                      {serviceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#090d16] border border-blue-900/60 p-4 shadow-xl shadow-black/80"
                        >
                          <div className="mb-3 pb-2 border-b border-blue-920/40">
                            <span className="text-xs uppercase tracking-wider text-blue-400 font-bold font-mono">
                              আমাদের কারিকুলাম ও কোর্সসমূহ
                            </span>
                            <div className="mt-2 text-[11px] leading-relaxed text-red-400 font-medium bg-red-950/40 p-2 rounded-lg border border-red-900/40 flex items-start gap-1.5 shadow-sm">
                              <CreditCard className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
                              <span>সার্ভিস কিনতে হলে পেমেন্ট করতে হবে নইলে কোর্সে জয়েন করতে পারবেন না!</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            {services.map((service) => (
                              <button
                                key={service.id}
                                onClick={() => {
                                  onSelectService(service.id);
                                  setServiceDropdownOpen(false);
                                  handleNavClick("services");
                                }}
                                className="w-full text-left p-2.5 rounded-xl transition-all hover:bg-blue-950/40 hover:border-l-4 hover:border-blue-500 border border-transparent flex flex-col group/item"
                              >
                                <span className="text-sm font-bold text-slate-100 group-hover/item:text-blue-300 transition-colors">
                                  {service.bengaliName}
                                </span>
                                <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                  কোর্স ফি: {service.price.toLocaleString("bn-BD")} ৳
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeSection === item.id 
                      ? "bg-blue-950/60 text-blue-400 border border-blue-800/50 shadow-inner" 
                      : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Session Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenDashboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    currentUser.role === "admin" 
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/30" 
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  }`}
                >
                  {currentUser.role === "admin" ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-100" />
                      <span>অ্যাডমিন ড্যাশবোর্ড</span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>আমার ড্যাশবোর্ড</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={onLogout}
                  title="লগ-আউট করুন"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 border border-slate-700/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/20 border border-blue-500/30 transition-all cursor-pointer"
              >
                লগইন / জয়েন করুন <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={onOpenDashboard}
                className="p-2 rounded-xl bg-blue-900/40 text-blue-300 border border-blue-800/50"
              >
                <User className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-blue-950 bg-[#090d16] px-4 pt-2 pb-6 space-y-3"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex justify-between items-center ${
                    activeSection === item.id 
                      ? "bg-blue-950 text-blue-400" 
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === "services" && <span className="text-[10px] text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-900/30">নোট</span>}
                </button>
              ))}
            </div>

            {/* Service dropdown alert in mobile too */}
            <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/30 text-xs text-red-300 flex items-start gap-1.5 mx-1">
              <CreditCard className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>সার্ভিস কিনতে হলে পেমেন্ট করতে হবে নইলে কোর্সে জয়েন করতে পারবেন না!</span>
            </div>

            <div className="pt-4 border-t border-blue-950 mx-1">
              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-300 line-clamp-1">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      onOpenDashboard();
                      setIsOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-white ${
                      currentUser.role === "admin" ? "bg-emerald-600" : "bg-blue-600"
                    }`}
                  >
                    {currentUser.role === "admin" ? "অ্যাডমিন ড্যাশবোর্ড" : "আমার ড্যাশবোর্ড"}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-900 text-red-400 border border-slate-800 text-center"
                  >
                    লগ-আউট করুন
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white text-center"
                >
                  লগইন / জয়েন করুন
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
