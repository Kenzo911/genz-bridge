"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="Gen Z Bridge Home">
              <Image src="/logo.svg" alt="Gen Z Bridge logo" width={320} height={80} className="h-8 w-auto" priority />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <Button variant="ghost">Translator</Button>
              </Link>
              <Link href="/slang">
                <Button variant="ghost">Gen Z Slang</Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden mt-2 space-y-1 overflow-hidden transition-all duration-300 origin-top", 
            isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
        >
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Translator</Button>
          </Link>
          <Link href="/slang" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">Gen Z Slang</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
} 