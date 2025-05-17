'use client';
import { useState } from 'react';
import ManageCampaignsModal from './ManageCampaignsModal';
import MyCampaignsModal from './MyCampaignsModal';
export type DashboardAction =
  | 'create-campaign'
  | 'manage-campaigns'
  | 'deposit'
  | 'withdraw'
  | 'transactions'
  | 'discover-campaigns'
  | 'my-campaigns';
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
  type: string;
  amount: number;
  status: string;
  date: string;
  hash: string;
}
interface BrandDemo {
  campaigns: BrandCampaign[];
  transactions: BrandTransaction[];
  balance: number;
  onEditCampaign: (campaign: BrandCampaign) => void;
  onWithdraw: (amount: number) => void;
}
interface CommunityDemo {
  campaigns: CommunityCampaign[];
  applications: CommunityApplication[];
  transactions: CommunityTransaction[];
  balance: number;
  discoverable: {
    id: string;
    title: string;
    brand: string;
    status: string;
    deliverableDue: string;
    numCommunities: number;
    startDate: string;
    endDate: string;
    successCriteria: string;
    expectedDeliverables: string;
    budgetPerCommunity: string;
  }[];
}
interface DashboardActionModalProps {
  userType: 'brand' | 'community';
  action: DashboardAction;
  onClose: () => void;
  brandDemo: BrandDemo;
  communityDemo: CommunityDemo;
  onCreateCampaign: (
    title: string,
    description: string,
    budget: number,
    tags: string[],
    numCommunities: number,
    startDate: string,
    endDate: string,
    successCriteria: string,
    expectedDeliverables: string
  ) => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onAcceptCampaign: (campaignId: string, reason: string) => void;
}
const TAG_OPTIONS = ['NFT', 'SocialFi', 'GameFi', 'DeFi'];
const DashboardActionModal = ({
  userType,
  action,
  onClose,
  brandDemo,
  communityDemo,
  onCreateCampaign,
  onDeposit,
  onWithdraw,
  onAcceptCampaign,
}: DashboardActionModalProps) => {
  // State for create campaign
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [numCommunities, setNumCommunities] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [expectedDeliverables, setExpectedDeliverables] = useState('');
  const [createError, setCreateError] = useState('');
  // Deposit/Withdraw
  const [amount, setAmount] = useState('');
  const [txLoading, setTxLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txSuccess, setTxSuccess] = useState(false);
  // Community: Apply (per-campaign state)
  const [applyReasonMap, setApplyReasonMap] = useState<{ [id: string]: string }>({});
  const [applyErrorMap, setApplyErrorMap] = useState<{ [id: string]: string }>({});
  const [applyLoadingId, setApplyLoadingId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  // --- Brand Actions ---
  if (userType === 'brand') {
    // Create Campaign
    if (action === 'create-campaign') {
      const handleTagChange = (tag: string) => {
        setTags((prev) =>
          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
      };
      const handleAddCustomTag = () => {
        if (customTag.trim() && !tags.includes(customTag.trim())) {
          setTags([...tags, customTag.trim()]);
          setCustomTag('');
        }
      };
      const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (
          !title.trim() ||
          !description.trim() ||
          !budget.trim() ||
          !numCommunities.trim() ||
          !startDate.trim() ||
          !endDate.trim() ||
          !successCriteria.trim() ||
          !expectedDeliverables.trim()
        ) {
          setCreateError('All fields are required.');
          return;
        }
        if (tags.length === 0) {
          setCreateError('Please select at least one tag.');
          return;
        }
        const budgetNum = Number(budget);
        if (isNaN(budgetNum) || budgetNum <= 0) {
          setCreateError('Budget must be a positive number.');
          return;
        }
        if (budgetNum > brandDemo.balance) {
          setCreateError('Budget cannot exceed your available balance.');
          return;
        }
        const numComm = Number(numCommunities);
        if (isNaN(numComm) || numComm <= 0) {
          setCreateError('Number of communities must be positive.');
          return;
        }
        setCreateError('');
        onCreateCampaign(
          title,
          description,
          budgetNum,
          tags,
          numComm,
          startDate,
          endDate,
          successCriteria,
          expectedDeliverables
        );
        setTitle('');
        setDescription('');
        setBudget('');
        setTags([]);
        setCustomTag('');
        setNumCommunities('');
        setStartDate('');
        setEndDate('');
        setSuccessCriteria('');
        setExpectedDeliverables('');
      };
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Create Campaign
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="budget">
                  Budget (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  id="budget"
                  type="number"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
                  required
                  min={1}
                  max={brandDemo.balance}
                />
                <div className="text-xs text-gray-400 mt-1">
                  Available balance: <span className="font-semibold text-white">${brandDemo.balance}</span>
                </div>
              </div>
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="numCommunities">
                  Number of Communities <span className="text-red-500">*</span>
                </label>
                <input
                  id="numCommunities"
                  type="number"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={numCommunities}
                  onChange={(e) => setNumCommunities(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-white text-sm mb-1" htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white text-sm mb-1" htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white text-sm mb-1">
                  Tags <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className={`px-3 py-1 rounded-full border ${
                        tags.includes(tag)
                          ? 'bg-[#0052ff] text-white border-[#0052ff]'
                          : 'bg-[#23262b] text-gray-300 border-[#23262b]'
                      } text-xs font-medium`}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff] text-xs"
                    placeholder="Add custom tag"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-[#0052ff] hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    onClick={handleAddCustomTag}
                  >
                    Add
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Selected: {tags.join(', ') || 'None'}
                </div>
              </div>
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="successCriteria">
                  Success Criteria <span className="text-red-500">*</span>
                </label>
                <input
                  id="successCriteria"
                  type="text"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={successCriteria}
                  onChange={(e) => setSuccessCriteria(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm mb-1" htmlFor="expectedDeliverables">
                  Expected Deliverables <span className="text-red-500">*</span>
                </label>
                <input
                  id="expectedDeliverables"
                  type="text"
                  className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                  value={expectedDeliverables}
                  onChange={(e) => setExpectedDeliverables(e.target.value)}
                  required
                />
              </div>
              {createError && (
                <div className="text-red-500 text-sm">{createError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
              >
                Create Campaign
              </button>
            </form>
          </div>
        </div>
      );
    }
    // Manage Campaigns
    if (action === 'manage-campaigns') {
      return (
        <ManageCampaignsModal
          campaigns={brandDemo.campaigns}
          onEditCampaign={brandDemo.onEditCampaign}
          onUpdateApplicants={() => {}}
          onClose={onClose}
        />
      );
    }
    // Deposit
    if (action === 'deposit') {
      const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        setTxLoading(true);
        setTimeout(() => {
          setTxHash(`0x${Math.random().toString(16).slice(2, 10)}...`);
          setTxSuccess(true);
          setTxLoading(false);
          onDeposit(Number(amount));
        }, 1200);
      };
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Deposit Funds
            </h2>
            <div className="text-xs text-gray-400 mb-2">
              Available balance: <span className="font-semibold text-white">${brandDemo.balance}</span>
            </div>
            <form onSubmit={handleDeposit} className="space-y-4">
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                placeholder="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                required
                min={1}
              />
              <button
                type="submit"
                className="w-full bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
                disabled={txLoading || !amount || Number(amount) <= 0}
              >
                {txLoading ? 'Processing...' : 'Deposit'}
              </button>
            </form>
            {txHash && (
              <div className="mt-4 text-xs text-green-400 text-center">
                Transaction Hash: {txHash}
              </div>
            )}
            {txSuccess && (
              <div className="mt-2 text-green-400 text-center font-semibold">
                Deposit successful!
              </div>
            )}
          </div>
        </div>
      );
    }
    // Withdraw
    if (action === 'withdraw') {
      const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setTxLoading(true);
        setTimeout(() => {
          setTxHash(`0x${Math.random().toString(16).slice(2, 10)}...`);
          setTxSuccess(true);
          setTxLoading(false);
          onWithdraw(Number(amount));
        }, 1200);
      };
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Withdraw Funds
            </h2>
            <div className="text-xs text-gray-400 mb-2">
              Available balance: <span className="font-semibold text-white">${brandDemo.balance}</span>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                placeholder="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                required
                min={1}
                max={brandDemo.balance}
              />
              <button
                type="submit"
                className="w-full bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
                disabled={txLoading || !amount || Number(amount) <= 0 || Number(amount) > brandDemo.balance}
              >
                {txLoading ? 'Processing...' : 'Withdraw'}
              </button>
            </form>
            {txHash && (
              <div className="mt-4 text-xs text-green-400 text-center">
                Transaction Hash: {txHash}
              </div>
            )}
            {txSuccess && (
              <div className="mt-2 text-green-400 text-center font-semibold">
                Withdrawal successful!
              </div>
            )}
          </div>
        </div>
      );
    }
    // Transactions
    if (action === 'transactions') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Transaction History
            </h2>
            <div className="space-y-3">
              {brandDemo.transactions.length === 0 && (
                <div className="text-gray-400 text-center">No transactions found.</div>
              )}
              {brandDemo.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[#23262b] rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-white font-semibold text-sm capitalize">
                      {tx.type}
                    </div>
                    <div className="text-xs text-gray-400">
                      Date: {tx.date} | Status: {tx.status}
                    </div>
                    <div className="text-xs text-gray-400">
                      Hash: {tx.hash}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    tx.type === 'withdrawal' || tx.type === 'payment'
                      ? 'text-red-400'
                      : 'text-green-400'
                  } mt-2 md:mt-0`}>
                    {tx.type === 'withdrawal' || tx.type === 'payment'
                      ? `-$${tx.amount}`
                      : `+$${tx.amount}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
  // --- Community Actions ---
  if (userType === 'community') {
    // Discover Campaigns
    if (action === 'discover-campaigns') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Discover Campaigns
            </h2>
            <div className="space-y-6">
              {communityDemo.discoverable.length === 0 && (
                <div className="text-gray-400 text-center">No campaigns available to apply.</div>
              )}
              {communityDemo.discoverable.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#23262b] rounded-lg p-5 mb-2"
                >
                  <div className="text-white font-semibold text-lg">{c.title}</div>
                  <div className="text-gray-400 text-sm mb-1">Brand: {c.brand}</div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Communities:</span> {c.numCommunities} &nbsp;|&nbsp;
                    <span className="font-semibold">Budget per Community:</span> {c.budgetPerCommunity} &nbsp;|&nbsp;
                    <span className="font-semibold">Start:</span> {c.startDate} &nbsp;|&nbsp;
                    <span className="font-semibold">End:</span> {c.endDate}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Success Criteria:</span> {c.successCriteria}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Expected Deliverables:</span> {c.expectedDeliverables}
                  </div>
                  <form
                    className="mt-3 flex flex-col gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!applyReasonMap[c.id] || !applyReasonMap[c.id].trim()) {
                        setApplyErrorMap((prev) => ({
                          ...prev,
                          [c.id]: 'Please provide a reason for your application.',
                        }));
                        return;
                      }
                      setApplyLoadingId(c.id);
                      setTimeout(() => {
                        setAppliedId(c.id);
                        setApplyLoadingId(null);
                        onAcceptCampaign(c.id, applyReasonMap[c.id]);
                        setApplyReasonMap((prev) => ({ ...prev, [c.id]: '' }));
                        setApplyErrorMap((prev) => ({ ...prev, [c.id]: '' }));
                      }, 1000);
                    }}
                  >
                    <label className="block text-white text-xs mb-1" htmlFor={`reason-${c.id}`}>
                      Why do you want to apply?
                    </label>
                    <textarea
                      id={`reason-${c.id}`}
                      className="w-full px-3 py-2 rounded bg-[#181a1f] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff] text-xs"
                      value={applyReasonMap[c.id] || ''}
                      onChange={(e) =>
                        setApplyReasonMap((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                      rows={2}
                      required
                    />
                    {applyErrorMap[c.id] && (
                      <div className="text-xs text-red-400">{applyErrorMap[c.id]}</div>
                    )}
                    <button
                      type="submit"
                      className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm mt-1"
                      disabled={!!applyLoadingId}
                    >
                      {applyLoadingId === c.id ? 'Submitting...' : 'Apply'}
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (action === 'my-campaigns') {
      return (
        <MyCampaignsModal
          campaigns={communityDemo.campaigns}
          applications={communityDemo.applications}
          onClose={onClose}
        />
      );
    }
    if (action === 'withdraw') {
      const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setTxLoading(true);
        setTimeout(() => {
          setTxHash(`0x${Math.random().toString(16).slice(2, 10)}...`);
          setTxSuccess(true);
          setTxLoading(false);
          onWithdraw(Number(amount));
        }, 1200);
      };
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Withdraw Funds
            </h2>
            <div className="text-xs text-gray-400 mb-2">
              Available balance: <span className="font-semibold text-white">${communityDemo.balance}</span>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                placeholder="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                required
                min={1}
                max={communityDemo.balance}
              />
              <button
                type="submit"
                className="w-full bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
                disabled={txLoading || !amount || Number(amount) <= 0 || Number(amount) > communityDemo.balance}
              >
                {txLoading ? 'Processing...' : 'Withdraw'}
              </button>
            </form>
            {txHash && (
              <div className="mt-4 text-xs text-green-400 text-center">
                Transaction Hash: {txHash}
              </div>
            )}
            {txSuccess && (
              <div className="mt-2 text-green-400 text-center font-semibold">
                Withdrawal successful!
              </div>
            )}
          </div>
        </div>
      );
    }
    if (action === 'transactions') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Transaction History
            </h2>
            <div className="space-y-3">
              {communityDemo.transactions.length === 0 && (
                <div className="text-gray-400 text-center">No transactions found.</div>
              )}
              {communityDemo.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-[#23262b] rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-white font-semibold text-sm capitalize">
                      {tx.type}
                    </div>
                    <div className="text-xs text-gray-400">
                      Date: {tx.date} | Status: {tx.status}
                    </div>
                    <div className="text-xs text-gray-400">
                      Hash: {tx.hash}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'} mt-2 md:mt-0`}>
                    {tx.type === 'withdrawal' ? `-$${tx.amount}` : `+$${tx.amount}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
  // Fallback
  return null;
};
export default DashboardActionModal;