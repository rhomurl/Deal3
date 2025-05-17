'use client';
import type { FC } from 'react';
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
interface MyCampaignsModalProps {
  campaigns: CommunityCampaign[];
  applications: CommunityApplication[];
  onClose: () => void;
}
const statusColor = (status: string): string => {
  if (status === 'Approved') return 'text-green-400';
  if (status === 'Declined') return 'text-red-400';
  if (status === 'Pending') return 'text-yellow-400';
  return 'text-gray-400';
};
const MyCampaignsModal: FC<MyCampaignsModalProps> = ({
  campaigns,
  applications,
  onClose,
}) => {
  // Map campaignId to application for quick lookup
  const appMap: Record<string, CommunityApplication> = {};
  applications.forEach((app) => {
    appMap[app.campaignId] = app;
  });
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
          My Campaigns
        </h2>
        <div className="space-y-6">
          {campaigns.length === 0 && (
            <div className="text-gray-400 text-center">No campaigns found.</div>
          )}
          {campaigns.map((campaign) => {
            const app = appMap[campaign.id];
            return (
              <div
                key={campaign.id}
                className="bg-[#23262b] rounded-lg p-5 mb-2"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="text-white font-semibold text-lg">{campaign.title}</div>
                    <div className="text-gray-400 text-sm mb-1">
                      Brand: {campaign.brand}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="font-semibold">Status:</span>{' '}
                      <span className={statusColor(app?.status || campaign.status)}>
                        {app?.status || campaign.status}
                      </span>
                      &nbsp;|&nbsp;
                      <span className="font-semibold">Due:</span> {campaign.deliverableDue}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="font-semibold">Success Criteria:</span> {campaign.successCriteria}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="font-semibold">Expected Deliverables:</span> {campaign.expectedDeliverables}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2 md:mt-0 md:items-end">
                    <div className={`text-xs font-bold ${statusColor(app?.status || campaign.status)}`}>
                      {app?.status || campaign.status}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-300">
                  <span className="font-semibold">My Reason:</span> {app?.reason || 'N/A'}
                </div>
                {app?.status === 'Declined' && app?.declineReason && (
                  <div className="mt-1 text-xs text-red-400">
                    <span className="font-semibold">Declined reason:</span> {app.declineReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MyCampaignsModal;