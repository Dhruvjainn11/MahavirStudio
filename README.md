# Mahavir Studio - Modern E-commerce Platform

A sophisticated e-commerce website for paints and hardware built with Next.js 15, featuring a modern design, interactive 3D paint studio, and comprehensive user management.

## ✨ Features

### 🏠 Core E-commerce Features
- **Product Catalog**: Browse paints, hardware, and curated bundles
- **Shopping Cart**: Add/remove items with quantity management
- **Wishlist**: Save favorite products for later
- **Search & Filters**: Find products by category, price, and specifications
- **Recently Viewed**: Track and display recently browsed products

### 👤 User Management
- **Authentication**: Mock login/signup system with persistent sessions
- **Profile Management**: Edit personal information and preferences
- **Address Book**: Save and manage multiple delivery addresses
- **Order History**: View past orders with detailed status tracking
- **Preferences**: Customize notification settings

### 🛒 Enhanced Checkout
- **Multi-step Process**: Guided checkout with progress indicators
- **Address Selection**: Choose from saved addresses or add new ones
- **Payment Options**: Multiple payment methods (Card, UPI, Net Banking)
- **Order Confirmation**: Beautiful success page with order timeline

### 🎨 Paint Studio (3D Interactive)
- **3D Room Visualization**: Interior and exterior house models
- **Color Application**: Apply paint colors to walls in real-time
- **Lighting Modes**: Day/night lighting simulation
- **Paint Finishes**: Matte, silk, satin, and glossy options
- **Color Combinations**: AI-suggested color palettes
- **Room Presets**: Pre-configured themes (modern, warm, luxury)
- **Wall Selection**: Individual wall painting for interior mode

### 🎯 Design & UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Framer Motion**: Smooth animations and page transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Elegant loading animations and spinners
- **Consistent Theming**: Earthy color palette with gold accents

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4.1 with custom color palette
- **Animations**: Framer Motion 12
- **3D Graphics**: Three.js with React Three Fiber
- **Icons**: React Icons (Feather Icons)
- **State Management**: React Context API
- **Storage**: Local Storage for persistence
- **Carousel**: Keen Slider

## 📁 Project Structure

```
src/app/
├── components/           # Reusable UI components
│   ├── AuthModal.jsx    # Login/Signup modal
│   ├── Navbar.jsx       # Navigation with user menu
│   ├── Toast.jsx        # Notification system
│   ├── RecentlyViewed.jsx # Recently viewed products
│   └── PageTransition.jsx # Animation components
├── context/             # React Context providers
│   ├── authContext.js   # User authentication state
│   └── cartContext.js   # Shopping cart state
├── lib/                 # Data and utilities
│   └── product.js       # Product catalog data
├── profile/             # User profile management
│   └── page.jsx         # Profile dashboard
├── checkout/            # Checkout process
│   └── page.jsx         # Multi-step checkout
├── paint-studio/        # 3D Paint Studio
│   ├── page.jsx         # Studio page wrapper
│   └── PaintStudioClient.jsx # Main studio component
├── order-confirmation/  # Order success page
│   └── page.jsx         # Confirmation with timeline
└── globals.css          # Global styles and utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mahavirstudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Demo Credentials

For testing the authentication system:
- **Email**: john.doe@example.com
- **Password**: password123

## 🎨 Color Palette

The design uses an earthy, warm color scheme:
- **Primary**: Gold (#c4a86f) for CTAs and highlights
- **Secondary**: Charcoal (#4a4a4a) for text and UI elements
- **Background**: Beige tones (#faf8f5, #f4f0e9) for warmth
- **Accent**: WhatsApp green (#25D366) for contact

## 🔧 Key Components

### Authentication System
- Mock user database with persistent login
- Profile management with address book
- Order history tracking
- Preference management

### Shopping Experience
- Product catalog with filtering
- Shopping cart with quantity controls
- Wishlist functionality
- Recently viewed tracking

### Paint Studio
- 3D room visualization using Three.js
- Real-time color application
- Multiple lighting conditions
- Paint finish simulation
- Color palette generation

### Checkout Process
- Multi-step form with validation
- Address selection/creation
- Payment method selection
- Order confirmation with timeline

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Optimized images and loading

## 🚧 Future Enhancements

- **Backend Integration**: Replace mock data with real API
- **Payment Gateway**: Integrate with actual payment processors
- **Image Upload**: Allow users to upload room photos
- **AR Visualization**: Augmented reality paint preview
- **Social Features**: Share paint combinations
- **Advanced Analytics**: User behavior tracking
- **Multi-language**: Localization support
- **PWA Features**: Offline functionality

## 📄 License

This project is for educational and portfolio purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or feedback about this project, please reach out through the contact information provided in the application.
