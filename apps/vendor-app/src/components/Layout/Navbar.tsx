"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiHelpCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Partners", href: "/partners" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-xl
                 border-b border-black/5 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <motion.div whileHover={{ y: -1 }}>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              Macro Rides
            </Link>
          </motion.div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                className="relative"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  {link.name}
                </Link>

                {/* Soft underline */}
                <motion.span
                  variants={{
                    rest: { width: 0, opacity: 0 },
                    hover: { width: "100%", opacity: 1 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 -bottom-1 h-2px rounded-full bg-black/70"
                />
              </motion.div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-5 relative">

            {[FiPhone, FiHelpCircle].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-gray-700 cursor-pointer"
              >
                <Icon size={18} />
              </motion.div>
            ))}

            {/* Profile */}
            <div
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="cursor-pointer text-gray-700"
              >
                <FiUser size={18} />
              </motion.div>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-48 rounded-2xl
                               bg-white/90 backdrop-blur-xl
                               shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                               border border-black/5 p-2"
                  >
                    <Link
                      href="/sign-in"
                      className="block px-4 py-2 text-sm rounded-xl
                                 hover:bg-black/5 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block px-4 py-2 text-sm rounded-xl
                                 hover:bg-black/5 transition"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-black/5"
          >
            <div className="px-5 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-medium text-gray-700"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-black/5 space-y-3">
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>

                <div className="flex gap-4 pt-2 text-gray-700">
                  <FiPhone />
                  <FiHelpCircle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
