'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PrivacySettings {
  leaderboardVisibility: 'public' | 'friends' | 'private';
  showRealName: boolean;
  showProfileStats: boolean;
  allowInvitations: boolean;
  shareAchievements: boolean;
  shareSpendingData: boolean;
  shareEfficiencyMetrics: boolean;
  shareActivityFrequency: boolean;
  anonymousMode: boolean;
}

const visibilityOptions = [
  {
    id: 'public' as const,
    name: 'Public',
    description: 'Visible to all leaderboards and users',
    icon: UserGroupIcon,
    color: 'text-green-400'
  },
  {
    id: 'friends' as const,
    name: 'Friends Only',
    description: 'Only visible in leaderboards you join',
    icon: EyeIcon,
    color: 'text-cpn-yellow'
  },
  {
    id: 'private' as const,
    name: 'Private',
    description: 'Hidden from all leaderboards',
    icon: EyeSlashIcon,
    color: 'text-red-400'
  }
];

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    leaderboardVisibility: 'friends',
    showRealName: false,
    showProfileStats: true,
    allowInvitations: true,
    shareAchievements: true,
    shareSpendingData: true,
    shareEfficiencyMetrics: true,
    shareActivityFrequency: false,
    anonymousMode: false
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('cpn_privacy_settings');
    if (savedSettings) {
      setPrivacySettings(JSON.parse(savedSettings));
    }
  }, []);

  const updatePrivacySettings = (updates: Partial<PrivacySettings>) => {
    const newSettings = { ...privacySettings, ...updates };
    setPrivacySettings(newSettings);
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('cpn_privacy_settings', JSON.stringify(privacySettings));
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = () => {
    const defaultSettings: PrivacySettings = {
      leaderboardVisibility: 'friends',
      showRealName: false,
      showProfileStats: true,
      allowInvitations: true,
      shareAchievements: true,
      shareSpendingData: true,
      shareEfficiencyMetrics: true,
      shareActivityFrequency: false,
      anonymousMode: false
    };
    setPrivacySettings(defaultSettings);
    setHasUnsavedChanges(true);
  };

  const getActiveLeaderboardsCount = () => {
    // This would typically come from the leaderboards context
    // For now, return a mock number
    return 3;
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
                <ShieldCheckIcon className="w-8 h-8 text-cpn-yellow" />
                <div>
                  <h1 className="text-3xl font-heading text-cpn-white">Privacy Settings</h1>
                  <p className="text-cpn-gray mt-1">
                    Control your visibility and data sharing in leaderboards
                  </p>
                </div>
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="bg-cpn-yellow/10 border border-cpn-yellow/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-cpn-yellow" />
                  <p className="text-cpn-yellow text-sm">
                    You have unsaved changes. Don't forget to save your settings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in space-y-8">
          
          {/* Current Status */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Privacy Status Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">
                  {getActiveLeaderboardsCount()}
                </div>
                <div className="text-sm text-cpn-gray">Active Leaderboards</div>
              </div>
              
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">
                  {privacySettings.leaderboardVisibility === 'public' ? 'Public' : 
                   privacySettings.leaderboardVisibility === 'friends' ? 'Friends' : 'Private'}
                </div>
                <div className="text-sm text-cpn-gray">Visibility Level</div>
              </div>
              
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">
                  {privacySettings.anonymousMode ? 'Anonymous' : 'Identified'}
                </div>
                <div className="text-sm text-cpn-gray">Profile Mode</div>
              </div>
            </div>
          </div>

          {/* Leaderboard Visibility */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <UserGroupIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Leaderboard Visibility</h2>
            </div>
            
            <div className="space-y-4">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = privacySettings.leaderboardVisibility === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => updatePrivacySettings({ leaderboardVisibility: option.id })}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      isSelected
                        ? 'border-cpn-yellow bg-cpn-yellow/10'
                        : 'border-cpn-gray/20 hover:border-cpn-gray/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-cpn-yellow' : option.color}`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-cpn-white">{option.name}</h3>
                        <p className="text-sm text-cpn-gray">{option.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-3 h-3 bg-cpn-yellow rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {privacySettings.leaderboardVisibility === 'public' && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-orange-400 font-medium">Public Visibility Warning</h4>
                    <p className="text-sm text-orange-300 mt-1">
                      Your profile and statistics will be visible to all users. Consider using "Friends Only" for better privacy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Information Sharing */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <ChartBarIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Profile Information Sharing</h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  key: 'showRealName',
                  title: 'Show Real Name',
                  description: 'Display your actual name instead of anonymous username',
                  risk: 'medium'
                },
                {
                  key: 'showProfileStats',
                  title: 'Show Profile Statistics',
                  description: 'Display your total girls, entries, and member duration',
                  risk: 'low'
                },
                {
                  key: 'allowInvitations',
                  title: 'Allow Leaderboard Invitations',
                  description: 'Other users can invite you to join their leaderboards',
                  risk: 'low'
                },
                {
                  key: 'shareAchievements',
                  title: 'Share Achievements',
                  description: 'Show your milestones and achievement badges',
                  risk: 'low'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-cpn-dark2/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-cpn-white">{setting.title}</h4>
                      {setting.risk === 'medium' && (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
                          Medium Risk
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-cpn-gray">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => updatePrivacySettings({ 
                      [setting.key]: !privacySettings[setting.key as keyof PrivacySettings] 
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                      privacySettings[setting.key as keyof PrivacySettings] ? 'bg-cpn-yellow' : 'bg-cpn-gray'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings[setting.key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sharing Granular Controls */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Data Sharing Controls</h2>
            
            <div className="space-y-4">
              {[
                {
                  key: 'shareSpendingData',
                  title: 'Share Spending Amounts',
                  description: 'Include your total spent amounts in leaderboard comparisons',
                  dependency: 'Required for cost-per-nut rankings'
                },
                {
                  key: 'shareEfficiencyMetrics',
                  title: 'Share Efficiency Metrics',
                  description: 'Include efficiency scores and cost-per-nut calculations',
                  dependency: 'Required for efficiency leaderboards'
                },
                {
                  key: 'shareActivityFrequency',
                  title: 'Share Activity Frequency',
                  description: 'Show how often you add data entries and activity patterns',
                  dependency: 'Optional for most leaderboards'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-start justify-between p-4 bg-cpn-dark2/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-cpn-white">{setting.title}</h4>
                    <p className="text-sm text-cpn-gray mb-1">{setting.description}</p>
                    <p className="text-xs text-cpn-gray/70">{setting.dependency}</p>
                  </div>
                  <button
                    onClick={() => updatePrivacySettings({ 
                      [setting.key]: !privacySettings[setting.key as keyof PrivacySettings] 
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                      privacySettings[setting.key as keyof PrivacySettings] ? 'bg-cpn-yellow' : 'bg-cpn-gray'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacySettings[setting.key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Anonymous Mode */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Anonymous Mode</h2>
            
            <div className="p-4 bg-cpn-dark2/30 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-cpn-white mb-2">Enable Anonymous Mode</h4>
                  <p className="text-sm text-cpn-gray mb-2">
                    Hide your identity completely. You'll appear as "Anonymous User" with randomized stats display.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-xs text-red-400">
                      This will override all other sharing settings
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => updatePrivacySettings({ anonymousMode: !privacySettings.anonymousMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                    privacySettings.anonymousMode ? 'bg-red-500' : 'bg-cpn-gray'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings.anonymousMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetToDefaults}
              className="flex-1 py-3 px-4 text-cpn-gray border border-cpn-gray/30 rounded-lg hover:text-cpn-white hover:border-cpn-gray transition-all duration-200"
            >
              Reset to Defaults
            </button>
            <button
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
              className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 ${
                hasUnsavedChanges
                  ? 'bg-cpn-yellow text-cpn-dark hover:bg-cpn-yellow/90'
                  : 'bg-cpn-gray/30 text-cpn-gray cursor-not-allowed'
              }`}
            >
              {hasUnsavedChanges ? 'Save Privacy Settings' : 'Settings Saved'}
            </button>
          </div>

          {/* Privacy Information */}
          <div className="text-center">
            <p className="text-cpn-gray text-sm leading-relaxed">
              Your privacy settings are stored locally on your device. 
              These settings control how your data appears in leaderboards and social features.
              <br />
              <span className="text-cpn-yellow">
                You can change these settings at any time.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}