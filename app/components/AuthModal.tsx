'use client';
import { useEffect } from 'react';
interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}
const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSuccess();
    }, 1200);
    return () => clearTimeout(timer);
  }, [onSuccess]);
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
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-[#0052ff] w-14 h-14 flex items-center justify-center mb-3">
            <span className="text-2xl font-extrabold text-white">D3</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sign in with Privy</h2>
          <p className="text-gray-300 mb-4 text-center">
            {'Authenticating...'}
          </p>
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0052ff]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthModal;