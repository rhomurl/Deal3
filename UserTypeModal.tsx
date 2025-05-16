'use client';
import type { FC } from 'react';
interface UserTypeModalProps {
  onSelect: (type: 'brand' | 'community') => void;
  onClose: () => void;
}
const UserTypeModal: FC<UserTypeModalProps> = ({ onSelect, onClose }) => {
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {'Select your account type'}
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <button
            className="flex-1 bg-[#0052ff] hover:bg-blue-700 text-white font-semibold py-4 rounded-lg shadow transition text-lg"
            onClick={() => onSelect('brand')}
            aria-label="Select Brand"
          >
            {'Brand'}
            <div className="text-xs text-blue-100 mt-1 font-normal">
              {'I want to create campaigns'}
            </div>
          </button>
          <button
            className="flex-1 bg-[#23262b] hover:bg-[#2d3138] text-white font-semibold py-4 rounded-lg shadow transition text-lg"
            onClick={() => onSelect('community')}
            aria-label="Select Community"
          >
            {'Community'}
            <div className="text-xs text-gray-300 mt-1 font-normal">
              {'I want to discover and apply to campaigns'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserTypeModal;