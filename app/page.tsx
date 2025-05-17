'use client';
import { useState } from 'react';
import AuthModal from './components/AuthModal';
import UserTypeModal from './components/UserTypeModal';
import ProfileSetupModal from './components/ProfileSetupModal';
import DashboardMock from './components/DashboardMock';
import DashboardActionModal, { type DashboardAction } from './components/DashboardActionModal';
import EditProfileModal from './components/EditProfileModal';
import EditCampaignModal from './components/EditCampaignModal';
interface UserProfile {
  userType: 'brand' | 'community' | null;
  name: string;
  logo: string;
  description: string;
  twitter: string;
  discord: string;
  telegram: string;
}
interface BrandCampaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  tags: string[];
  status: string;
  applicants: number;
  approved: number;
  numCommunities: number;
  startDate: string;
  endDate: string;
  successCriteria: string;
  expectedDeliverables: string;
  applicantsList: Applicant[];
}
interface Applicant {
  id: string;
  name: string;
  socials: {
    twitter: string;
    discord: string;
    telegram: string;
  };
  status: 'Pending' | 'Approved' | 'Declined';
  reason: string;
  declineReason?: string;
}
interface BrandTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  hash: string;
}
interface CommunityCampaign {
  id: string;
  title: string;
  brand: string;
  status: string;
  deliverableDue: string;
  successCriteria: string;
  expectedDeliverables: string;
  declineReason?: string;
}
interface CommunityApplication {
  id: string;
  campaignId: string;
  campaign: string;
  status: string;
  appliedOn: string;
  reason: string;
  declineReason?: string;
}
interface CommunityTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  hash: string;
}
const INITIAL_DISCOVERABLE_CAMPAIGNS = [
  {
    id: 'cmp-3',
    title: 'GameFi Growth Sprint',
    brand: 'PlayVerse',
    status: 'Open',
    deliverableDue: '2025-07-01',
    numCommunities: 5,
    startDate: '2025-06-15',
    endDate: '2025-07-15',
    successCriteria: '2000 new GameFi users, 500+ game sessions.',
    expectedDeliverables: 'Gameplay videos, user stats, event summary.',
    budgetPerCommunity: '$300 - $800',
  },
  {
    id: 'cmp-4',
    title: 'DAO Awareness Drive',
    brand: 'GovDAO',
    status: 'Open',
    deliverableDue: '2025-07-10',
    numCommunities: 8,
    startDate: '2025-06-20',
    endDate: '2025-07-20',
    successCriteria: '1000 DAO signups, 10+ governance proposals.',
    expectedDeliverables: 'Proposal writeups, onboarding guides.',
    budgetPerCommunity: '$500 - $1200',
  },
  {
    id: 'cmp-5',
    title: 'SocialFi Viral Challenge',
    brand: 'SocialX',
    status: 'Open',
    deliverableDue: '2025-07-25',
    numCommunities: 7,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    successCriteria: '5000+ SocialFi signups, 100 viral posts.',
    expectedDeliverables: 'Social media posts, campaign analytics.',
    budgetPerCommunity: '$400 - $1000',
  },
  {
    id: 'cmp-6',
    title: 'Metaverse Meetup',
    brand: 'MetaWorld',
    status: 'Open',
    deliverableDue: '2025-08-10',
    numCommunities: 4,
    startDate: '2025-07-20',
    endDate: '2025-08-10',
    successCriteria: '1000 metaverse event attendees.',
    expectedDeliverables: 'Event summary, attendee list, media coverage.',
    budgetPerCommunity: '$600 - $1500',
  },
  {
    id: 'cmp-7',
    title: 'Layer2 Education Drive',
    brand: 'L2Learn',
    status: 'Open',
    deliverableDue: '2025-08-20',
    numCommunities: 6,
    startDate: '2025-08-01',
    endDate: '2025-08-20',
    successCriteria: '2000 new L2 wallet users, 10+ educational sessions.',
    expectedDeliverables: 'Session recordings, onboarding stats.',
    budgetPerCommunity: '$350 - $900',
  },
];
export default function Home() {
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<'brand' | 'community' | null>(null);
  const [userTypeModalOpen, setUserTypeModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    userType: null,
    name: '',
    logo: '',
    description: '',
    twitter: '',
    discord: '',
    telegram: '',
  });
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);
  const [dashboardAction, setDashboardAction] = useState<DashboardAction | null>(null);
  const [editCampaignOpen, setEditCampaignOpen] = useState<boolean>(false);
  const [campaignToEdit, setCampaignToEdit] = useState<BrandCampaign | null>(null);
  // Dummy applicants for campaigns
  const dummyApplicants: Applicant[] = [
    {
      id: 'app-1',
      name: 'Web3 United',
      socials: {
        twitter: '@web3united',
        discord: 'discord.gg/web3united',
        telegram: '@web3united',
      },
      status: 'Approved',
      reason: 'We have a strong NFT audience and can deliver high engagement.',
    },
    {
      id: 'app-2',
      name: 'DAO Pioneers',
      socials: {
        twitter: '@daopioneers',
        discord: 'discord.gg/daopioneers',
        telegram: '@daopioneers',
      },
      status: 'Pending',
      reason: 'Our DAO is looking to expand into NFTs and can help with onboarding.',
    },
    {
      id: 'app-3',
      name: 'GameFi Guild',
      socials: {
        twitter: '@gamefiguild',
        discord: 'discord.gg/gamefiguild',
        telegram: '@gamefiguild',
      },
      status: 'Declined',
      reason: 'We have a large gaming community.',
      declineReason: 'Not a fit for this campaign at this time.',
    },
    {
      id: 'app-4',
      name: 'DeFi Champs',
      socials: {
        twitter: '@defichamps',
        discord: 'discord.gg/defichamps',
        telegram: '@defichamps',
      },
      status: 'Approved',
      reason: 'We can drive DeFi user signups.',
    },
    {
      id: 'app-5',
      name: 'NFT Ninjas',
      socials: {
        twitter: '@nftninjas',
        discord: 'discord.gg/nftninjas',
        telegram: '@nftninjas',
      },
      status: 'Pending',
      reason: 'We have a passionate NFT collector base.',
    },
    {
      id: 'app-6',
      name: 'Yield Farmers',
      socials: {
        twitter: '@yieldfarmers',
        discord: 'discord.gg/yieldfarmers',
        telegram: '@yieldfarmers',
      },
      status: 'Declined',
      reason: 'We focus on DeFi education.',
      declineReason: 'Looking for NFT-focused communities.',
    },
  ];
  // Demo/mock data for brands and communities (stateful for interactivity)
  const [brandCampaigns, setBrandCampaigns] = useState<BrandCampaign[]>([
    {
      id: 'cmp-1',
      title: 'NFT Summer Launch',
      description: 'Promote our new NFT collection to engaged communities.',
      budget: 1500,
      tags: ['NFT', 'Art'],
      status: 'Active',
      applicants: 6,
      approved: 2,
      numCommunities: 10,
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      successCriteria: 'Onboard 500 new users, 1000+ NFT mints.',
      expectedDeliverables: 'Social posts, campaign report, mint analytics.',
      applicantsList: dummyApplicants,
    },
    {
      id: 'cmp-2',
      title: 'DeFi Onboarding Blitz',
      description: 'Drive new user signups for our DeFi platform.',
      budget: 2000,
      tags: ['DeFi', 'Onboarding'],
      status: 'Completed',
      applicants: 6,
      approved: 3,
      numCommunities: 8,
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      successCriteria: '1000 new DeFi wallets, 500+ protocol interactions.',
      expectedDeliverables: 'Tutorials, AMAs, onboarding stats.',
      applicantsList: [
        {
          id: 'app-7',
          name: 'DeFi Champs',
          socials: {
            twitter: '@defichamps',
            discord: 'discord.gg/defichamps',
            telegram: '@defichamps',
          },
          status: 'Approved',
          reason: 'We can drive DeFi user signups.',
        },
        {
          id: 'app-8',
          name: 'Yield Farmers',
          socials: {
            twitter: '@yieldfarmers',
            discord: 'discord.gg/yieldfarmers',
            telegram: '@yieldfarmers',
          },
          status: 'Approved',
          reason: 'We focus on DeFi education.',
        },
        {
          id: 'app-9',
          name: 'DAO Pioneers',
          socials: {
            twitter: '@daopioneers',
            discord: 'discord.gg/daopioneers',
            telegram: '@daopioneers',
          },
          status: 'Pending',
          reason: 'Our DAO is looking to expand into DeFi.',
        },
        {
          id: 'app-10',
          name: 'NFT Ninjas',
          socials: {
            twitter: '@nftninjas',
            discord: 'discord.gg/nftninjas',
            telegram: '@nftninjas',
          },
          status: 'Declined',
          reason: 'We have a passionate NFT collector base.',
          declineReason: 'Looking for DeFi-focused communities.',
        },
        {
          id: 'app-11',
          name: 'Web3 United',
          socials: {
            twitter: '@web3united',
            discord: 'discord.gg/web3united',
            telegram: '@web3united',
          },
          status: 'Pending',
          reason: 'We have a strong DeFi audience.',
        },
        {
          id: 'app-12',
          name: 'GameFi Guild',
          socials: {
            twitter: '@gamefiguild',
            discord: 'discord.gg/gamefiguild',
            telegram: '@gamefiguild',
          },
          status: 'Declined',
          reason: 'We have a large gaming community.',
          declineReason: 'Not a fit for this campaign at this time.',
        },
      ],
    },
  ]);
  const [brandTransactions, setBrandTransactions] = useState<BrandTransaction[]>([
    {
      id: 'tx-1',
      type: 'deposit',
      amount: 2500,
      status: 'completed',
      date: '2025-05-13',
      hash: '0xabc123...',
    },
    {
      id: 'tx-2',
      type: 'payment',
      amount: 500,
      status: 'completed',
      date: '2025-05-15',
      hash: '0xdef456...',
    },
  ]);
  const [brandBalance, setBrandBalance] = useState<number>(2000);
  // Community state
  const [communityCampaigns, setCommunityCampaigns] = useState<CommunityCampaign[]>([
    {
      id: 'cmp-1',
      title: 'NFT Summer Launch',
      brand: 'BlueChip Studios',
      status: 'Active',
      deliverableDue: '2025-06-20',
      successCriteria: 'Onboard 500 new users, 1000+ NFT mints.',
      expectedDeliverables: 'Social posts, campaign report, mint analytics.',
    },
    {
      id: 'cmp-2',
      title: 'DeFi Onboarding Blitz',
      brand: 'Yieldly',
      status: 'Declined',
      deliverableDue: '2025-05-15',
      successCriteria: '1000 new DeFi wallets, 500+ protocol interactions.',
      expectedDeliverables: 'Tutorials, AMAs, onboarding stats.',
      declineReason: 'Looking for DeFi-focused communities.',
    },
  ]);
  const [communityApplications, setCommunityApplications] = useState<CommunityApplication[]>([
    {
      id: 'app-1',
      campaignId: 'cmp-1',
      campaign: 'NFT Summer Launch',
      status: 'Approved',
      appliedOn: '2025-05-14',
      reason: 'We have a strong NFT audience and can deliver high engagement.',
    },
    {
      id: 'app-2',
      campaignId: 'cmp-2',
      campaign: 'DeFi Onboarding Blitz',
      status: 'Declined',
      appliedOn: '2025-05-01',
      reason: 'We have a passionate NFT collector base.',
      declineReason: 'Looking for DeFi-focused communities.',
    },
  ]);
  const [communityTransactions, setCommunityTransactions] = useState<CommunityTransaction[]>([
    {
      id: 'tx-1',
      type: 'withdrawal',
      amount: 200,
      status: 'completed',
      date: '2025-05-15', // Changed from 05-13 to 05-15
      hash: '0xaaa111...',
    },
    {
      id: 'tx-2',
      type: 'payment',
      amount: 500,
      status: 'completed',
      date: '2025-05-13', // Changed from 05-15 to 05-13
      hash: '0xbbb222...',
    },
  ]);
  const [communityBalance, setCommunityBalance] = useState<number>(300);
  // Community: Discoverable campaigns (now in state)
  const [discoverableCampaigns, setDiscoverableCampaigns] = useState(INITIAL_DISCOVERABLE_CAMPAIGNS);
  // Simulate Privy login
  const handleAuthSuccess = (): void => {
    setIsAuthenticated(true);
    setAuthOpen(false);
    setUserTypeModalOpen(true);
  };
  const handleUserTypeSelect = (type: 'brand' | 'community'): void => {
    setUserType(type);
    setProfile((prev) => ({ ...prev, userType: type }));
    setUserTypeModalOpen(false);
    setProfileModalOpen(true);
  };
  const handleProfileComplete = (profileData: Omit<UserProfile, 'userType'>): void => {
    setProfile((prev) => ({ ...prev, ...profileData }));
    setProfileModalOpen(false);
    setDashboardOpen(true);
  };
  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setUserType(null);
    setProfile({
      userType: null,
      name: '',
      logo: '',
      description: '',
      twitter: '',
      discord: '',
      telegram: '',
    });
    setDashboardOpen(false);
    setDashboardAction(null);
  };
  // Dashboard action handler
  const handleDashboardAction = (action: DashboardAction): void => {
    setDashboardAction(action);
  };
  const handleCloseActionModal = (): void => {
    setDashboardAction(null);
  };
  // Brand: Create Campaign
  const handleCreateCampaign = (
    title: string,
    description: string,
    budget: number,
    tags: string[],
    numCommunities: number,
    startDate: string,
    endDate: string,
    successCriteria: string,
    expectedDeliverables: string
  ): void => {
    const newId = `cmp-${brandCampaigns.length + 1}`;
    const newCampaign: BrandCampaign = {
      id: newId,
      title,
      description,
      budget,
      tags,
      status: 'Active',
      applicants: 0,
      approved: 0,
      numCommunities,
      startDate,
      endDate,
      successCriteria,
      expectedDeliverables,
      applicantsList: [],
    };
    setBrandCampaigns([newCampaign, ...brandCampaigns]);
    setDashboardAction('manage-campaigns');
  };
  // Brand: Deposit Funds
  const handleDeposit = (amount: number): void => {
    const newTx: BrandTransaction = {
      id: `tx-${brandTransactions.length + 1}`,
      type: 'deposit',
      amount,
      status: 'completed',
      date: '2025-05-13',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setBrandTransactions([newTx, ...brandTransactions]);
    setBrandBalance(brandBalance + amount);
    setDashboardAction('transactions');
  };
  // Brand: Withdraw Funds
  const handleBrandWithdraw = (amount: number): void => {
    const newTx: BrandTransaction = {
      id: `tx-${brandTransactions.length + 1}`,
      type: 'withdrawal',
      amount,
      status: 'completed',
      date: '2025-05-13',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setBrandTransactions([newTx, ...brandTransactions]);
    setBrandBalance(brandBalance - amount);
    setDashboardAction('transactions');
  };
  // Community: Withdraw Funds
  const handleWithdraw = (amount: number): void => {
    const newTx: CommunityTransaction = {
      id: `tx-${communityTransactions.length + 1}`,
      type: 'withdrawal',
      amount,
      status: 'completed',
      date: '2025-05-15', // Updated to match the date pattern
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setCommunityTransactions([newTx, ...communityTransactions]);
    setCommunityBalance(communityBalance - amount);
    setDashboardAction('transactions');
  };
  // Community: Accept Campaign (apply)
  const handleAcceptCampaign = (campaignId: string, reason: string): void => {
    // Find campaign in discoverable
    const campaign = discoverableCampaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    // Remove from discoverable
    setDiscoverableCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    // Add to applications as Pending
    setCommunityApplications([
      {
        id: `app-${communityApplications.length + 1}`,
        campaignId: campaign.id,
        campaign: campaign.title,
        status: 'Pending',
        appliedOn: '2025-05-13',
        reason,
      },
      ...communityApplications,
    ]);
    // Add to My Campaigns as Pending
    setCommunityCampaigns([
      {
        id: campaign.id,
        title: campaign.title,
        brand: campaign.brand,
        status: 'Pending',
        deliverableDue: campaign.deliverableDue,
        successCriteria: campaign.successCriteria,
        expectedDeliverables: campaign.expectedDeliverables,
      },
      ...communityCampaigns,
    ]);
    setDashboardAction('my-campaigns');
  };
  // Community: Only show discoverable campaigns not already applied to
  const appliedCampaignIds = new Set(communityApplications.map((a) => a.campaignId));
  // Brand/Community demo objects for modal props
  const brandDemo = {
    campaigns: brandCampaigns,
    transactions: brandTransactions,
    balance: brandBalance,
    onEditCampaign: (campaign: BrandCampaign) => {
      setCampaignToEdit(campaign);
      setEditCampaignOpen(true);
    },
    onWithdraw: handleBrandWithdraw,
  };
  const communityDemo = {
    campaigns: communityCampaigns,
    applications: communityApplications,
    transactions: communityTransactions,
    balance: communityBalance,
    discoverable: discoverableCampaigns.filter((c) => !appliedCampaignIds.has(c.id)),
  };
  // Edit Profile
  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };
  const handleEditProfileSave = (updated: Omit<UserProfile, 'userType'>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    setEditProfileOpen(false);
  };
  // Edit Campaign
  const handleEditCampaignSave = (updated: BrandCampaign) => {
    setBrandCampaigns((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? { ...c, ...updated, applicantsList: updated.applicantsList ?? [] }
          : c
      )
    );
    setEditCampaignOpen(false);
    setCampaignToEdit(null);
    setDashboardAction('manage-campaigns');
  };
  return (
    <main className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center px-4">
      {/* Landing Section */}
      {!isAuthenticated && !dashboardOpen && (
        <section className="w-full max-w-2xl flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="rounded-full bg-[#0052ff] w-20 h-20 flex items-center justify-center mb-4">
              <span className="text-3xl font-extrabold text-white select-none">D3</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              Deal3
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-xl">
              {'Connecting web3 communities and brands for direct, transparent campaign collaborations.'}
            </p>
          </div>
          <button
            className="bg-[#0052ff] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition mb-2"
            onClick={() => setAuthOpen(true)}
            aria-label="Sign up or log in with Privy"
          >
            Sign up / Log in
          </button>
          <p className="text-gray-400 text-sm mt-2">
            {'Powered by Privy • Built for Base Network'}
          </p>
        </section>
      )}
      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
      {/* User Type Selection Modal */}
      {userTypeModalOpen && (
        <UserTypeModal
          onSelect={handleUserTypeSelect}
          onClose={() => setUserTypeModalOpen(false)}
        />
      )}
      {/* Profile Setup Modal */}
      {profileModalOpen && userType && (
        <ProfileSetupModal
          userType={userType}
          onComplete={handleProfileComplete}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
      {/* Dashboard Mock */}
      {dashboardOpen && userType && (
        <DashboardMock
          userType={userType}
          profile={{
            userType: profile.userType,
            name: profile.name,
            logo: profile.logo,
            description: profile.description,
            socials: [
              profile.twitter && `Twitter/X: ${profile.twitter}`,
              profile.discord && `Discord: ${profile.discord}`,
              profile.telegram && `Telegram: ${profile.telegram}`,
            ]
              .filter(Boolean)
              .join(' | '),
          }}
          onLogout={handleLogout}
          onAction={handleDashboardAction}
          onEditProfile={handleEditProfile}
        />
      )}
      {/* Dashboard Action Modal */}
      {dashboardAction && userType && (
        <DashboardActionModal
          userType={userType}
          action={dashboardAction}
          onClose={handleCloseActionModal}
          brandDemo={brandDemo}
          communityDemo={communityDemo}
          onCreateCampaign={handleCreateCampaign}
          onDeposit={handleDeposit}
          onWithdraw={userType === 'brand' ? handleBrandWithdraw : handleWithdraw}
          onAcceptCampaign={handleAcceptCampaign}
        />
      )}
      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <EditProfileModal
          userType={userType}
          profile={profile}
          onSave={handleEditProfileSave}
          onClose={() => setEditProfileOpen(false)}
        />
      )}
      {/* Edit Campaign Modal */}
      {editCampaignOpen && campaignToEdit && (
        <EditCampaignModal
          campaign={campaignToEdit}
          onSave={handleEditCampaignSave}
          onClose={() => {
            setEditCampaignOpen(false);
            setCampaignToEdit(null);
          }}
        />
      )}
    </main>
  );
}