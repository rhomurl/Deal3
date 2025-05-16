
'use client';
import type { FC } from 'react';
import type { DashboardAction } from './DashboardActionModal';
interface UserProfile {
  userType: 'brand' | 'community' | null;
  name: string;
  logo: string;
  description: string;
  socials: string;
}
interface DashboardMockProps {
  userType: 'brand' | 'community';
  profile: UserProfile;
  onLogout: () => void;
  onAction: (action: DashboardAction) => void;
  onEditProfile: () => void;
}
const DashboardMock: FC<DashboardMockProps> = ({
  userType,
  profile,
  onLogout,
  onAction,
  onEditProfile,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 bg-[#181a1f] rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        {profile.logo ? (
          <img
            src={profile.logo}
            alt="Logo"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#0052ff]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#23262b] flex items-center justify-center text-2xl text-white font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'D'}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile.name || (userType === 'brand' ? 'Brand' : 'Community')}
          </h2>
          <div className="text-[#0052ff] text-sm font-semibold capitalize">
            {userType}
          </div>
        </div>
        <button
          className="ml-auto bg-[#23262b] hover:bg-[#2d3138] text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <div className="flex-1">
          <div className="text-white text-base mb-1 font-semibold">Profile</div>
          <div className="text-gray-300 text-sm mb-2">
            {profile.description ||
              (userType === 'brand'
                ? 'No brand description yet.'
                : 'No community description yet.')}
          </div>
          {profile.socials && (
            <div className="text-gray-400 text-xs">
              <span className="font-semibold">Socials:</span> {profile.socials}
            </div>
          )}
        </div>
        <button
          className="ml-4 bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={onEditProfile}
        >
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {userType === 'brand' ? (
          <>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Create Campaign</div>
              <div className="text-gray-400 text-sm mb-4">
                {'Launch a new campaign and connect with web3 communities.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('create-campaign')}
              >
                + New Campaign
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Manage Campaigns</div>
              <div className="text-gray-400 text-sm mb-4">
                {'View, edit, and track your active and past campaigns.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('manage-campaigns')}
              >
                Go to Dashboard
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Deposit Funds</div>
              <div className="text-gray-400 text-sm mb-4">
                {'Add funds to your platform wallet for campaign payouts.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('deposit')}
              >
                Deposit
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Transaction History</div>
              <div className="text-gray-400 text-sm mb-4">
                {'View all your deposits, withdrawals, and campaign payments.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('transactions')}
              >
                View History
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Discover Campaigns</div>
              <div className="text-gray-400 text-sm mb-4">
                {'Browse and apply to open brand campaigns.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('discover-campaigns')}
              >
                Explore
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">My Campaigns</div>
              <div className="text-gray-400 text-sm mb-4">
                {'Track your active and completed campaigns.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('my-campaigns')}
              >
                Dashboard
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Withdraw Funds</div>
              <div className="text-gray-400 text-sm mb-4">
                {'Withdraw your earnings after campaign completion.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('withdraw')}
              >
                Withdraw
              </button>
            </div>
            <div className="bg-[#23262b] rounded-lg p-5 flex flex-col items-start">
              <div className="text-white font-semibold text-lg mb-2">Transaction History</div>
              <div className="text-gray-400 text-sm mb-4">
                {'View all your deposits, withdrawals, and campaign payments.'}
              </div>
              <button
                className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                onClick={() => onAction('transactions')}
              >
                View History
              </button>
            </div>
          </>
        )}
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        {'This is a mockup. All features are for demonstration only.'}
      </div>
    </div>
  );
};
export default DashboardMock;