"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "94770813690";
const DEFAULT_MESSAGE = "Hi Aitken Travels! 👋\n\nI'm interested in your transport services in Sri Lanka. Could you help me with:\n\n• Destination: \n• Date: \n• Number of passengers: \n• Vehicle preference: \n\nLooking forward to hearing from you!";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setChatOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {visible && !chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
          >
            {/* Label pill */}
            <motion.button
              onClick={() => setChatOpen(true)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="hidden md:flex items-center gap-2 bg-white rounded-full pl-5 pr-6 py-3 shadow-elevation-2 border border-slate-100 hover:shadow-elevation-1 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
              <span className="text-[14px] font-semibold text-slate-800 group-hover:text-[#25D366] transition-colors">
                Chat with us
              </span>
            </motion.button>

            {/* Icon button */}
            <button
              onClick={() => setChatOpen(true)}
              className="relative w-[60px] h-[60px] rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer min-w-[60px] min-h-[60px]"
              aria-label="Chat on WhatsApp"
            >
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
              <span className="absolute inset-[-4px] rounded-full border-2 border-[#25D366]/30 animate-pulse" />
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white" className="relative z-10">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden shadow-elevation-3 border border-slate-100"
          >
            {/* Header */}
            <div className="bg-[#075E54] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold text-[15px]">Aitken Travels</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                    <span className="text-white/70 text-[11px]">Typically replies within minutes</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
              </button>
            </div>

            {/* Chat body */}
            <div className="bg-[#ECE5DD] p-4" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d5cec3' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}>
              {/* Greeting bubble */}
              <div className="bg-white rounded-xl rounded-tl-sm p-3 shadow-sm max-w-[85%] mb-3">
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  Hello! Welcome to Aitken Travels. How can we help you plan your Sri Lanka trip? 🇱🇰
                </p>
                <div className="text-[10px] text-slate-400 text-right mt-1">Aitken Travels</div>
              </div>

              {/* Quick replies */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {["Airport Transfer", "Round Tour", "Vehicle Rental", "Day Trip"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setMessage(`Hi Aitken Travels! I'm interested in booking a ${q} in Sri Lanka. Could you please share more details?`)}
                    className="bg-white border border-[#25D366]/30 text-[#075E54] rounded-full px-3 py-1.5 text-[11px] font-medium hover:bg-[#25D366]/10 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="bg-white p-3 border-t border-slate-100">
              <div className="flex gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="flex-1 text-[13px] text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]/20 resize-none leading-relaxed"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSend}
                  className="self-end w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#20BD5A] active:scale-95 transition-all cursor-pointer flex-shrink-0"
                  aria-label="Send on WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Powered by WhatsApp &middot; Opens in WhatsApp to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
