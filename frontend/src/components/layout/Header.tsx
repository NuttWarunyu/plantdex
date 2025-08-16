"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Leaf,
  Heart,
  Search,
  User,
  Globe,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useUser } from "@/lib/user-context";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  const handleLogout = () => {
    logout();
    closeUserMenu();
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              PlantDex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              หน้าหลัก
            </Link>
            <Link
              href="/give-plant"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              ปล่อยต้นไม้
            </Link>
            <Link
              href="/adopt-plant"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              รับเลี้ยงต้นไม้
            </Link>
            {user && (
              <Link
                href="/my-plants"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                ต้นไม้ของฉัน
              </Link>
            )}
          </nav>

          {/* Right side - Language and User */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'th' ? 'EN' : 'TH'}</span>
            </Button>

            {user ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleUserMenu}
                  className="border-green-600 text-green-600 hover:bg-green-50 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <Link
                      href="/my-plants"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeUserMenu}
                    >
                      ต้นไม้ของฉัน
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeUserMenu}
                    >
                      <Settings className="inline h-4 w-4 mr-2" />
                      โปรไฟล์
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                onClick={closeMenu}
              >
                หน้าหลัก
              </Link>
              <Link
                href="/give-plant"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                onClick={closeMenu}
              >
                ปล่อยต้นไม้
              </Link>
              <Link
                href="/adopt-plant"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                onClick={closeMenu}
              >
                รับเลี้ยงต้นไม้
              </Link>
              {user && (
                <Link
                  href="/my-plants"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                  onClick={closeMenu}
                >
                  ต้นไม้ของฉัน
                </Link>
              )}

              {/* Mobile Language and User */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{language === 'th' ? 'EN' : 'TH'}</span>
                  </Button>

                  {user ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">{user.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        ออกจากระบบ
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link href="/login">
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          เข้าสู่ระบบ
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" size="sm" className="border-green-600 text-green-600">
                          สมัครสมาชิก
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 