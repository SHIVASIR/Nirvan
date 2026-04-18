import React, { useState } from 'react';
import { X, Users, Copy, Check, Gift, Share2 } from 'lucide-react';
import { User } from '../types';

interface ReferralModalProps {
  user: User;
  onClose: () => void;
  onReferralComplete: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ user, onClose, onReferralComplete }) => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const referralCode = `NM${user.id.slice(-6).toUpperCase()}`;
  const referralLink = `https://nirmaan.gov.in/join?ref=${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onReferralComplete();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 mr-3">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Refer Friends</h2>
              <p className="text-sm text-gray-600">Earn 200 points for each referral!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Referral Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Your Referral Code</p>
                <p className="text-lg font-bold text-purple-600">{referralCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Potential Earnings</p>
                <p className="text-lg font-bold text-green-600">+200 points</p>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Your Referral Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs mt-1">Link copied to clipboard!</p>
            )}
          </div>

          {/* Send Invite */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Direct Invite
            </label>
            <form onSubmit={handleSendInvite} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Send Invite
                  </>
                )}
              </button>
            </form>
          </div>

          {/* How it Works */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Share your referral link or code with friends</li>
              <li>• They sign up using your link/code</li>
              <li>• You both earn 200 points when they complete their profile</li>
              <li>• No limit on referrals - keep earning!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;