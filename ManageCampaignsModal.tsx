'use client';
import { useState } from 'react';
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
interface ManageCampaignsModalProps {
  campaigns: BrandCampaign[];
  onEditCampaign: (campaign: BrandCampaign) => void;
  onUpdateApplicants: (campaignId: string, applicantsList: Applicant[]) => void;
  onClose: () => void;
}
const ManageCampaignsModal: React.FC<ManageCampaignsModalProps> = ({
  campaigns,
  onEditCampaign,
  onUpdateApplicants,
  onClose,
}) => {
  const [viewApplicantsId, setViewApplicantsId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<{ [appId: string]: string }>({});
  const [error, setError] = useState<{ [appId: string]: string }>({});
  const handleApprove = (campaignId: string, appId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    const updated = campaign.applicantsList.map((a) =>
      a.id === appId ? { ...a, status: 'Approved', declineReason: undefined } : a
    );
    onUpdateApplicants(campaignId, updated);
  };
  const handleDecline = (campaignId: string, appId: string) => {
    if (!declineReason[appId] || !declineReason[appId].trim()) {
      setError((prev) => ({ ...prev, [appId]: 'Decline reason required.' }));
      return;
    }
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    const updated = campaign.applicantsList.map((a) =>
      a.id === appId
        ? { ...a, status: 'Declined', declineReason: declineReason[appId] }
        : a
    );
    onUpdateApplicants(campaignId, updated);
    setError((prev) => ({ ...prev, [appId]: '' }));
    setDeclineReason((prev) => ({ ...prev, [appId]: '' }));
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Manage Campaigns
        </h2>
        <div className="space-y-6">
          {campaigns.length === 0 && (
            <div className="text-gray-400 text-center">No campaigns found.</div>
          )}
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-[#23262b] rounded-lg p-5 mb-2"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-white font-semibold text-lg">{campaign.title}</div>
                  <div className="text-gray-400 text-sm mb-1">{campaign.description}</div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Budget:</span> ${campaign.budget} &nbsp;|&nbsp;
                    <span className="font-semibold">Status:</span> {campaign.status}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Tags:</span> {campaign.tags.join(', ')}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Communities:</span> {campaign.numCommunities} &nbsp;|&nbsp;
                    <span className="font-semibold">Start:</span> {campaign.startDate} &nbsp;|&nbsp;
                    <span className="font-semibold">End:</span> {campaign.endDate}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Success Criteria:</span> {campaign.successCriteria}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="font-semibold">Expected Deliverables:</span> {campaign.expectedDeliverables}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 md:mt-0">
                  <button
                    className="bg-[#0052ff] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                    onClick={() => onEditCampaign(campaign)}
                  >
                    Edit Campaign
                  </button>
                  <button
                    className="bg-[#23262b] border border-[#0052ff] text-[#0052ff] hover:bg-[#181a1f] px-4 py-2 rounded-lg font-medium text-sm"
                    onClick={() =>
                      setViewApplicantsId(
                        viewApplicantsId === campaign.id ? null : campaign.id
                      )
                    }
                  >
                    {viewApplicantsId === campaign.id ? 'Hide Applicants' : 'View Applicants'}
                  </button>
                </div>
              </div>
              {viewApplicantsId === campaign.id && (
                <div className="mt-4 bg-[#181a1f] rounded-lg p-4">
                  <div className="text-white font-semibold mb-2">
                    Applicants ({campaign.applicantsList.length})
                  </div>
                  <div className="flex flex-wrap gap-4 mb-2">
                    <div className="text-xs text-green-400">
                      Approved: {campaign.applicantsList.filter((a) => a.status === 'Approved').length}
                    </div>
                    <div className="text-xs text-yellow-400">
                      Pending: {campaign.applicantsList.filter((a) => a.status === 'Pending').length}
                    </div>
                    <div className="text-xs text-red-400">
                      Declined: {campaign.applicantsList.filter((a) => a.status === 'Declined').length}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {campaign.applicantsList.map((app) => (
                      <div
                        key={app.id}
                        className="bg-[#23262b] rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="text-white font-semibold">{app.name}</div>
                          <div className="text-xs text-gray-400">
                            Twitter: {app.socials.twitter} | Discord: {app.socials.discord} | Telegram: {app.socials.telegram}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span className="font-semibold">Reason:</span> {app.reason}
                          </div>
                          {app.status === 'Declined' && app.declineReason && (
                            <div className="text-xs text-red-400 mt-1">
                              <span className="font-semibold">Declined reason:</span> {app.declineReason}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 mt-2 md:mt-0 md:items-end">
                          <div
                            className={`text-xs font-bold ${
                              app.status === 'Approved'
                                ? 'text-green-400'
                                : app.status === 'Declined'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            }`}
                          >
                            {app.status}
                          </div>
                          {app.status === 'Pending' && (
                            <div className="flex flex-col gap-1">
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                onClick={() => handleApprove(campaign.id, app.id)}
                              >
                                Approve
                              </button>
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  placeholder="Decline reason"
                                  className="px-2 py-1 rounded bg-[#181a1f] text-white border border-[#23262b] text-xs"
                                  value={declineReason[app.id] || ''}
                                  onChange={(e) =>
                                    setDeclineReason((prev) => ({
                                      ...prev,
                                      [app.id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                                  onClick={() => handleDecline(campaign.id, app.id)}
                                >
                                  Decline
                                </button>
                              </div>
                              {error[app.id] && (
                                <div className="text-xs text-red-400">{error[app.id]}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ManageCampaignsModal;