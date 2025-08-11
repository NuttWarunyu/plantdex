# Pricing Page Temporarily Hidden

## Overview
The pricing page has been temporarily hidden from the PlantDex application as requested. This change was made to prevent users from accessing payment-related features while the application is still in development.

## Changes Made

### 1. Navigation
- Removed pricing link from the main header navigation
- Removed pricing link from the footer quick links
- Added comments indicating the feature will be available in future updates

### 2. Home Page
- Hidden the pricing feature card from the features section
- Adjusted grid layout from 4 columns to 3 columns for better visual balance

### 3. Pricing Page
- Replaced the entire pricing page content with a redirect to the home page
- Added a temporary message indicating the page is unavailable

## Files Modified
- `src/components/layout/Header.tsx` - Hidden pricing navigation link
- `src/components/layout/Footer.tsx` - Hidden pricing footer link  
- `src/app/page.tsx` - Hidden pricing feature card and adjusted grid layout
- `src/app/pricing/page.tsx` - Added redirect to home page

## Future Implementation
When ready to re-enable the pricing page:

1. Uncomment the pricing navigation links in Header and Footer
2. Restore the pricing feature card in the home page
3. Restore the original pricing page content
4. Adjust grid layouts back to 4 columns if needed

## Notes
- All pricing-related translations remain in the language context for future use
- The pricing route still exists but redirects to home page
- Users attempting to access `/pricing` directly will be automatically redirected 