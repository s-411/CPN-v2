import { Girl, DataEntry, CalculatedMetrics, GirlWithMetrics, GlobalStats } from './types';

export function calculateMetricsForGirl(entries: DataEntry[]): CalculatedMetrics {
  if (entries.length === 0) {
    return {
      totalSpent: 0,
      totalNuts: 0,
      totalTime: 0,
      costPerNut: 0,
      timePerNut: 0,
      costPerHour: 0
    };
  }

  const totalSpent = entries.reduce((sum, entry) => sum + entry.amountSpent, 0);
  const totalNuts = entries.reduce((sum, entry) => sum + entry.numberOfNuts, 0);
  const totalTime = entries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

  const costPerNut = totalNuts > 0 ? totalSpent / totalNuts : 0;
  const timePerNut = totalNuts > 0 ? totalTime / totalNuts : 0;
  const costPerHour = totalTime > 0 ? (totalSpent / totalTime) * 60 : 0;

  return {
    totalSpent: Math.round(totalSpent * 100) / 100, // Round to 2 decimal places
    totalNuts,
    totalTime,
    costPerNut: Math.round(costPerNut * 100) / 100,
    timePerNut: Math.round(timePerNut * 100) / 100,
    costPerHour: Math.round(costPerHour * 100) / 100
  };
}

export function createGirlWithMetrics(girl: Girl, entries: DataEntry[]): GirlWithMetrics {
  return {
    ...girl,
    metrics: calculateMetricsForGirl(entries),
    totalEntries: entries.length
  };
}

export function calculateGlobalStats(girls: Girl[], allEntries: DataEntry[]): GlobalStats {
  const totalGirls = girls.length;
  const activeGirls = girls.filter(girl => 
    allEntries.some(entry => entry.girlId === girl.id)
  ).length;

  const totalSpent = allEntries.reduce((sum, entry) => sum + entry.amountSpent, 0);
  const totalNuts = allEntries.reduce((sum, entry) => sum + entry.numberOfNuts, 0);
  const totalTime = allEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
  
  const averageRating = girls.length > 0 
    ? girls.reduce((sum, girl) => sum + girl.rating, 0) / girls.length 
    : 0;

  return {
    totalGirls,
    activeGirls,
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalNuts,
    totalTime,
    averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
  };
}

// Utility functions for formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function formatTimeDetailed(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
}

export function formatRating(rating: number): string {
  return `★${rating}/10`;
}

// Sorting functions
export function sortGirlsByField<T extends GirlWithMetrics>(
  girls: T[], 
  field: keyof GirlWithMetrics | keyof CalculatedMetrics, 
  direction: 'asc' | 'desc'
): T[] {
  return [...girls].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Handle nested metrics fields
    if (field.startsWith('metrics.')) {
      const metricField = field.replace('metrics.', '') as keyof CalculatedMetrics;
      aValue = a.metrics[metricField];
      bValue = b.metrics[metricField];
    } else {
      aValue = a[field as keyof GirlWithMetrics];
      bValue = b[field as keyof GirlWithMetrics];
    }

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return direction === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });
}

// Data analysis functions
export function getTopPerformers(girls: GirlWithMetrics[], metric: keyof CalculatedMetrics, count: number = 5) {
  return [...girls]
    .filter(girl => girl.totalEntries > 0)
    .sort((a, b) => {
      const aValue = a.metrics[metric];
      const bValue = b.metrics[metric];
      return typeof aValue === 'number' && typeof bValue === 'number' ? bValue - aValue : 0;
    })
    .slice(0, count);
}

export function getRecentActivity(entries: DataEntry[], days: number = 7): DataEntry[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return entries
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getMonthlyTrends(entries: DataEntry[]) {
  const monthlyData = new Map<string, {
    spent: number;
    nuts: number;
    time: number;
    entries: number;
  }>();

  entries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { spent: 0, nuts: 0, time: 0, entries: 0 });
    }
    
    const monthData = monthlyData.get(monthKey)!;
    monthData.spent += entry.amountSpent;
    monthData.nuts += entry.numberOfNuts;
    monthData.time += entry.durationMinutes;
    monthData.entries += 1;
  });

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      ...data,
      costPerNut: data.nuts > 0 ? data.spent / data.nuts : 0,
      costPerHour: data.time > 0 ? (data.spent / data.time) * 60 : 0
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}