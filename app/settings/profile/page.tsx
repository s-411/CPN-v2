'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useGirls, useDataEntries } from '@/lib/context';

interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  accountCreated: Date;
  lastLogin: Date;
}

const defaultAvatars = [
  '👤', '🧑‍💼', '👨‍💻', '👩‍💻', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍🔬',
  '👨‍🔬', '👩‍🔬', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️'
];

export default function ProfilePage() {
  const { girls } = useGirls();
  const { dataEntries } = useDataEntries();
  const [profile, setProfile] = useState<UserProfile>({
    displayName: 'CPN User',
    avatarUrl: '👤',
    accountCreated: new Date('2024-01-01'),
    lastLogin: new Date()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('cpn_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        accountCreated: new Date(parsed.accountCreated),
        lastLogin: new Date(parsed.lastLogin)
      });
    }
  }, []);

  const saveProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('cpn_user_profile', JSON.stringify(updatedProfile));
  };

  const handleDisplayNameEdit = () => {
    setTempDisplayName(profile.displayName);
    setEditingField('displayName');
    setIsEditing(true);
  };

  const handleDisplayNameSave = () => {
    if (tempDisplayName.trim()) {
      saveProfile({ displayName: tempDisplayName.trim() });
    }
    setEditingField(null);
    setIsEditing(false);
  };

  const handleDisplayNameCancel = () => {
    setTempDisplayName('');
    setEditingField(null);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatar: string) => {
    saveProfile({ avatarUrl: avatar });
    setShowAvatarSelector(false);
  };

  const calculateMemberSince = () => {
    const now = new Date();
    const created = profile.accountCreated;
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  const calculateTotalSpent = () => {
    return dataEntries.reduce((sum, entry) => sum + entry.amountSpent, 0);
  };

  return (
    <div className="min-h-screen bg-cpn-dark">
      {/* Header */}
      <div className="border-b border-cpn-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/settings"
                className="p-2 text-cpn-gray hover:text-cpn-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <UserCircleIcon className="w-8 h-8 text-cpn-yellow" />
                <div>
                  <h1 className="text-3xl font-heading text-cpn-white">Profile Management</h1>
                  <p className="text-cpn-gray mt-1">
                    Manage your display name, avatar, and account information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in space-y-6">
          {/* Profile Information Card */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="relative group"
                  >
                    <div className="w-24 h-24 bg-cpn-dark2 border-2 border-cpn-gray/20 rounded-full flex items-center justify-center text-4xl group-hover:border-cpn-yellow/50 transition-colors">
                      {profile.avatarUrl}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PencilIcon className="w-6 h-6 text-white" />
                    </div>
                  </button>
                  
                  {showAvatarSelector && (
                    <div className="absolute z-10 mt-2 p-4 bg-cpn-dark2 border border-cpn-gray/20 rounded-lg shadow-lg">
                      <p className="text-sm text-cpn-gray mb-3">Choose your avatar:</p>
                      <div className="grid grid-cols-4 gap-2 max-w-xs">
                        {defaultAvatars.map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() => handleAvatarSelect(avatar)}
                            className="w-12 h-12 bg-cpn-dark border border-cpn-gray/20 rounded-lg flex items-center justify-center text-xl hover:border-cpn-yellow/50 transition-colors"
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {/* Display Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cpn-gray mb-2">
                      Display Name
                    </label>
                    {editingField === 'displayName' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempDisplayName}
                          onChange={(e) => setTempDisplayName(e.target.value)}
                          className="input-cpn flex-1"
                          placeholder="Enter your display name"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleDisplayNameSave()}
                        />
                        <button
                          onClick={handleDisplayNameSave}
                          className="p-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleDisplayNameCancel}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-cpn-white font-medium">{profile.displayName}</p>
                        <button
                          onClick={handleDisplayNameEdit}
                          className="p-1 text-cpn-gray hover:text-cpn-yellow transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Account Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cpn-gray mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center gap-2 text-cpn-white">
                        <CalendarIcon className="w-4 h-4 text-cpn-gray" />
                        <span>{calculateMemberSince()}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cpn-gray mb-1">
                        Account Created
                      </label>
                      <div className="flex items-center gap-2 text-cpn-white">
                        <CalendarIcon className="w-4 h-4 text-cpn-gray" />
                        <span>{profile.accountCreated.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics Card */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <ChartBarIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Account Statistics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-cpn-dark2/50 rounded-lg p-6">
                  <p className="text-3xl font-bold text-cpn-white mb-2">{girls.length}</p>
                  <p className="text-sm text-cpn-gray">Girls Tracked</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-cpn-dark2/50 rounded-lg p-6">
                  <p className="text-3xl font-bold text-cpn-white mb-2">{dataEntries.length}</p>
                  <p className="text-sm text-cpn-gray">Data Entries</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-cpn-dark2/50 rounded-lg p-6">
                  <p className="text-3xl font-bold text-cpn-white mb-2">
                    ${calculateTotalSpent().toFixed(2)}
                  </p>
                  <p className="text-sm text-cpn-gray">Total Spent</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-cpn-dark2/50 rounded-lg p-6">
                  <p className="text-3xl font-bold text-cpn-yellow mb-2">100%</p>
                  <p className="text-sm text-cpn-gray">Profile Complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Activity */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {dataEntries.slice(0, 5).map((entry, index) => {
                const girl = girls.find(g => g.id === entry.girlId);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-cpn-dark2/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cpn-yellow rounded-full"></div>
                      <div>
                        <p className="text-cpn-white font-medium">
                          Data entry for {girl?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-cpn-gray">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cpn-white font-medium">
                        ${entry.amountSpent.toFixed(2)}
                      </p>
                      <p className="text-sm text-cpn-gray">
                        {entry.numberOfNuts} nuts
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {dataEntries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-cpn-gray">No recent activity</p>
                  <Link 
                    href="/data-entry"
                    className="text-cpn-yellow hover:text-cpn-yellow/80 transition-colors text-sm mt-2 inline-block"
                  >
                    Add your first entry →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex gap-4">
            <Link
              href="/settings/privacy"
              className="btn-cpn flex-1 text-center"
            >
              Privacy Settings
            </Link>
            <Link
              href="/settings/data"
              className="flex-1 py-3 px-4 text-cpn-gray border border-cpn-gray/30 rounded-lg hover:text-cpn-white hover:border-cpn-gray transition-all duration-200 text-center"
            >
              Export Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}