AdView Website - Setup Instructions

1. FILE STRUCTURE:
   - index.html (Main website)
   - style.css (Styling)
   - script.js (Functionality)
   - admin.php (Admin panel)
   - ads.json (Ad storage)
   - README.txt (This file)

2. SETUP:
   - Upload all files to your web hosting
   - Make sure PHP is enabled on your server
   - Ensure ads.json is writable (chmod 666 on Linux)

3. USAGE:
   - Users register/login to view ads
   - Each ad view earns ₹0.10
   - Users must watch ads for specified duration
   - Admin can manage ads through admin.php

4. FEATURES:
   - User registration/login
   - Ad viewing with timer
   - Earnings tracking
   - Admin ad management
   - Local storage for data persistence

5. SECURITY NOTES:
   - This is a basic implementation
   - For production, add:
     * Server-side validation
     * Database instead of localStorage
     * User authentication
     * Payment integration
     * SSL certificate

6. MONETIZATION:
   - You need real advertisers
   - Integrate with ad networks
   - Set up payment processing
   - Implement withdrawal system