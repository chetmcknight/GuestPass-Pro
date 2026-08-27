# GuestPass Pro 🚀

An elegant WiFi QR Code generator that creates high-quality, print-ready guest cards with AI-powered welcome messages.

## ✨ Features

- **Instant Connectivity**: Generates standard `WIFI:S:...` URI schemes compatible with iOS and Android.
- **AI-Enhanced Hospitality**: Uses Google Gemini 3 Flash to craft unique, warm welcome messages for your guests.
- **Privacy-First**: Options to hide SSID or Password on the physical card for added security.
- **Premium Aesthetics**: High-end UI featuring mesh gradients, glassmorphism, and smooth transitions.
- **Print Optimized**: Automatically formats cards to a standard 5x7 portrait aspect ratio for professional printing.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Intelligence**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Engine**: [QRCode.js](https://github.com/soldair/node-qrcode)

## 🚀 Getting Started

### Environment Variables

The app requires a Google Gemini API key to generate welcome messages.

```env
API_KEY=your_gemini_api_key_here
```

### Installation

1. Clone the repository.
2. Serve the `index.html` file using a local web server (ES modules required).

## 📄 License

MIT License - feel free to use and modify for your personal or commercial projects.
