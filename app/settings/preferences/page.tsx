'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PaintBrushIcon,
  ArrowLeftIcon,
  BellIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface ThemeSettings {
  theme: 'dark' | 'darker' | 'midnight';
  accentColor: 'yellow' | 'blue' | 'green' | 'red';
  compactMode: boolean;
  animationsEnabled: boolean;
}

interface DateTimeSettings {
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  weekStart: 'sunday' | 'monday';
}

interface NotificationSettings {
  leaderboardUpdates: boolean;
  achievementUnlocks: boolean;
  weeklySummaries: boolean;
  monthlySummaries: boolean;
  emailNotifications: boolean;
}

const themeOptions = [
  {
    id: 'dark' as const,
    name: 'Default Dark',
    description: 'Current CPN dark theme',
    preview: 'bg-cpn-dark'
  },
  {
    id: 'darker' as const,
    name: 'Darker Mode',
    description: 'Deeper blacks for OLED displays',
    preview: 'bg-black'
  },
  {
    id: 'midnight' as const,
    name: 'Midnight Blue',
    description: 'Dark blue variant',
    preview: 'bg-blue-950'
  }
];

const accentColorOptions = [
  { id: 'yellow' as const, name: 'CPN Yellow', color: 'bg-cpn-yellow' },
  { id: 'blue' as const, name: 'Ocean Blue', color: 'bg-blue-500' },
  { id: 'green' as const, name: 'Forest Green', color: 'bg-green-500' },
  { id: 'red' as const, name: 'Crimson Red', color: 'bg-red-500' }
];

export default function PreferencesPage() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    theme: 'dark',
    accentColor: 'yellow',
    compactMode: false,
    animationsEnabled: true
  });

  const [dateTimeSettings, setDateTimeSettings] = useState<DateTimeSettings>({
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStart: 'monday'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    leaderboardUpdates: true,
    achievementUnlocks: true,
    weeklySummaries: true,
    monthlySummaries: true,
    emailNotifications: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('cpn_theme_settings');
    if (savedTheme) {
      setThemeSettings(JSON.parse(savedTheme));
    }

    const savedDateTime = localStorage.getItem('cpn_datetime_settings');
    if (savedDateTime) {
      setDateTimeSettings(JSON.parse(savedDateTime));
    }

    const savedNotifications = localStorage.getItem('cpn_notification_settings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, []);

  const updateThemeSettings = (updates: Partial<ThemeSettings>) => {
    const newSettings = { ...themeSettings, ...updates };
    setThemeSettings(newSettings);
    localStorage.setItem('cpn_theme_settings', JSON.stringify(newSettings));
  };

  const updateDateTimeSettings = (updates: Partial<DateTimeSettings>) => {
    const newSettings = { ...dateTimeSettings, ...updates };
    setDateTimeSettings(newSettings);
    localStorage.setItem('cpn_datetime_settings', JSON.stringify(newSettings));
  };

  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    const newSettings = { ...notificationSettings, ...updates };
    setNotificationSettings(newSettings);
    localStorage.setItem('cpn_notification_settings', JSON.stringify(newSettings));
  };

  const formatDateExample = (format: string) => {
    const now = new Date();
    switch (format) {
      case 'MM/DD/YYYY':
        return now.toLocaleDateString('en-US');
      case 'DD/MM/YYYY':
        return now.toLocaleDateString('en-GB');
      case 'YYYY-MM-DD':
        return now.toISOString().split('T')[0];
      default:
        return now.toLocaleDateString();
    }
  };

  const formatTimeExample = (format: string) => {
    const now = new Date();
    return format === '12h' 
      ? now.toLocaleTimeString('en-US', { hour12: true })
      : now.toLocaleTimeString('en-GB', { hour12: false });
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
                className="p-2 text-cpn-gray hover:text-cpn-white transition-colors cursor-pointer"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <PaintBrushIcon className="w-8 h-8 text-cpn-yellow" />
                <div>
                  <h1 className="text-3xl font-heading text-cpn-white">Display Preferences</h1>
                  <p className="text-cpn-gray mt-1">
                    Customize themes, formats, and notification settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in space-y-8">
          

          {/* Date & Time Formats */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <ClockIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Date & Time Format</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-cpn-white mb-3">
                  Date Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => (
                    <button
                      key={format}
                      onClick={() => updateDateTimeSettings({ dateFormat: format as any })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        dateTimeSettings.dateFormat === format
                          ? 'border-cpn-yellow bg-cpn-yellow/10'
                          : 'border-cpn-gray/20 hover:border-cpn-gray/40'
                      }`}
                    >
                      <div className="text-cpn-white font-medium">{format}</div>
                      <div className="text-sm text-cpn-gray">{formatDateExample(format)}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cpn-white mb-3">
                  Time Format
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { format: '12h', label: '12-hour', example: formatTimeExample('12h') },
                    { format: '24h', label: '24-hour', example: formatTimeExample('24h') }
                  ].map((time) => (
                    <button
                      key={time.format}
                      onClick={() => updateDateTimeSettings({ timeFormat: time.format as any })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        dateTimeSettings.timeFormat === time.format
                          ? 'border-cpn-yellow bg-cpn-yellow/10'
                          : 'border-cpn-gray/20 hover:border-cpn-gray/40'
                      }`}
                    >
                      <div className="text-cpn-white font-medium">{time.label}</div>
                      <div className="text-sm text-cpn-gray">{time.example}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cpn-white mb-3">
                  Week Starts On
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { value: 'monday', label: 'Monday' },
                    { value: 'sunday', label: 'Sunday' }
                  ].map((day) => (
                    <button
                      key={day.value}
                      onClick={() => updateDateTimeSettings({ weekStart: day.value as any })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        dateTimeSettings.weekStart === day.value
                          ? 'border-cpn-yellow bg-cpn-yellow/10'
                          : 'border-cpn-gray/20 hover:border-cpn-gray/40'
                      }`}
                    >
                      <div className="text-cpn-white font-medium">{day.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  key: 'leaderboardUpdates',
                  title: 'Leaderboard Updates',
                  description: 'Position changes and new member notifications'
                },
                {
                  key: 'achievementUnlocks',
                  title: 'Achievement Unlocks',
                  description: 'Notifications when you reach new milestones'
                },
                {
                  key: 'weeklySummaries',
                  title: 'Weekly Summaries',
                  description: 'Weekly activity and performance reports'
                },
                {
                  key: 'monthlySummaries',
                  title: 'Monthly Summaries',
                  description: 'Monthly spending and efficiency reports'
                },
                {
                  key: 'emailNotifications',
                  title: 'Email Notifications',
                  description: 'Receive notifications via email (future feature)'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-cpn-dark2/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-cpn-white">{setting.title}</h4>
                    <p className="text-sm text-cpn-gray">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => updateNotificationSettings({ 
                      [setting.key]: !notificationSettings[setting.key as keyof NotificationSettings] 
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationSettings[setting.key as keyof NotificationSettings] ? 'bg-cpn-yellow' : 'bg-cpn-gray'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings[setting.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                // Reset to defaults
                updateDateTimeSettings({
                  dateFormat: 'MM/DD/YYYY',
                  timeFormat: '12h',
                  weekStart: 'monday'
                });
              }}
              className="flex-1 py-3 px-4 text-cpn-gray border border-cpn-gray/30 rounded-lg hover:text-cpn-white hover:border-cpn-gray transition-all duration-200 text-center cursor-pointer"
            >
              Reset to Defaults
            </button>
            <Link
              href="/settings"
              className="btn-cpn flex-1 text-center"
            >
              Back to Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}