'use client';
import { useState } from 'react';
interface EditCampaignModalProps {
  campaign: {
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
    applicantsList?: unknown[];
  };
  onSave: (updated: {
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
    applicantsList?: unknown[];
  }) => void;
  onClose: () => void;
}
const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  campaign,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(campaign.title);
  const [description, setDescription] = useState<string>(campaign.description);
  const [tags, setTags] = useState<string>(campaign.tags.join(', '));
  const [status, setStatus] = useState<string>(campaign.status);
  const [numCommunities, setNumCommunities] = useState<string>(campaign.numCommunities.toString());
  const [startDate, setStartDate] = useState<string>(campaign.startDate);
  const [endDate, setEndDate] = useState<string>(campaign.endDate);
  const [successCriteria, setSuccessCriteria] = useState<string>(campaign.successCriteria);
  const [expectedDeliverables, setExpectedDeliverables] = useState<string>(campaign.expectedDeliverables);
  const [error, setError] = useState<string>('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (
      !title.trim() ||
      !description.trim() ||
      !numCommunities.trim() ||
      !startDate.trim() ||
      !endDate.trim() ||
      !successCriteria.trim() ||
      !expectedDeliverables.trim()
    ) {
      setError('All fields are required.');
      return;
    }
    const numComm = Number(numCommunities);
    if (isNaN(numComm) || numComm <= 0) {
      setError('Number of communities must be positive.');
      return;
    }
    const tagsArr = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    onSave({
      ...campaign,
      title,
      description,
      tags: tagsArr,
      status,
      numCommunities: numComm,
      startDate,
      endDate,
      successCriteria,
      expectedDeliverables,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181a1f] rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Edit Campaign
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Budget (USD)
            </label>
            <input
              id="budget"
              type="number"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-gray-400 border border-[#23262b] focus:outline-none focus:border-[#0052ff] cursor-not-allowed"
              value={campaign.budget}
              disabled
              readOnly
            />
            <div className="text-xs text-gray-400 mt-1">
              Budget cannot be changed after campaign creation.
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
            <label className="block text-white text-sm mb-1" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
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
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditCampaignModal;