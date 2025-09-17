'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useGirls, useDataEntries, useGlobalStats } from '@/lib/context';
import { formatCurrency, formatTime, getMonthlyTrends } from '@/lib/calculations';
import { AnalyticsShareButton } from '@/components/sharing/ShareButton';
import { getGirlColors, getColorByGirlName } from '@/lib/colors';

type TimeRange = '7' | '30' | '90' | 'all';

export default function AnalyticsPage() {
  const { girlsWithMetrics } = useGirls();
  const { dataEntries } = useDataEntries();
  const { globalStats, isLoading } = useGlobalStats();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const getFilteredEntries = () => {
    if (timeRange === 'all') return dataEntries;
    
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return dataEntries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const filteredEntries = getFilteredEntries();
  const monthlyTrends = getMonthlyTrends(filteredEntries);

  // Get active girls with data
  const activeGirls = girlsWithMetrics.filter(girl => girl.totalEntries > 0);

  // Get consistent colors for all girls
  const girlColorMap = getGirlColors(activeGirls.map(girl => girl.id));

  // Data for Total Spent per Girl chart
  const spentPerGirlData = activeGirls
    .map(girl => ({
      name: girl.name,
      amount: girl.metrics.totalSpent,
      nuts: girl.metrics.totalNuts,
      color: girlColorMap[girl.id]
    }))
    .sort((a, b) => b.amount - a.amount);

  // Data for Cost per Nut comparison
  const costPerNutData = activeGirls
    .map(girl => ({
      name: girl.name,
      costPerNut: girl.metrics.costPerNut,
      rating: girl.rating,
      color: girlColorMap[girl.id]
    }))
    .sort((a, b) => b.costPerNut - a.costPerNut);

  // Data for Time spent per girl
  const timePerGirlData = activeGirls
    .map(girl => ({
      name: girl.name,
      time: girl.metrics.totalTime,
      timeFormatted: formatTime(girl.metrics.totalTime),
      color: girlColorMap[girl.id]
    }))
    .sort((a, b) => b.time - a.time);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cpn-dark border border-cpn-gray/20 rounded-lg p-3 shadow-lg">
          <p className="text-cpn-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {
                entry.name.includes('amount') || entry.name.includes('cost') || entry.name.includes('Cost')
                  ? formatCurrency(entry.value)
                  : entry.name.includes('time') || entry.name.includes('Time')
                  ? formatTime(entry.value)
                  : entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-fade-in">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cpn-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-cpn-gray">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cpn-dark">
      {/* Header */}
      <div className="border-b border-cpn-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-heading text-cpn-white">Analytics</h1>
              <p className="text-cpn-gray mt-1">
                Insights and trends across all your data
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AnalyticsShareButton 
                data={{ globalStats, timeRange, filteredEntries }} 
                className="mr-2"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-cpn-gray">Time Range:</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="bg-cpn-dark border border-cpn-gray/30 text-cpn-white px-3 py-1 rounded-lg text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {girlsWithMetrics.length === 0 || filteredEntries.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-cpn-gray/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-heading text-cpn-white mb-2">
                No data to analyze yet
              </h3>
              <p className="text-cpn-gray mb-6 max-w-md mx-auto">
                Add some data entries to start seeing analytics and insights.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            {/* Analytics Reports Top Area - Metrics Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Top Row */}
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Total Spent</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {formatCurrency(globalStats.totalSpent)}
                </p>
              </div>
              
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Total Nuts</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {globalStats.totalNuts}
                </p>
              </div>
              
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Average Cost Per Nut</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {formatCurrency(globalStats.totalNuts > 0 ? globalStats.totalSpent / globalStats.totalNuts : 0)}
                </p>
              </div>
              
              {/* Bottom Row */}
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Total Time</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {formatTime(globalStats.totalTime)}
                </p>
              </div>
              
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Average Time Per Nut</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {globalStats.totalNuts > 0 ? Math.round(globalStats.totalTime / globalStats.totalNuts) : 0} mins
                </p>
              </div>
              
              <div className="bg-cpn-dark2 border border-cpn-gray/20 rounded-lg p-6">
                <h3 className="text-lg text-cpn-white font-heading mb-4">Average Cost Per Hour</h3>
                <p className="text-5xl font-bold text-cpn-white">
                  {formatCurrency(globalStats.totalTime > 0 ? globalStats.totalSpent / (globalStats.totalTime / 60) : 0)}
                </p>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="card-cpn">
              <h3 className="text-lg font-heading text-cpn-white mb-4">
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-cpn-gray/10 rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="text-sm text-cpn-gray mb-1">Best Cost/Nut</p>
                  <p className="font-heading text-cpn-yellow">
                    {costPerNutData[costPerNutData.length - 1]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-cpn-gray">
                    {costPerNutData[costPerNutData.length - 1]
                      ? formatCurrency(costPerNutData[costPerNutData.length - 1].costPerNut)
                      : 'No data'
                    }
                  </p>
                </div>
                <div className="text-center p-4 border border-cpn-gray/10 rounded-lg">
                  <div className="text-2xl mb-2">💸</div>
                  <p className="text-sm text-cpn-gray mb-1">Highest Spender</p>
                  <p className="font-heading text-cpn-yellow">
                    {spentPerGirlData[0]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-cpn-gray">
                    {spentPerGirlData[0]
                      ? formatCurrency(spentPerGirlData[0].amount)
                      : 'No data'
                    }
                  </p>
                </div>
                <div className="text-center p-4 border border-cpn-gray/10 rounded-lg">
                  <div className="text-2xl mb-2">⏰</div>
                  <p className="text-sm text-cpn-gray mb-1">Most Time Spent</p>
                  <p className="font-heading text-cpn-yellow">
                    {timePerGirlData[0]?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-cpn-gray">
                    {timePerGirlData[0]
                      ? formatTime(timePerGirlData[0].time)
                      : 'No data'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Color Legend */}
            {activeGirls.length > 1 && (
              <div className="card-cpn">
                <h3 className="text-lg font-heading text-cpn-white mb-4">
                  Color Legend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {activeGirls.map(girl => (
                    <div key={girl.id} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: girlColorMap[girl.id] }}
                      ></div>
                      <span className="text-sm text-cpn-white truncate">{girl.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-cpn-gray mt-3">
                  Each girl maintains the same color across all charts for easy identification
                </p>
              </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Total Spent per Girl */}
              <div className="card-cpn">
                <h3 className="text-lg font-heading text-cpn-white mb-4">
                  Total Spent per Girl
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spentPerGirlData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--cpn-gray) / 0.2)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                      />
                      <YAxis
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar
                        dataKey="amount"
                        radius={[4, 4, 0, 0]}
                      >
                        {spentPerGirlData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost per Nut Comparison */}
              <div className="card-cpn">
                <h3 className="text-lg font-heading text-cpn-white mb-4">
                  Cost per Nut Comparison
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costPerNutData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--cpn-gray) / 0.2)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                      />
                      <YAxis 
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar
                        dataKey="costPerNut"
                        radius={[4, 4, 0, 0]}
                      >
                        {costPerNutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time Spent per Girl */}
              <div className="card-cpn">
                <h3 className="text-lg font-heading text-cpn-white mb-4">
                  Time Spent per Girl
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timePerGirlData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--cpn-gray) / 0.2)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                      />
                      <YAxis 
                        tick={{ fill: '#ababab' }}
                        axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                        tickFormatter={(value) => `${Math.round(value / 60)}h`}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar
                        dataKey="time"
                        radius={[4, 4, 0, 0]}
                      >
                        {timePerGirlData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Spending Trends */}
              {monthlyTrends.length > 1 && (
                <div className="card-cpn">
                  <h3 className="text-lg font-heading text-cpn-white mb-4">
                    Monthly Spending Trends
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--cpn-gray) / 0.2)" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: '#ababab' }}
                          axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                        />
                        <YAxis 
                          tick={{ fill: '#ababab' }}
                          axisLine={{ stroke: 'rgb(var(--cpn-gray) / 0.2)' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="spent" 
                          stroke="rgb(var(--cpn-yellow))" 
                          strokeWidth={3}
                          dot={{ fill: 'rgb(var(--cpn-yellow))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}