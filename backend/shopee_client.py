#!/usr/bin/env python3
"""
Shopee API Client for PlantDex
Simple client to collect plant data from Shopee
"""

import requests
import hashlib
import time
import json
import os
from dotenv import load_dotenv
from typing import Dict, List, Optional

# Load environment variables
load_dotenv('../env.production')

class ShopeeClient:
    """Simple Shopee API client for plant data collection"""
    
    def __init__(self):
        self.app_id = os.getenv('SHOPEE_APP_ID', '15394330041')
        self.secret_key = os.getenv('SHOPEE_SECRET_KEY', 'IWGHVNOTGSQ44M7LB6ZEALICHFG6G5GP')
        self.base_url = "https://partner.shopeemobile.com"
        self.access_token = None
        
        print(f"🔑 Shopee Client initialized with App ID: {self.app_id}")
    
    def _generate_signature(self, path: str, timestamp: int, access_token: str = "") -> str:
        """Generate signature for Shopee API requests"""
        base_string = f"{self.app_id}{path}{timestamp}{access_token}{self.secret_key}"
        return hashlib.sha256(base_string.encode()).hexdigest()
    
    def _make_request(self, endpoint: str, params: Dict = None, method: str = "GET") -> Optional[Dict]:
        """Make authenticated request to Shopee API"""
        try:
            timestamp = int(time.time())
            path = f"/api/v2/{endpoint}"
            
            # Generate signature
            signature = self._generate_signature(path, timestamp, self.access_token or "")
            
            # Prepare headers
            headers = {
                "Authorization": f"SHA256 {signature}",
                "Content-Type": "application/json"
            }
            
            # Prepare parameters
            if params is None:
                params = {}
            
            params.update({
                "app_id": self.app_id,
                "timestamp": timestamp,
                "access_token": self.access_token or ""
            })
            
            # Make request
            if method.upper() == "GET":
                response = requests.get(f"{self.base_url}{path}", params=params, headers=headers)
            else:
                response = requests.post(f"{self.base_url}{path}", json=params, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ API Error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Request error: {e}")
            return None
    
    def search_plants(self, keyword: str = "ต้นไม้มีชีวิต", limit: int = 50) -> Optional[List[Dict]]:
        """Search for plant products on Shopee"""
        print(f"🔍 Searching for plants with keyword: '{keyword}'")
        
        params = {
            "keyword": keyword,
            "limit": limit,
            "offset": 0,
            "category_id": "11075404",  # Live Plants category
            "sort_by": "pop"  # Sort by popularity
        }
        
        result = self._make_request("item/search", params)
        
        if result and result.get("error") is None:
            items = result.get("response", {}).get("items", [])
            print(f"✅ Found {len(items)} plant products")
            return items
        else:
            print(f"❌ Search failed: {result}")
            return None
    
    def get_product_details(self, item_id: int) -> Optional[Dict]:
        """Get detailed information about a specific product"""
        print(f"📋 Getting details for product ID: {item_id}")
        
        params = {
            "item_id": item_id
        }
        
        result = self._make_request("item/get", params)
        
        if result and result.get("error") is None:
            item = result.get("response", {}).get("item", {})
            print(f"✅ Retrieved product: {item.get('name', 'Unknown')}")
            return item
        else:
            print(f"❌ Failed to get product details: {result}")
            return None
    
    def get_shop_info(self, shop_id: int) -> Optional[Dict]:
        """Get shop information"""
        print(f"🏪 Getting shop info for shop ID: {shop_id}")
        
        params = {
            "shop_id": shop_id
        }
        
        result = self._make_request("shop/get", params)
        
        if result and result.get("error") is None:
            shop = result.get("response", {}).get("shop", {})
            print(f"✅ Retrieved shop: {shop.get('shop_name', 'Unknown')}")
            return shop
        else:
            print(f"❌ Failed to get shop info: {result}")
            return None
    
    def test_connection(self) -> bool:
        """Test API connection with a simple search"""
        print("🧪 Testing Shopee API connection...")
        
        try:
            # Try to search for plants
            plants = self.search_plants("ต้นไม้", limit=5)
            
            if plants:
                print("✅ API connection successful!")
                print(f"📊 Sample data: {len(plants)} products found")
                
                # Show first product as sample
                if plants:
                    first_product = plants[0]
                    print(f"🌱 Sample product: {first_product.get('name', 'Unknown')}")
                    print(f"💰 Price: ฿{first_product.get('price', 'N/A')}")
                    print(f"🏪 Shop: {first_product.get('shop_name', 'Unknown')}")
                
                return True
            else:
                print("❌ API connection failed - no data returned")
                return False
                
        except Exception as e:
            print(f"❌ Connection test failed: {e}")
            return False

def main():
    """Test the Shopee client"""
    print("🚀 Testing Shopee API Client...")
    
    client = ShopeeClient()
    
    # Test connection
    if client.test_connection():
        print("\n🎉 Shopee API client is working!")
        print("📋 Ready to collect plant data")
    else:
        print("\n❌ Shopee API client test failed")
        print("🔧 Check your API credentials and network connection")

if __name__ == "__main__":
    main() 