import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from old password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the change password endpoint
      await api.post('/users/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password changed successfully! Redirecting...');
      
      // Clear form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      console.error('Change password error:', err);
      const message = err.response?.data?.message || 
                     err.response?.data?.error ||
                     'Failed to change password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
  
      <div className="max-w-md mx-auto relative z-10">
        {/* Back to Dashboard Button */}
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
  
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header with Icon */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Change Password
            </h2>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Enter your current password and choose a new one
            </p>
          </div>
  
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3 shadow-lg animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}
  
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3 shadow-lg animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}
  
          {/* Form */}
          <div className="space-y-5">
            {/* Old Password */}
            <div className="group">
              <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your current password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
  
            {/* New Password */}
            <div className="group">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter new password (min. 6 characters)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
  
            {/* Confirm New Password */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
  
            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-lg text-sm font-semibold text-gray-700 bg-white/80 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                Cancel
              </button>
  
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    Change Password
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
  
          {/* Security Note */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <strong className="font-semibold">Security tip:</strong> Choose a strong password with a mix of letters, numbers, and special characters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;