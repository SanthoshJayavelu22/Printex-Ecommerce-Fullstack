"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

interface Settings {
  logo: string;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  footerText: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  logo: "/images/printex-labels-logo.png",
  storeName: "Printex Labels",
  contactEmail: "info@printexlabels.com",
  contactPhone: "+91 98765 43210",
  address: "123, Printing Street, Industrial Area, Chennai, Tamil Nadu",
  socialLinks: {
    facebook: "https://facebook.com/printex",
    instagram: "https://instagram.com/printex",
    twitter: "https://twitter.com/printex",
    linkedin: "https://linkedin.com/company/printex"
  },
  seo: {
    metaTitle: "Printex Labels | Premium Custom Sticker Printing",
    metaDescription: "Crafting premium digital identities through precision label manufacturing and high-impact printing solutions.",
    metaKeywords: "stickers, labels, printing, custom labels, vinyl stickers"
  },
  footerText: "© 2026 PRINTEX LABELS. ALL RIGHTS RESERVED."
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(defaultSettings);
  const [loading, setLoading] = useState(false);

  const refreshSettings = async () => {
    // No-op after module removal
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
