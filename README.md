# VietQR Code Generator

A progressive web application (PWA) to instantly generate QR codes for Vietnamese bank transfers. This tool simplifies payment requests by converting bank details, amounts, and messages into scannable QR codes using the VietQR API.

**Live Demo:** [VietQR Code Generator](https://vietqr-generator.netlify.app)

## Features

- 🏦 **Support for Multiple Vietnamese Banks** - Select from a comprehensive list of Vietnamese banks
- 💳 **Flexible QR Generation** - Create QR codes for bank transfers with optional amounts and custom messages
- 💾 **Profile Management** - Save and reuse frequently used bank accounts
- 💬 **Message Templates** - Save custom message templates for quick access with smart placeholders
- 📍 **Location-Based Messages** - Automatically include location information in generated messages
- 📱 **Progressive Web App** - Works offline with service worker support
- 🎨 **Responsive Design** - Beautiful UI that works on desktop, tablet, and mobile devices
- 🚀 **Fast & Lightweight** - Built with React and Vite for optimal performance
- ⚡ **Instant QR Generation** - Get your QR code in milliseconds

## Tech Stack

- **Frontend Framework:** React 19.2
- **Build Tool:** Vite 6.2
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS
- **API:** VietQR API v2
- **PWA:** Service Worker with Manifest

## Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lionc2240/vietqr-generator-ais.git
   cd vietqr-generator-ais
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Usage

### Basic QR Code Generation

1. Select a bank from the dropdown
2. Enter the account number and account holder name
3. (Optional) Enter an amount
4. (Optional) Add a message or description
5. Click "Generate QR Code"
6. Download or share the generated QR code

### Managing Profiles

Save your frequently used bank accounts as profiles for quick access:

1. Fill in bank details
2. Click the **Save Profile** button
3. Enter a profile name
4. Use the saved profile anytime via the Quick Actions dropdown

### Message Templates

Create reusable message templates with smart placeholders:

- `{location}` - Automatically replaced with current location (requires location permission)
- `{date}` - Replaced with current date
- `{time}` - Replaced with current time

**Example:** "Payment for service at {location} on {date}"

## Project Structure

```
├── components/           # React components
│   ├── Header.tsx
│   ├── QRForm.tsx       # Main form component
│   ├── QRDisplay.tsx    # QR code display area
│   ├── QRModal.tsx      # Modal for QR preview
│   ├── QRForm.tsx
│   ├── QuickActionsDropdown.tsx
│   └── Spinner.tsx
├── services/            # API and utility services
│   ├── vietqrService.ts # VietQR API integration
│   ├── profileService.ts # Profile management
│   ├── messageService.ts # Message template management
│   └── locationService.ts # Geolocation service
├── utils/               # Utility functions
│   ├── smartMessageGenerator.ts
│   └── templateProcessor.ts
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component
├── index.tsx            # React entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── manifest.json        # PWA manifest
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment to Netlify

### Option 1: Deploy via Netlify UI

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose your repository
   - Netlify will auto-detect build settings

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 (or higher)

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at a Netlify URL

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Option 3: Deploy via GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - uses: nwtgck/actions-netlify@v2.1
        with:
          publish-dir: './dist'
          production-branch: main
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

Then add your Netlify tokens to GitHub Secrets.

## Environment Variables

Currently, the application uses public API credentials for the VietQR API. For production deployments with higher usage limits, consider:

1. Setting up environment variables for API credentials
2. Creating a backend proxy for API calls
3. Contacting VietQR for production API keys

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## PWA Features

This application is a Progressive Web App and can be:
- Installed on your home screen (Android & iOS)
- Used offline (with cached data)
- Accessed via app-like interface (standalone mode)

**To install:**
1. Open the app in your browser
2. Click the install prompt (or menu → Install app)
3. The app will appear on your home screen

## Performance

- **Lighthouse Score:** Optimized for Core Web Vitals
- **Build Size:** ~50KB gzipped
- **Load Time:** <1s on 3G
- **Offline Support:** Service Worker enabled

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the FAQ section below

## FAQ

**Q: What banks are supported?**
A: All banks in the VietQR system are supported. The list is fetched dynamically from the VietQR API.

**Q: Can I use this without entering an amount?**
A: Yes! Amount is optional. You can generate QR codes for account information only.

**Q: Are my saved profiles stored securely?**
A: Profiles are stored locally in your browser's localStorage. They are not sent to any server and remain private.

**Q: Can I share my QR code?**
A: Yes, you can download the QR code image and share it directly or through any messaging platform.

**Q: Does this app work offline?**
A: QR generation requires the VietQR API. However, saved profiles and templates work offline, and the UI is accessible via the service worker.

## Credits

- VietQR API for QR code generation
- Tailwind CSS for styling
- React 19 for the UI framework
- Vite for fast build tooling

## Roadmap

- [ ] Dark mode support
- [ ] Multiple language support
- [ ] QR code customization (colors, logo)
- [ ] Batch QR generation
- [ ] Export/import profiles
- [ ] Advanced analytics

---

**Made with ❤️ for the Vietnamese developer community**
