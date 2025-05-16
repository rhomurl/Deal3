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
  socials: string;
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
}
interface BrandTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  hash: string;
}
interface CommunityCampaign {
  id: string;
  title: string;
  brand: string;
  status: string;
  deliverableDue: string;
}
interface CommunityApplication {
  id: string;
  campaign: string;
  status: string;
  appliedOn: string;
}
interface CommunityTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  hash: string;
}
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
    socials: '',
  });
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);
  const [dashboardAction, setDashboardAction] = useState<DashboardAction | null>(null);
  // Edit Campaign modal state
  const [editCampaignOpen, setEditCampaignOpen] = useState<boolean>(false);
  const [campaignToEdit, setCampaignToEdit] = useState<BrandCampaign | null>(null);
  // Demo/mock data for brands and communities (stateful for interactivity)
  const [brandCampaigns, setBrandCampaigns] = useState<BrandCampaign[]>([
    {
      id: 'cmp-1',
      title: 'NFT Summer Launch',
      description: 'Promote our new NFT collection to engaged communities.',
      budget: 1500,
      tags: ['NFT', 'Art'],
      status: 'Active',
      applicants: 8,
      approved: 3,
    },
    {
      id: 'cmp-2',
      title: 'DeFi Onboarding Blitz',
      description: 'Drive new user signups for our DeFi platform.',
      budget: 2000,
      tags: ['DeFi', 'Onboarding'],
      status: 'Completed',
      applicants: 12,
      approved: 5,
    },
  ]);
  const [brandTransactions, setBrandTransactions] = useState<BrandTransaction[]>([
    {
      id: 'tx-1',
      type: 'deposit',
      amount: 2500,
      status: 'Completed',
      date: '2025-05-13',
      hash: '0xabc123...',
    },
    {
      id: 'tx-2',
      type: 'payment',
      amount: 500,
      status: 'Completed',
      date: '2025-05-15',
      hash: '0xdef456...',
    },
  ]);
  const [brandBalance, setBrandBalance] = useState<number>(2000);
  const [communityCampaigns, setCommunityCampaigns] = useState<CommunityCampaign[]>([
    {
      id: 'cmp-1',
      title: 'NFT Summer Launch',
      brand: 'BlueChip Studios',
      status: 'Active',
      deliverableDue: '2025-06-20',
    },
    {
      id: 'cmp-2',
      title: 'DeFi Onboarding Blitz',
      brand: 'Yieldly',
      status: 'Completed',
      deliverableDue: '2025-05-15',
    },
  ]);
  const [communityApplications, setCommunityApplications] = useState<CommunityApplication[]>([
    {
      id: 'app-1',
      campaign: 'NFT Summer Launch',
      status: 'Approved',
      appliedOn: '2025-05-14',
    },
    {
      id: 'app-2',
      campaign: 'DeFi Onboarding Blitz',
      status: 'Completed',
      appliedOn: '2025-05-01',
    },
  ]);
  const [communityTransactions, setCommunityTransactions] = useState<CommunityTransaction[]>([
    {
      id: 'tx-1',
      type: 'withdrawal',
      amount: 300,
      status: 'Completed',
      date: '2025-05-13',
      hash: '0xaaa111...',
    },
    {
      id: 'tx-2',
      type: 'payment',
      amount: 200,
      status: 'Completed',
      date: '2025-05-15',
      hash: '0xbbb222...',
    },
  ]);
  const [communityBalance, setCommunityBalance] = useState<number>(500);
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
      socials: '',
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
  const handleCreateCampaign = (title: string, description: string, budget: number, tags: string[]): void => {
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
      status: 'Completed',
      date: '2025-05-13',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setBrandTransactions([newTx, ...brandTransactions]);
    setBrandBalance(brandBalance + amount);
    setDashboardAction('transactions');
  };
  // Community: Withdraw Funds
  const handleWithdraw = (amount: number): void => {
    const newTx: CommunityTransaction = {
      id: `tx-${communityTransactions.length + 1}`,
      type: 'withdrawal',
      amount,
      status: 'Completed',
      date: '2025-05-13',
      hash: `0x${Math.random().toString(16).slice(2, 10)}...`,
    };
    setCommunityTransactions([newTx, ...communityTransactions]);
    setCommunityBalance(communityBalance - amount);
    setDashboardAction('transactions');
  };
  // Community: Accept Campaign
  const handleAcceptCampaign = (campaignId: string): void => {
    const campaign = discoverableCampaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    setCommunityCampaigns([
      {
        id: campaign.id,
        title: campaign.title,
        brand: campaign.brand,
        status: 'Active',
        deliverableDue: campaign.deliverableDue,
      },
      ...communityCampaigns,
    ]);
    setCommunityApplications([
      {
        id: `app-${communityApplications.length + 1}`,
        campaign: campaign.title,
        status: 'Approved',
        appliedOn: '2025-05-13',
      },
      ...communityApplications,
    ]);
    setDashboardAction('my-campaigns');
  };
  // Demo discoverable campaigns for community (not yet accepted)
  const discoverableCampaigns: CommunityCampaign[] = [
    {
      id: 'cmp-3',
      title: 'GameFi Growth Sprint',
      brand: 'PlayVerse',
      status: 'Open',
      deliverableDue: '2025-07-01',
    },
    {
      id: 'cmp-4',
      title: 'DAO Awareness Drive',
      brand: 'GovDAO',
      status: 'Open',
      deliverableDue: '2025-07-10',
    },
  ];
  // Brand/Community demo objects for modal props
  const brandDemo = {
    campaigns: brandCampaigns,
    transactions: brandTransactions,
    balance: brandBalance,
    onEditCampaign: (campaign: BrandCampaign) => {
      setCampaignToEdit(campaign);
      setEditCampaignOpen(true);
    },
  };
  const communityDemo = {
    campaigns: communityCampaigns,
    applications: communityApplications,
    transactions: communityTransactions,
    balance: communityBalance,
    discoverable: discoverableCampaigns,
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
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
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
          profile={profile}
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
          onWithdraw={handleWithdraw}
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
      