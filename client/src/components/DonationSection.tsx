"use client";

import { Button } from "@/components/ui/button";

export default function DonationSection() {
  return (
    <div className="bg-gradient-to-r from-pink-50 via-white to-yellow-50 py-12 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Keep the Slang Flowing! 🌊
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            To keep this web running, any donation is appreciated unc/twin 🥀🥀🥀
          </p>
          <Button
            className="bg-[#003087] hover:bg-[#003087]/90 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            onClick={() => window.open("https://paypal.me/kenzonayandra", "_blank")}
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Support This Project! 💸
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
} 