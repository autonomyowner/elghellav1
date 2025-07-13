'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, User, Grid } from 'lucide-react';

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      href: '/nurseries',
      label: 'المشاتل',
      icon: Search,
      isActive: pathname === '/nurseries'
    },
    {
      href: '/listings/new',
      label: 'إضافة',
      icon: Plus,
      isActive: pathname === '/listings/new',
      isSpecial: true
    },
    {
      href: '/equipment-rental',
      label: 'المعدات',
      icon: Grid,
      isActive: pathname === '/equipment-rental'
    },
    {
      href: '/profile',
      label: 'الحساب',
      icon: User,
      isActive: pathname.startsWith('/profile') || pathname.startsWith('/auth')
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-green-400/20">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center relative group"
              >
                <div className="absolute -top-6 w-12 h-12 btn-awesome rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
                  <IconComponent size={20} className="text-white" />
                </div>
                <div className="mt-4 text-xs text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-300 group ${
                item.isActive 
                  ? 'text-green-400' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                item.isActive 
                  ? 'bg-green-400/20 scale-110' 
                  : 'group-hover:bg-white/10 group-hover:scale-105'
              }`}>
                <IconComponent size={18} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                item.isActive ? 'scale-110' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
