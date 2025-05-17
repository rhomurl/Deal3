# Deal3 - Web3 Community Campaign Platform

Deal3 is a modern web3 platform that connects brands with communities for direct, transparent campaign collaborations. Built on Base Network and powered by Privy authentication.

## Features

### For Brands
- Create and manage marketing campaigns
- Set campaign budgets and success criteria
- Review and manage community applications
- Track campaign performance
- Deposit and withdraw funds
- View transaction history

### For Communities
- Discover and apply to brand campaigns
- Track campaign applications and status
- View campaign deliverables and success criteria
- Manage earnings and withdrawals
- View transaction history

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Authentication**: Privy
- **Network**: Base Network
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Base Network wallet
- Privy account for authentication

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deal3.git
cd deal3
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Privy API keys:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
deal3/
├── components/
│   ├── AuthModal.tsx
│   ├── DashboardActionModal.tsx
│   ├── DashboardMock.tsx
│   ├── EditCampaignModal.tsx
│   ├── EditProfileModal.tsx
│   ├── ManageCampaignsModal.tsx
│   ├── MyCampaignsModal.tsx
│   ├── ProfileSetupModal.tsx
│   └── UserTypeModal.tsx
├── app/
│   └── page.tsx
├── public/
├── styles/
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Privy](https://privy.io/) for authentication
- [Base Network](https://base.org/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/deal3](https://github.com/yourusername/deal3) 