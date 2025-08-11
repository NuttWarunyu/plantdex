"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/language-context";
import { 
  Search, 
  BarChart3, 
  User, 
  ShoppingCart,
  Menu,
  Upload
} from "lucide-react";

export function Header() {
  const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-green-700">PlantDex</span>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link href="/market" className="nav-item flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span className="flexible-text">{t('header.nav.market')}</span>
            </Link>
            <Link href="/plants" className="nav-item flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <Search className="h-4 w-4 flex-shrink-0" />
              <span className="flexible-text">{t('header.nav.plants')}</span>
            </Link>
            <Link href="/trends" className="nav-item text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <span className="flexible-text">{t('header.nav.trends')}</span>
            </Link>
            <Link href="/plant-exchange" className="nav-item flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <Upload className="h-4 w-4 flex-shrink-0" />
              <span className="flexible-text">Plant Exchange</span>
            </Link>

            {/* Pricing temporarily hidden - will be available in future updates */}
            {/* <Link href="/pricing" className="nav-item text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              <span className="flexible-text">{t('header.nav.pricing')}</span>
            </Link> */}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <LanguageSwitcher />
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="btn-text whitespace-nowrap">
                <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="flexible-text">{t('header.cart')}</span>
              </Button>
              <Button variant="outline" size="sm" className="btn-text whitespace-nowrap">
                <User className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="flexible-text">{t('header.signIn')}</span>
              </Button>
              <Button size="sm" className="btn-text bg-green-600 hover:bg-green-700 whitespace-nowrap">
                <span className="flexible-text">{t('header.getStarted')}</span>
              </Button>
            </div>
            
            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="px-2">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-2">
                <User className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden px-2">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 