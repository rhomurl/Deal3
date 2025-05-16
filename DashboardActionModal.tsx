'use client';
import { useState } from 'react';
export type DashboardAction =
  | 'create-campaign'
  | 'manage-campaigns'
  | 'deposit'
  | 'transactions'
  | 'discover-campaigns'
  | 'my-campaigns'
  | 'withdraw';
interface BrandDemoData {
  campaigns: {
    id: string;
    title: string;
    description: string;
    budget: number;
    tags: string[];
    status: string;
    applicants: number;
    approved: number;
    numCommunities?: number;
    startDate?: string;
    endDate?: string;
    successCriteria?: string;
    expectedDeliverables?: string;
    applicantsList?: {
      id: string;
      name: string;
      status: 'Pending' | 'Approved' | 'Declined';
      socials: string;
    }[];
  }[];
  transactions: {
    id: string;
    type: string;
    amount: number;
    status: string;
    date: string;
    hash: string;
  }[];
  balance: number;
  onEditCampaign?: (campaign: BrandDemoData['campaigns'][0]) => void;
  onViewApplicants?: (campaign: BrandDemoData['campaigns'][0]) => void;
  onUpdateApplicants?: (campaignId: string, applicantsList: BrandDemoData['campaigns'][0]['applicantsList']) => void;
}
interface CommunityDemoData {
  campaigns: {
    id: string;
    title: string;
    brand: string;
    status: string;
    deliverableDue: string;
  }[];
  applications: {
    id: string;
    campaign: string;
    status: string;
    appliedOn: string;
  }[];
  transactions: {
    id: string;
    type: string;
    amount: number;
    status: string;
    date: string;
    hash: string;
  }[];
  balance: number;
  discoverable: {
    id: string;
    title: string;
    brand: string;
    status: string;
    deliverableDue: string;
  }[];
}
interface DashboardActionModalProps {
  userType: 'brand' | 'community';
  action: DashboardAction;
  onClose: () => void;
  brandDemo: BrandDemoData;
  communityDemo: CommunityDemoData;
  onCreateCampaign?: (
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
  onDeposit?: (amount: number) => void;
  onWithdraw?: (amount: number) => void;
  onAcceptCampaign?: (campaignId: string) => void;
  onEditCampaign?: (campaign: BrandDemoData['campaigns'][0]) => void;
  onViewApplicants?: (campaign: BrandDemoData['campaigns'][0]) => void;
  onUpdateApplicants?: (campaignId: string, applicantsList: BrandDemoData['campaigns'][0]['applicantsList']) => void;
}
const ConfirmTxModal: React.FC<{
  type: 'deposit' | 'withdrawal';
  amount: number;
  onConfirm: (hash: string) => void;
  onCancel: () => void;
}> = ({ type, amount, onConfirm, onCancel }) => {
  const [pending, setPending] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [done, setDone] = useState<boolean>(false);
  const handleConfirm = () => {
    setPending(true);
    setTimeout(() => {
      const txHash = `0x${Math.random().toString(16).slice(2, 10)}...`;
      setHash(txHash);
      setDone(true);
      setPending(false);
      setTimeout(() => {
        onConfirm(txHash);
      }, 1200);
    }, 1200);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onCancel}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-white mb-2 text-center">
          {type === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
        </h3>
        <div className="text-gray-300 text-center mb-4">
          {type === 'deposit'
            ? `You are about to deposit $${amount} to your platform wallet.`
            : `You are about to withdraw $${amount} from your platform wallet.`}
        </div>
        {!pending && !done && (
          <button
            className="w-full bg-[#0052ff] text-white font-semibold py-2 rounded-lg mt-2"
            onClick={handleConfirm}
          >
            Confirm Transaction
          </button>
        )}
        {pending && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0052ff] mb-2"></div>
            <div className="text-gray-400">Broadcasting transaction...</div>
          </div>
        )}
        {done && (
          <div className="flex flex-col items-center">
            <div className="text-green-400 font-bold mb-2">Transaction Confirmed</div>
            <div className="text-xs text-gray-400 mb-1">Tx Hash:</div>
            <div className="text-xs text-white font-mono">{hash}</div>
          </div>
        )}
      </div>
    </div>
  );
};
const ViewApplicantsModal: React.FC<{
  applicants: {
    id: string;
    name: string;
    status: 'Pending' | 'Approved' | 'Declined';
    socials: string;
  }[];
  onUpdate: (updated: typeof applicants) => void;
  onClose: () => void;
}> = ({ applicants, onUpdate, onClose }) => {
  const [localApplicants, setLocalApplicants] = useState<typeof applicants>(applicants);
  const handleStatus = (id: string, status: 'Approved' | 'Declined') => {
    setLocalApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={() => {
            onUpdate(localApplicants);
            onClose();
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-white mb-2 text-center">Applicants</h3>
        <div className="space-y-3">
          {localApplicants.length === 0 && (
            <div className="text-gray-400 text-center">No applicants yet.</div>
          )}
          {localApplicants.map((a) => (
            <div key={a.id} className="bg-[#23262b] rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">{a.name}</div>
                <div className="text-xs text-gray-400">{a.socials}</div>
                <div className="text-xs text-gray-400">
                  Status:{' '}
                  <span
                    className={
                      a.status === 'Approved'
                        ? 'text-green-400 font-bold'
                        : a.status === 'Declined'
                        ? 'text-red-400 font-bold'
                        : 'text-yellow-400 font-bold'
                    }
                  >
                    {a.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
                  disabled={a.status === 'Approved'}
                  onClick={() => handleStatus(a.id, 'Approved')}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
                  disabled={a.status === 'Declined'}
                  onClick={() => handleStatus(a.id, 'Declined')}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const DashboardActionModal: React.FC<DashboardActionModalProps> = ({
  userType,
  action,
  onClose,
  brandDemo,
  communityDemo,
  onCreateCampaign,
  onDeposit,
  onWithdraw,
  onAcceptCampaign,
  onEditCampaign,
  onViewApplicants,
  onUpdateApplicants,
}) => {
  // State for forms
  const [campaignTitle, setCampaignTitle] = useState<string>('');
  const [campaignDesc, setCampaignDesc] = useState<string>('');
  const [campaignBudget, setCampaignBudget] = useState<string>('');
  const [campaignTags, setCampaignTags] = useState<string>('');
  const [numCommunities, setNumCommunities] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [successCriteria, setSuccessCriteria] = useState<string>('');
  const [expectedDeliverables, setExpectedDeliverables] = useState<string>('');
  const [createError, setCreateError] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositError, setDepositError] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [accepting, setAccepting] = useState<string | null>(null);
  const [showConfirmTx, setShowConfirmTx] = useState<null | { type: 'deposit' | 'withdrawal'; amount: number }>(null);
  const [viewApplicantsFor, setViewApplicantsFor] = useState<null | BrandDemoData['campaigns'][0]>(null);
  let content: React.ReactNode = null;
  if (userType === 'brand') {
    if (action === 'create-campaign') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Create Campaign</h3>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setCreateError('');
              if (
                !campaignTitle.trim() ||
                !campaignDesc.trim() ||
                !campaignBudget.trim() ||
                !numCommunities.trim() ||
                !startDate.trim() ||
                !endDate.trim()
              ) {
                setCreateError('All required fields must be filled.');
                return;
              }
              const budgetNum = Number(campaignBudget);
              const numComm = Number(numCommunities);
              if (isNaN(budgetNum) || budgetNum <= 0) {
                setCreateError('Budget must be a positive number.');
                return;
              }
              if (isNaN(numComm) || numComm <= 0) {
                setCreateError('Number of communities must be a positive number.');
                return;
              }
              const tagsArr = campaignTags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t.length > 0);
              if (onCreateCampaign) {
                onCreateCampaign(
                  campaignTitle,
                  campaignDesc,
                  budgetNum,
                  tagsArr,
                  numComm,
                  startDate,
                  endDate,
                  successCriteria,
                  expectedDeliverables
                );
                setCampaignTitle('');
                setCampaignDesc('');
                setCampaignBudget('');
                setCampaignTags('');
                setNumCommunities('');
                setStartDate('');
                setEndDate('');
                setSuccessCriteria('');
                setExpectedDeliverables('');
              }
            }}
          >
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Campaign Title"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              required
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Description"
              rows={2}
              value={campaignDesc}
              onChange={(e) => setCampaignDesc(e.target.value)}
              required
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Budget (USD)"
              value={campaignBudget}
              onChange={(e) => setCampaignBudget(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Number of Communities"
              value={numCommunities}
              onChange={(e) => setNumCommunities(e.target.value.replace(/[^0-9]/g, ''))}
              required
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="w-1/2 px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                placeholder="Start Date"
              />
              <input
                type="date"
                className="w-1/2 px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                placeholder="End Date"
              />
            </div>
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Tags (comma separated)"
              value={campaignTags}
              onChange={(e) => setCampaignTags(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Success Criteria"
              rows={2}
              value={successCriteria}
              onChange={(e) => setSuccessCriteria(e.target.value)}
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Expected Deliverables"
              rows={2}
              value={expectedDeliverables}
              onChange={(e) => setExpectedDeliverables(e.target.value)}
            />
            {createError && (
              <div className="text-red-500 text-sm">{createError}</div>
            )}
            <button
              className="w-full bg-[#0052ff] text-white font-semibold py-2 rounded-lg mt-2"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      );
    } else if (action === 'manage-campaigns') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Your Campaigns</h3>
          <div className="space-y-3">
            {brandDemo.campaigns.length === 0 && (
              <div className="text-gray-400">No campaigns yet.</div>
            )}
            {brandDemo.campaigns.map((c) => (
              <div key={c.id} className="bg-[#23262b] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{c.title}</div>
                  <div className="text-gray-400 text-xs mb-1">{c.description}</div>
                  <div className="text-xs text-[#0052ff] mb-1">
                    {c.tags.map((t) => (
                      <span key={t} className="mr-2">#{t}</span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    Status: <span className="font-semibold text-white">{c.status}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Communities: <span className="font-semibold text-white">{c.numCommunities || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Start: <span className="font-semibold text-white">{c.startDate || '-'}</span> | End: <span className="font-semibold text-white">{c.endDate || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Success Criteria: <span className="font-semibold text-white">{c.successCriteria || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Expected Deliverables: <span className="font-semibold text-white">{c.expectedDeliverables || '-'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-gray-300 text-right mb-2">
                    Applicants: <span className="font-bold text-white">{c.applicants}</span>
                    <br />
                    Approved: <span className="font-bold text-white">{c.approved}</span>
                  </div>
                  <button
                    className="bg-[#0052ff] hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium text-xs mb-1"
                    onClick={() => brandDemo.onEditCampaign && brandDemo.onEditCampaign(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#0052ff] hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium text-xs"
                    onClick={() => setViewApplicantsFor(c)}
                  >
                    View Applicants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (action === 'deposit') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Deposit Funds</h3>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setDepositError('');
              if (!depositAmount.trim()) {
                setDepositError('Amount is required.');
                return;
              }
              const amt = Number(depositAmount);
              if (isNaN(amt) || amt <= 0) {
                setDepositError('Amount must be a positive number.');
                return;
              }
              setShowConfirmTx({ type: 'deposit', amount: amt });
            }}
          >
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Amount (USD)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
            {depositError && (
              <div className="text-red-500 text-sm">{depositError}</div>
            )}
            <button
              className="w-full bg-[#0052ff] text-white font-semibold py-2 rounded-lg mt-2"
              type="submit"
            >
              Deposit
            </button>
          </form>
          <div className="mt-4 text-gray-400 text-xs">
            Current Balance: <span className="text-white font-bold">${brandDemo.balance}</span>
          </div>
        </div>
      );
    } else if (action === 'transactions') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Transaction History</h3>
          <div className="space-y-2">
            {brandDemo.transactions.length === 0 && (
              <div className="text-gray-400">No transactions yet.</div>
            )}
            {brandDemo.transactions.map((tx) => (
              <div key={tx.id} className="bg-[#23262b] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                  <div className="text-xs text-gray-400">{tx.date}</div>
                  <div className="text-xs text-gray-500">Hash: {tx.hash}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${tx.amount}</div>
                  <div className={`text-xs ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  } else if (userType === 'community') {
    if (action === 'discover-campaigns') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Discover Campaigns</h3>
          <div className="space-y-3">
            {communityDemo.discoverable.length === 0 && (
              <div className="text-gray-400">No campaigns available.</div>
            )}
            {communityDemo.discoverable.map((c) => (
              <div key={c.id} className="bg-[#23262b] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{c.title}</div>
                  <div className="text-gray-400 text-xs mb-1">Brand: {c.brand}</div>
                  <div className="text-xs text-gray-400">
                    Status: <span className="font-semibold text-white">{c.status}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Due: <span className="text-white font-bold">{c.deliverableDue}</span>
                  </div>
                </div>
                <button
                  className={`ml-4 bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm ${
                    accepting === c.id ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    setAccepting(c.id);
                    setTimeout(() => {
                      if (onAcceptCampaign) onAcceptCampaign(c.id);
                      setAccepting(null);
                    }, 700);
                  }}
                  disabled={accepting === c.id}
                >
                  {accepting === c.id ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (action === 'my-campaigns') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">My Campaigns</h3>
          <div className="space-y-3">
            {communityDemo.applications.length === 0 && (
              <div className="text-gray-400">No campaigns yet.</div>
            )}
            {communityDemo.applications.map((app) => (
              <div key={app.id} className="bg-[#23262b] rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{app.campaign}</div>
                  <div className="text-xs text-gray-400">Applied: {app.appliedOn}</div>
                </div>
                <div className={`text-xs font-bold ${app.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}`}>
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (action === 'withdraw') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Withdraw Funds</h3>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setWithdrawError('');
              if (!withdrawAmount.trim()) {
                setWithdrawError('Amount is required.');
                return;
              }
              const amt = Number(withdrawAmount);
              if (isNaN(amt) || amt <= 0) {
                setWithdrawError('Amount must be a positive number.');
                return;
              }
              if (amt > communityDemo.balance) {
                setWithdrawError('Insufficient balance.');
                return;
              }
              setShowConfirmTx({ type: 'withdrawal', amount: amt });
            }}
          >
            <input
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              placeholder="Amount (USD)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              required
            />
            {withdrawError && (
              <div className="text-red-500 text-sm">{withdrawError}</div>
            )}
            <button
              className="w-full bg-[#0052ff] text-white font-semibold py-2 rounded-lg mt-2"
              type="submit"
            >
              Withdraw
            </button>
          </form>
          <div className="mt-4 text-gray-400 text-xs">
            Current Balance: <span className="text-white font-bold">${communityDemo.balance}</span>
          </div>
        </div>
      );
    } else if (action === 'transactions') {
      content = (
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Transaction History</h3>
          <div className="space-y-2">
            {communityDemo.transactions.length === 0 && (
              <div className="text-gray-400">No transactions yet.</div>
            )}
            {communityDemo.transactions.map((tx) => (
              <div key={tx.id} className="bg-[#23262b] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                  <div className="text-xs text-gray-400">{tx.date}</div>
                  <div className="text-xs text-gray-500">Hash: {tx.hash}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">${tx.amount}</div>
                  <div className={`text-xs ${tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>{tx.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-lg relative">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          {content}
        </div>
      </div>
      {/* Blockchain-style Confirm Transaction Modal */}
      {showConfirmTx && (
        <ConfirmTxModal
          type={showConfirmTx.type}
          amount={showConfirmTx.amount}
          onCancel={() => setShowConfirmTx(null)}
          onConfirm={(hash) => {
            setShowConfirmTx(null);
            if (showConfirmTx.type === 'deposit' && onDeposit) {
              onDeposit(showConfirmTx.amount);
            }
            if (showConfirmTx.type === 'withdrawal' && onWithdraw) {
              onWithdraw(showConfirmTx.amount);
            }
          }}
        />
      )}
      {/* View Applicants Modal */}
      {viewApplicantsFor && (
        <ViewApplicantsModal
          applicants={viewApplicantsFor.applicantsList || []}
          onUpdate={(updated) => {
            if (onUpdateApplicants) {
              onUpdateApplicants(viewApplicantsFor.id, updated);
            }
            setViewApplicantsFor(null);
          }}
          onClose={() => setViewApplicantsFor(null)}
        />
      )}
    </>
  );
};
export default DashboardActionModal;