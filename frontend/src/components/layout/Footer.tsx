import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone,
  MapPin
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white">PlantDex</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              แพลตฟอร์มปล่อยต้นไม้ใหม่ - เชื่อมต่อผู้คนที่รักต้นไม้ ให้ต้นไม้ได้บ้านใหม่ที่ดีกว่า 
              ฟรี 100% ปลอดภัยและน่าเชื่อถือ
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/give-plant" className="text-gray-400 hover:text-white transition-colors">
                  ปล่อยต้นไม้
                </Link>
              </li>
              <li>
                <Link href="/adopt-plant" className="text-gray-400 hover:text-white transition-colors">
                  รับเลี้ยงต้นไม้
                </Link>
              </li>
              <li>
                <Link href="/instant-buy" className="text-gray-400 hover:text-white transition-colors">
                  InstantBuy
                </Link>
              </li>
              <li>
                <Link href="/my-plants" className="text-gray-400 hover:text-white transition-colors">
                  ต้นไม้ของฉัน
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">info@plantdex.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+66 2 XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Bangkok, Thailand</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 PlantDex. All rights reserved. | 
            <Link href="/privacy" className="ml-2 text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link> | 
            <Link href="/terms" className="ml-2 text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
} 