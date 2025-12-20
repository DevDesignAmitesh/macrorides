import React from "react";
import { Utensils, Shirt } from "lucide-react";
import Link from "next/link";
import { features } from "@/utils";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 border-b shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo and Site Name */}
         <Logo />

          {/* Desktop Nav Links */}
          <div className="flex items-center space-x-10 ">
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <a
                className="hover:text-green-600 transition-colors"
                href="#features"
              >
                Features
              </a>
              <Link
                href="/register"
                className="hover:text-green-600 transition-colors"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="hover:text-green-600 transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pb-16 pt-10 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[url('/grid.jpg')] bg-cover opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 leading-10 md:leading-15">
            Power Your Local Business <br /> with{" "}
            <span className="bg-[#2C9C46] text-white p-2 rounded-md text-2xl md:text-4xl ">
              Macro Vendors
            </span>
          </h1>
          <p className="text-sm text-gray-700 mb-8 max-w-2xl mx-auto">
            One platform for food vendors & clothing sellers <br /> to manage
            orders, customers, and revenue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button variant="default" size="lg">
                Register Now
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>

          {/* FIXING THE DESIGN OF THE VENDOR APP */}

          {/* Large YouTube-style hero image */}
          <div className="max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg">
            <img
              src="/hero.png"
              alt="Macro Vendors Preview"
              className="w-full h-full object-contain bg-white"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for local vendors
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-neutral-300 hover:shadow-md transition-all duration-150"
              >
                <feature.icon className="h-12 w-12 text-[#2C9C46] mb-4" />
                <h3 className="text-xl font-semibold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Vendors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">
              Supported Vendors
            </h2>
            <p className="text-gray-600">
              Tailored dashboards and features for each type
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-neutral-300 p-8 hover:shadow-md transition-all duration-150 rounded-lg text-center">
              <Utensils className="h-16 w-16 text-[#2C9C46] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">
                🍱 Food Vendors
              </h3>
              <p className="text-gray-600">
                Complete restaurant and food business management
              </p>
            </div>
            <div className="bg-gray-50 border border-neutral-300 p-8 hover:shadow-md transition-all duration-150 rounded-lg text-center">
              <Shirt className="h-16 w-16 text-[#2C9C46] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-2">
                👕 Clothing Vendors
              </h3>
              <p className="text-gray-600">
                Fashion retail and apparel business solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo-2.png" className="w-14 rounded-md" alt="logo" />
                <span className="text-lg font-bold">Macro Vendors</span>
              </div>
              <p className="text-gray-400">
                Empowering local businesses with modern tools
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {/* we can create a Link tag here when we want */}
                  <Link
                    href={"/about-contact"}
                    target="_blank"
                    className="hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  {/* we can create a Link tag here when we want */}
                  <Link
                    href={"/about-contact"}
                    target="_blank"
                    className="hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/terms"
                    target="_blank"
                    className="hover:text-white"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {/* we can create a Link tag here when we want */}
                  <Link
                    href={"/help"}
                    target="_blank"
                    className="hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 Macro Rides. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
