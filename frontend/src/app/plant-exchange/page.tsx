"use client";

import { useLanguage } from "../../lib/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  Clock, 
  Star,
  Camera,
  Video,
  UserCheck,
  ClipboardCheck,
  Lock,
  Sparkles,
  ShoppingCart,
  Search,
  Package,
  Truck
} from "lucide-react";
import { useState } from "react";

type UserRole = 'seller' | 'buyer';

export default function PlantExchangePage() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state
  const [userRole, setUserRole] = useState<UserRole>('seller');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Plant Exchange
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            แพลตฟอร์มแลกเปลี่ยนพืชคุณภาพ - ขายพืชให้เรา หรือให้เราหาพืชที่คุณต้องการ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Premium Quality
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Fast Response
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Expert Curation
            </Badge>
          </div>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-2 border">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUserRole('seller')}
                className={`flex items-center justify-center space-x-3 p-6 rounded-xl transition-all duration-300 ${
                  userRole === 'seller'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className={`w-8 h-8 ${userRole === 'seller' ? 'text-white' : 'text-green-600'}`} />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">ขายพืชให้เรา</h3>
                  <p className="text-sm opacity-90">Sell Your Plants</p>
                </div>
              </button>
              
              <button
                onClick={() => setUserRole('buyer')}
                className={`flex items-center justify-center space-x-3 p-6 rounded-xl transition-all duration-300 ${
                  userRole === 'buyer'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className={`w-8 h-8 ${userRole === 'buyer' ? 'text-white' : 'text-blue-600'}`} />
                <div className="text-left">
                  <h3 className="font-semibold text-lg">ให้เราหาพืชให้</h3>
                  <p className="text-sm opacity-90">ให้เราหาพืชให้</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className={`${
                userRole === 'seller' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              } text-white`}>
                <CardTitle className="flex items-center">
                  {userRole === 'seller' ? (
                    <>
                      <Upload className="w-6 h-6 mr-2" />
                      Submit Your Plant
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6 mr-2" />
                      Request Your Plant
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-white/80">
                  {userRole === 'seller' 
                    ? 'Tell us about your plant and upload photos'
                    : 'Tell us what plant you\'re looking for and we\'ll find it for you'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                
                {!isLoggedIn ? (
                  /* Blur Preview for Non-Logged Users */
                  <div className="relative">
                    <div className="blur-sm pointer-events-none">
                      {userRole === 'seller' ? (
                        /* Seller Form Preview */
                        <div className="space-y-6">
                          {/* Plant Photos */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Photos
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Before Cutting</p>
                              </div>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">After Cutting</p>
                              </div>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Roots & Soil</p>
                              </div>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Short Video</p>
                              </div>
                            </div>
                          </div>

                          {/* Plant Details */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plant Species
                              </label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Monstera Albo, Philodendron Pink Princess"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plant Size
                              </label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 6 inches, 15cm"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plant Age
                              </label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 1 year, 6 months"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plant Health
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                                <option>Excellent - Perfect condition</option>
                                <option>Good - Minor imperfections</option>
                                <option>Fair - Some issues</option>
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Details
                            </label>
                            <textarea 
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Tell us more about your plant, any special features, or care requirements..."
                              disabled
                            />
                          </div>

                          {/* Submit Button */}
                          <Button className="w-full bg-gray-400 text-white py-3 text-lg" disabled>
                            <Upload className="w-5 h-5 mr-2" />
                            Submit for Review
                          </Button>
                        </div>
                      ) : (
                        /* Buyer Form Preview */
                        <div className="space-y-6">
                          {/* Plant Request */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Species
                            </label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="e.g., Monstera Albo, Philodendron Pink Princess"
                              disabled
                            />
                          </div>

                          {/* Plant Details */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Size
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                                <option>Small (4-6 inches)</option>
                                <option>Medium (8-12 inches)</option>
                                <option>Large (14+ inches)</option>
                                <option>Any size</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Range
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                                <option>฿500 - ฿2,000</option>
                                <option>฿2,000 - ฿8,000</option>
                                <option>฿8,000 - ฿25,000</option>
                                <option>No budget limit</option>
                              </select>
                            </div>
                          </div>

                          {/* Delivery Preferences */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery Location
                              </label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Bangkok, Chiang Mai"
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Urgency
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled>
                                <option>Not urgent - Take your time</option>
                                <option>Within 1-2 weeks</option>
                                <option>Within 3-5 days</option>
                                <option>ASAP - Need it now</option>
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Requirements
                            </label>
                            <textarea 
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Any specific requirements, special features, or notes..."
                              disabled
                            />
                          </div>

                          {/* Submit Button */}
                          <Button className="w-full bg-gray-400 text-white py-3 text-lg" disabled>
                            <Search className="w-5 h-5 mr-2" />
                            Submit Request
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Login Overlay */}
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                      <div className="text-center p-8">
                        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          Login Required
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          เพื่อความปลอดภัยและความโปร่งใส เราต้องการให้คุณลงทะเบียนก่อนใช้งานฟีเจอร์นี้
                        </p>
                        <div className="space-y-3">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Login to Continue
                          </Button>
                          <Button variant="outline" className="w-full">
                            Create Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Full Form for Logged Users */
                  <div className="space-y-6">
                    {userRole === 'seller' ? (
                      /* Seller Form */
                      <>
                        {/* Plant Photos */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plant Photos
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Before Cutting</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">After Cutting</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Roots & Soil</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                              <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">Short Video</p>
                            </div>
                          </div>
                        </div>

                        {/* Plant Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Species
                            </label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Monstera Albo, Philodendron Pink Princess"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Size
                            </label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., 6 inches, 15cm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Age
                            </label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., 1 year, 6 months"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plant Health
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                              <option>Excellent - Perfect condition</option>
                              <option>Good - Minor imperfections</option>
                              <option>Fair - Some issues</option>
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Details
                          </label>
                          <textarea 
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Tell us more about your plant, any special features, or care requirements..."
                          />
                        </div>

                        {/* Submit Button */}
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                          <Upload className="w-5 h-5 mr-2" />
                          Submit for Review
                        </Button>
                      </>
                    ) : (
                      /* Buyer Form */
                      <>
                        {/* Plant Request */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plant Species
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Monstera Albo, Philodendron Pink Princess"
                          />
                        </div>

                        {/* Plant Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Size
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>Small (4-6 inches)</option>
                              <option>Medium (8-12 inches)</option>
                              <option>Large (14+ inches)</option>
                              <option>Any size</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Budget Range
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>฿500 - ฿2,000</option>
                              <option>฿2,000 - ฿8,000</option>
                              <option>฿8,000 - ฿25,000</option>
                              <option>No budget limit</option>
                            </select>
                          </div>
                        </div>

                        {/* Delivery Preferences */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delivery Location
                            </label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Bangkok, Chiang Mai"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Urgency
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>Not urgent - Take your time</option>
                              <option>Within 1-2 weeks</option>
                              <option>Within 3-5 days</option>
                              <option>ASAP - Need it now</option>
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Requirements
                          </label>
                          <textarea 
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Any specific requirements, special features, or notes..."
                          />
                        </div>

                        {/* Submit Button */}
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                          <Search className="w-5 h-5 mr-2" />
                          Submit Request
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info & Process */}
          <div className="space-y-6">
            
            {userRole === 'seller' ? (
              /* Seller Info */
              <>
                {/* Quality Standards */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-800">
                      <Star className="w-5 h-5 mr-2" />
                      Quality Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Rare and in-demand varieties
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        100% healthy condition
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Market-appropriate size
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Seasonal market demand
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Process Steps */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-emerald-50">
                    <CardTitle className="flex items-center text-emerald-800">
                      <ClipboardCheck className="w-5 h-5 mr-2" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-sm">Submit Plant</p>
                          <p className="text-xs text-gray-600">Upload photos and details</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-sm">Expert Review</p>
                          <p className="text-xs text-gray-600">Our experts evaluate</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-sm">Get Offer</p>
                          <p className="text-xs text-gray-600">Receive fair price offer</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="font-medium text-sm">Ship & Get Paid</p>
                          <p className="text-xs text-gray-600">Send plant, get money</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card className="shadow-lg border-orange-200">
                  <CardHeader className="bg-orange-50">
                    <CardTitle className="flex items-center text-orange-800">
                      <Shield className="w-5 h-5 mr-2" />
                      Security Notice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm text-orange-700">
                      <p>We only buy plants that meet our quality standards</p>
                      <p>Photos must match the actual plant received</p>
                      <p>Payment made after quality verification</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Buyer Info */
              <>
                {/* How It Works */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center text-blue-800">
                      <Package className="w-5 h-5 mr-2" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-sm">Submit Request</p>
                          <p className="text-xs text-gray-600">Tell us what you want</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-sm">We Find It</p>
                          <p className="text-xs text-gray-600">Search our network</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-sm">Quality Check</p>
                          <p className="text-xs text-gray-600">Verify plant quality</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="font-medium text-sm">Deliver to You</p>
                          <p className="text-xs text-gray-600">Safe delivery</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center text-green-800">
                      <Star className="w-5 h-5 mr-2" />
                      Why Choose Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Quality guaranteed plants
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Competitive prices
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Safe delivery
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Expert support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Delivery Info */}
                <Card className="shadow-lg">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="flex items-center text-purple-800">
                      <Truck className="w-5 h-5 mr-2" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm text-purple-700">
                      <p>• Free delivery in Bangkok</p>
                      <p>• 2-3 days for other provinces</p>
                      <p>• Special packaging for plants</p>
                      <p>• Tracking number provided</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
} 