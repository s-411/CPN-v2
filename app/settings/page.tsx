'use client';

import React from 'react';
import Link from 'next/link';
import {
  UserCircleIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface SettingsSection {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: 'profile' | 'preferences' | 'privacy' | 'data';
  available: boolean;
}

const settingsSections: SettingsSection[] = [
  {
    title: 'Profile Management',
    description: 'Manage your display name, avatar, and account statistics',
    icon: UserCircleIcon,
    href: '/settings/profile',
    category: 'profile',
    available: true
  },
  {
    title: 'Display Preferences',
    description: 'Customize themes, date formats, and visual settings',
    icon: PaintBrushIcon,
    href: '/settings/preferences',
    category: 'preferences',
    available: true
  },
  {
    title: 'Privacy & Leaderboards',
    description: 'Control your visibility and data sharing in leaderboards',
    icon: ShieldCheckIcon,
    href: '/settings/privacy',
    category: 'privacy',
    available: true
  },
  {
    title: 'Data Management',
    description: 'Export your data, create backups, and manage account deletion',
    icon: DocumentArrowDownIcon,
    href: '/settings/data',
    category: 'data',
    available: true
  },
  {
    title: 'Notifications',
    description: 'Configure alerts for leaderboards, achievements, and summaries',
    icon: BellIcon,
    href: '/settings/preferences',
    category: 'preferences',
    available: true
  }
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-cpn-dark">
      {/* Header */}
      <div className="border-b border-cpn-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCircleIcon className="w-8 h-8 text-cpn-yellow" />
              <div>
                <h1 className="text-3xl font-heading text-cpn-white">Settings</h1>
                <p className="text-cpn-gray mt-1">
                  Customize your CPN experience and manage your account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {/* Quick Stats Card */}
          <div className="card-cpn mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading text-cpn-white">Account Overview</h2>
              <Link 
                href="/settings/profile"
                className="text-cpn-yellow hover:text-cpn-yellow/80 transition-colors text-sm"
              >
                Manage Profile →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cpn-white">--</p>
                <p className="text-sm text-cpn-gray">Girls Tracked</p>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cpn-white">--</p>
                <p className="text-sm text-cpn-gray">Data Entries</p>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cpn-white">--</p>
                <p className="text-sm text-cpn-gray">Days Active</p>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cpn-yellow">100%</p>
                <p className="text-sm text-cpn-gray">Profile Complete</p>
              </div>
            </div>
          </div>

          {/* Settings Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              
              return (
                <Link
                  key={section.title}
                  href={section.available ? section.href : '#'}
                  className={`block ${section.available 
                    ? 'hover:border-cpn-yellow/30 hover:shadow-lg cursor-pointer' 
                    : 'cursor-not-allowed opacity-60'
                  } transition-all duration-200`}
                >
                  <div className="card-cpn h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          section.available 
                            ? 'bg-cpn-yellow/10 text-cpn-yellow' 
                            : 'bg-cpn-gray/10 text-cpn-gray'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-heading text-cpn-white">
                            {section.title}
                          </h3>
                          {section.available && (
                            <ArrowRightIcon className="w-5 h-5 text-cpn-gray group-hover:text-cpn-yellow transition-colors" />
                          )}
                        </div>
                        
                        <p className="text-cpn-gray text-sm mt-1 leading-relaxed">
                          {section.description}
                        </p>
                        
                        {section.category === 'data' && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-cpn-yellow/20 text-cpn-yellow">
                              Export Ready
                            </span>
                          </div>
                        )}
                        
                        {section.category === 'privacy' && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                              Secure
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 card-cpn">
            <h3 className="text-lg font-heading text-cpn-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/settings/data"
                className="p-4 bg-cpn-dark2/30 border border-cpn-gray/20 rounded-lg hover:border-cpn-yellow/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <DocumentArrowDownIcon className="w-5 h-5 text-cpn-gray group-hover:text-cpn-yellow transition-colors" />
                  <div>
                    <p className="text-cpn-white font-medium text-sm">Export Data</p>
                    <p className="text-cpn-gray text-xs">Download CSV or JSON</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/settings/preferences"
                className="p-4 bg-cpn-dark2/30 border border-cpn-gray/20 rounded-lg hover:border-cpn-yellow/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PaintBrushIcon className="w-5 h-5 text-cpn-gray group-hover:text-cpn-yellow transition-colors" />
                  <div>
                    <p className="text-cpn-white font-medium text-sm">Change Theme</p>
                    <p className="text-cpn-gray text-xs">Dark mode variations</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/settings/privacy"
                className="p-4 bg-cpn-dark2/30 border border-cpn-gray/20 rounded-lg hover:border-cpn-yellow/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-cpn-gray group-hover:text-cpn-yellow transition-colors" />
                  <div>
                    <p className="text-cpn-white font-medium text-sm">Privacy Settings</p>
                    <p className="text-cpn-gray text-xs">Leaderboard visibility</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Help & Support */}
          <div className="mt-8 text-center">
            <p className="text-cpn-gray text-sm">
              Need help with your settings? All data is stored locally on your device for privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}