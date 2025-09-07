# CampusConnect - Base Mini App

**Discover Your Tribe. Ace Your Studies.**

CampusConnect is a niche community hub for students to discover peers with shared academic and extracurricular interests, organize study groups, and share resources on Base.

## Features

### 🎯 Core Features
- **Niche Group Discovery**: Find and join groups based on major, courses, professors, or specific interests
- **Study Group Organizer**: Create and manage study sessions with scheduling and location tools
- **Resource Repository**: IPFS-based repository for sharing academic materials, notes, and study guides
- **Project & Skill Matching**: Connect with students for collaborative projects and hackathons

### 💰 Business Model
- Freemium with micro-transactions
- $0.50 for featured study group posts
- $1.00 for advanced resource search filters
- $0.25 for resource upload "bumps"

### 🛠 Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Blockchain**: Base (Coinbase L2), OnchainKit, MiniKit
- **Authentication**: Farcaster ID integration
- **Storage**: IPFS via Pinata for decentralized resource storage
- **Backend**: Supabase for off-chain data
- **Payments**: USDC micro-transactions on Base

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campusconnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
campusconnect/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   ├── globals.css        # Global styles and design system
│   ├── loading.tsx        # Loading UI
│   └── error.tsx          # Error boundary
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Card, Button, etc.)
│   ├── GroupCard.tsx     # Group display component
│   ├── StudySessionCard.tsx # Study session component
│   ├── ResourceCard.tsx  # Resource display component
│   ├── ProjectCard.tsx   # Project collaboration component
│   ├── SearchBar.tsx     # Search functionality
│   └── Navigation.tsx    # App navigation
├── lib/                  # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── constants.ts      # App constants
└── public/               # Static assets
```

## Design System

### Colors
- **Primary**: `hsl(220 80% 50%)` - Blue
- **Accent**: `hsl(160 80% 50%)` - Teal
- **Background**: Gradient from blue to purple
- **Surface**: Glass morphism with backdrop blur
- **Text**: White with opacity variations

### Typography
- **Display**: `text-2xl font-bold`
- **Heading**: `text-xl font-semibold`
- **Body**: `text-base font-normal leading-6`
- **Caption**: `text-sm font-normal leading-5`

### Components
- **Cards**: Glass morphism with subtle shadows
- **Buttons**: Gradient primary, glass secondary
- **Inputs**: Glass with backdrop blur
- **Navigation**: Responsive with mobile-first design

## Data Model

### Core Entities

**User**
- userId (Farcaster FID or Wallet Address)
- displayName, major, interests, bio
- connections to other users

**Group**
- groupId, name, description
- members, interests, privacy level
- study sessions and resources

**Resource**
- resourceId, fileName, IPFS hash
- tags (course, professor, topic)
- upload metadata and download stats

**StudySession**
- sessionId, title, description
- dateTime, location, attendees
- group association and status

**Project**
- projectId, title, description
- required skills, collaborators
- category and deadline

## API Integration

### Planned Integrations
- **Farcaster (Neynar)**: User authentication and social features
- **Privy**: Wallet connection and onchain payments
- **Turnkey**: Smart wallet infrastructure for USDC payments
- **Supabase**: Backend-as-a-Service for app data
- **Pinata**: IPFS storage for academic resources
- **OpenAI/Anthropic**: AI-powered search and recommendations

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@campusconnect.app or join our community discussions.

---

Built with ❤️ for students, by students, on Base.
