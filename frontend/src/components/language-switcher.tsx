"use client";

import { useLanguage } from "../lib/language-context";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 h-9 min-w-[60px] justify-center"
      title={language === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
    >
      <Globe className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'EN' : 'ไทย'}
      </span>
    </Button>
  );
} 