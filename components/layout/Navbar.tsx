'use client';

import { useState } from 'react';
import { SHOP_INFO, ADMIN_INFO } from '@/constants/app';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  onMenuToggle?: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-muted shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu Toggle & Shop Name */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="hidden md:block">
              {/* <h1 className="text-2xl font-serif font-bold text-foreground">{SHOP_INFO.image}</h1> */}
              <Image src={SHOP_INFO.image} alt={`${SHOP_INFO.name} Logo`} width={150} height={32} className="rounded-full" />
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Right: Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{ADMIN_INFO.name}</p>
              <p className="text-xs text-muted-foreground">{ADMIN_INFO.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl text-primary-foreground font-bold">
              {ADMIN_INFO.avatar}
            </div>
            <svg
              className={`w-4 h-4 transition-transform text-foreground ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-muted py-1 z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                <span>🔐</span> Change Password
              </button>
              <hr className="my-1 border-muted" />
              <button
                onClick={() => alert('Logged out successfully')}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
