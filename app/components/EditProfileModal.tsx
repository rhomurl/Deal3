'use client';
import { useState } from 'react';
interface EditProfileModalProps {
  userType: 'brand' | 'community' | null;
  profile: {
    name: string;
    logo: string;
    description: string;
    twitter: string;
    discord: string;
    telegram: string;
  };
  onSave: (profile: {
    name: string;
    logo: string;
    description: string;
    twitter: string;
    discord: string;
    telegram: string;
  }) => void;
  onClose: () => void;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  userType,
  profile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>(profile.name);
  const [logo, setLogo] = useState<string>(profile.logo);
  const [description, setDescription] = useState<string>(profile.description);
  const [twitter, setTwitter] = useState<string>(profile.twitter);
  const [discord, setDiscord] = useState<string>(profile.discord);
  const [telegram, setTelegram] = useState<string>(profile.telegram);
  const [error, setError] = useState<string>('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    onSave({ name, logo, description, twitter, discord, telegram });
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
          Edit {userType === 'brand' ? 'Brand' : 'Community'} Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="name">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="logo">
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://yourlogo.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe your brand or community"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="twitter">
              Twitter/X
            </label>
            <input
              id="twitter"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="@yourhandle"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="discord">
              Discord
            </label>
            <input
              id="discord"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="discord.gg/yourserver"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1" htmlFor="telegram">
              Telegram
            </label>
            <input
              id="telegram"
              type="text"
              className="w-full px-3 py-2 rounded bg-[#23262b] text-white border border-[#23262b] focus:outline-none focus:border-[#0052ff]"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="@yourtelegram"
            />
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
export default EditProfileModal;