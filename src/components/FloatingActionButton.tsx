'use client';

import React, { useState } from 'react';
import { Plus, MessageCircle, Phone, Search, Filter } from 'lucide-react';
import Link from 'next/link';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: 'إضافة إعلان',
      href: '/listings/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Search,
      label: 'البحث',
      href: '/listings',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: MessageCircle,
      label: 'المحادثات',
      href: '/contact',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: Phone,
      label: 'اتصل بنا',
      href: '/contact',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="fixed bottom-24 left-4 z-40 md:hidden">
      {/* Action Buttons */}
      <div className={`flex flex-col-reverse gap-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg 
                        transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                isOpen ? 'animate-slide-up' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setIsOpen(false)}
            >
              <IconComponent size={20} />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full 
                   shadow-lg flex items-center justify-center transition-all duration-300 
                   hover:scale-110 hover:shadow-xl active:scale-95 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <Plus size={24} className="transition-transform duration-300" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
