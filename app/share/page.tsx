'use client';

import React, { useState } from 'react';
import { 
  ShareIcon, 
  PhotoIcon, 
  ClipboardDocumentIcon, 
  ArrowDownTrayIcon,
  LinkIcon,
  TrophyIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useShare } from '@/lib/share/ShareContext';
import { useGirls, useGlobalStats } from '@/lib/context';
import ShareButton, { GirlCardShareButton, AnalyticsShareButton, ComparisonShareButton } from '@/components/sharing/ShareButton';

export default function SharePage() {
  const { state, actions } = useShare();
  const { girlsWithMetrics } = useGirls();
  const { globalStats } = useGlobalStats();
  const [selectedGirl, setSelectedGirl] = useState<string | null>(null);

  const hasData = girlsWithMetrics.length > 0 && girlsWithMetrics.some(girl => girl.totalEntries > 0);
  const topGirl = girlsWithMetrics
    .filter(girl => girl.totalEntries > 0)
    .sort((a, b) => b.metrics.totalSpent - a.metrics.totalSpent)[0];

  const quickShareOptions = [
    {
      id: 'top-performer',
      title: 'Top Performer Card',
      description: 'Share your highest spending profile statistics',
      icon: TrophyIcon,
      color: 'text-yellow-500',
      available: !!topGirl,
      action: () => topGirl && actions.generateStatCard(topGirl, {
        format: 'image',
        destination: 'clipboard',
        privacy: state.preferences.defaultPrivacy
      })
    },
    {
      id: 'analytics-summary',
      title: 'Analytics Summary',
      description: 'Share your overall performance metrics',
      icon: ChartBarIcon,
      color: 'text-blue-500',
      available: hasData,
      action: () => actions.generateStatCard(globalStats, {
        format: 'image',
        destination: 'clipboard',
        privacy: state.preferences.defaultPrivacy
      })
    },
    {
      id: 'efficiency-comparison',
      title: 'Efficiency Report',
      description: 'Compare your performance to global averages',
      icon: UserGroupIcon,
      color: 'text-green-500',
      available: hasData,
      action: () => actions.generateComparisonReport(globalStats, {
        format: 'image',
        destination: 'clipboard',
        privacy: state.preferences.defaultPrivacy
      })
    }
  ];

  return (
    <div className="min-h-screen bg-cpn-dark">
      {/* Header */}
      <div className="border-b border-cpn-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-4">
              <ShareIcon className="w-8 h-8 text-cpn-yellow" />
              <div>
                <h1 className="text-3xl font-heading text-cpn-white">Share Center</h1>
                <p className="text-cpn-gray mt-1">
                  Share your achievements and insights with beautiful, privacy-respecting content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasData ? (
          // Empty State
          <div className="text-center py-16">
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-cpn-gray/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShareIcon className="w-8 h-8 text-cpn-gray" />
              </div>
              <h3 className="text-xl font-heading text-cpn-white mb-2">
                Nothing to share yet
              </h3>
              <p className="text-cpn-gray mb-6 max-w-md mx-auto">
                Add some data entries to start generating shareable content about your performance and achievements.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            {/* Quick Share Options */}
            <div className="card-cpn">
              <h2 className="text-xl font-heading text-cpn-white mb-4">Quick Share</h2>
              <p className="text-cpn-gray mb-6">Generate and share content with one click</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickShareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={option.action}
                      disabled={!option.available}
                      className={`p-6 rounded-lg border transition-all text-left ${
                        option.available
                          ? 'border-cpn-gray/30 hover:border-cpn-yellow/50 hover:bg-cpn-dark2/50'
                          : 'border-cpn-gray/10 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${option.color} mb-3`} />
                      <h3 className="font-heading text-cpn-white mb-2">{option.title}</h3>
                      <p className="text-sm text-cpn-gray">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Girl Cards */}
            <div className="card-cpn">
              <h2 className="text-xl font-heading text-cpn-white mb-4">Individual Statistics</h2>
              <p className="text-cpn-gray mb-6">Share specific profile performance</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {girlsWithMetrics
                  .filter(girl => girl.totalEntries > 0)
                  .map((girl) => (
                    <div
                      key={girl.id}
                      className="p-4 rounded-lg border border-cpn-gray/20 hover:border-cpn-yellow/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-heading text-cpn-white">{girl.name}</h3>
                          <p className="text-sm text-cpn-gray">Rating: {girl.rating}/10</p>
                        </div>
                        <GirlCardShareButton girl={girl} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-cpn-gray">Total Spent</p>
                          <p className="text-cpn-white font-medium">${girl.metrics.totalSpent.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-cpn-gray">Cost/Nut</p>
                          <p className="text-cpn-yellow font-medium">${girl.metrics.costPerNut.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Share History */}
            {state.history.length > 0 && (
              <div className="card-cpn">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-heading text-cpn-white">Recent Shares</h2>
                  <button
                    onClick={() => actions.toggleHistoryPanel(true)}
                    className="text-cpn-gray hover:text-cpn-white text-sm transition-colors"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {state.history.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-cpn-dark2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cpn-yellow/20 rounded-full flex items-center justify-center">
                          {entry.format === 'image' ? <PhotoIcon className="w-4 h-4 text-cpn-yellow" /> : 
                           entry.format === 'json' ? <ClipboardDocumentIcon className="w-4 h-4 text-cpn-yellow" /> :
                           <LinkIcon className="w-4 h-4 text-cpn-yellow" />}
                        </div>
                        <div>
                          <p className="text-sm text-cpn-white font-medium capitalize">{entry.type} Share</p>
                          <p className="text-xs text-cpn-gray">
                            {entry.format.toUpperCase()} • {entry.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${entry.expired ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <span className="text-xs text-cpn-gray">
                          {entry.expired ? 'Expired' : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="card-cpn bg-cpn-yellow/5 border-cpn-yellow/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-cpn-yellow/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-cpn-yellow text-sm">🔒</span>
                </div>
                <div>
                  <h3 className="font-medium text-cpn-white mb-1">Privacy First</h3>
                  <p className="text-sm text-cpn-gray">
                    All shareable content is generated locally on your device. You control exactly what information 
                    is included, and sensitive data can be automatically redacted or anonymized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}