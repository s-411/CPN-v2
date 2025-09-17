'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { useGirls, useDataEntries } from '@/lib/context';
import { formatCurrency } from '@/lib/calculations';

interface ExportOptions {
  includeGirls: boolean;
  includeDataEntries: boolean;
  includeCalculatedMetrics: boolean;
  includeSettings: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  format: 'csv' | 'json' | 'pdf';
}

export default function DataManagementPage() {
  const { girls } = useGirls();
  const { dataEntries } = useDataEntries();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeGirls: true,
    includeDataEntries: true,
    includeCalculatedMetrics: true,
    includeSettings: false,
    format: 'csv'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);

  const updateExportOptions = (updates: Partial<ExportOptions>) => {
    setExportOptions(prev => ({ ...prev, ...updates }));
  };

  const generateCSV = () => {
    let csvContent = '';
    
    if (exportOptions.includeGirls) {
      csvContent += 'Girls Data\n';
      csvContent += 'Name,Age,Nationality,Ethnicity,Hair Color,Rating,Created,Total Spent,Total Nuts,Cost Per Nut\n';
      
      girls.forEach(girl => {
        const girlEntries = dataEntries.filter(entry => entry.girlId === girl.id);
        const totalSpent = girlEntries.reduce((sum, entry) => sum + entry.amountSpent, 0);
        const totalNuts = girlEntries.reduce((sum, entry) => sum + entry.numberOfNuts, 0);
        const costPerNut = totalNuts > 0 ? totalSpent / totalNuts : 0;
        
        csvContent += `"${girl.name}",${girl.age},"${girl.nationality}","${girl.ethnicity || ''}","${girl.hairColor || ''}",${girl.rating},"${girl.createdAt}",${totalSpent},${totalNuts},${costPerNut}\n`;
      });
      csvContent += '\n';
    }

    if (exportOptions.includeDataEntries) {
      csvContent += 'Data Entries\n';
      csvContent += 'Girl Name,Date,Amount Spent,Duration (minutes),Number of Nuts,Cost Per Nut,Cost Per Hour\n';
      
      dataEntries.forEach(entry => {
        const girl = girls.find(g => g.id === entry.girlId);
        const costPerNut = entry.numberOfNuts > 0 ? entry.amountSpent / entry.numberOfNuts : 0;
        const costPerHour = entry.durationMinutes > 0 ? (entry.amountSpent / entry.durationMinutes) * 60 : 0;
        
        csvContent += `"${girl?.name || 'Unknown'}","${entry.date}",${entry.amountSpent},${entry.durationMinutes},${entry.numberOfNuts},${costPerNut},${costPerHour}\n`;
      });
    }

    return csvContent;
  };

  const generateJSON = () => {
    const exportData: any = {
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    if (exportOptions.includeGirls) {
      exportData.girls = girls.map(girl => ({
        ...girl,
        createdAt: girl.createdAt.toISOString(),
        updatedAt: girl.updatedAt.toISOString()
      }));
    }

    if (exportOptions.includeDataEntries) {
      exportData.dataEntries = dataEntries.map(entry => ({
        ...entry,
        date: entry.date instanceof Date ? entry.date.toISOString() : entry.date,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }));
    }

    if (exportOptions.includeCalculatedMetrics) {
      exportData.calculatedMetrics = girls.map(girl => {
        const girlEntries = dataEntries.filter(entry => entry.girlId === girl.id);
        const totalSpent = girlEntries.reduce((sum, entry) => sum + entry.amountSpent, 0);
        const totalNuts = girlEntries.reduce((sum, entry) => sum + entry.numberOfNuts, 0);
        const totalTime = girlEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
        
        return {
          girlId: girl.id,
          girlName: girl.name,
          totalSpent,
          totalNuts,
          totalTime,
          costPerNut: totalNuts > 0 ? totalSpent / totalNuts : 0,
          timePerNut: totalNuts > 0 ? totalTime / totalNuts : 0,
          costPerHour: totalTime > 0 ? (totalSpent / totalTime) * 60 : 0,
          entriesCount: girlEntries.length
        };
      });
    }

    if (exportOptions.includeSettings) {
      exportData.settings = {
        userProfile: JSON.parse(localStorage.getItem('cpn_user_profile') || '{}'),
        themeSettings: JSON.parse(localStorage.getItem('cpn_theme_settings') || '{}'),
        privacySettings: JSON.parse(localStorage.getItem('cpn_privacy_settings') || '{}'),
        notificationSettings: JSON.parse(localStorage.getItem('cpn_notification_settings') || '{}'),
        dateTimeSettings: JSON.parse(localStorage.getItem('cpn_datetime_settings') || '{}')
      };
    }

    return JSON.stringify(exportData, null, 2);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportOptions.format) {
        case 'csv':
          content = generateCSV();
          filename = `cpn-data-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON();
          filename = `cpn-backup-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          // PDF generation would require a library like jsPDF
          content = 'PDF export not yet implemented';
          filename = `cpn-report-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain';
          break;
        default:
          throw new Error('Invalid export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 5000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const calculateTotalSpent = () => {
    return dataEntries.reduce((sum, entry) => sum + entry.amountSpent, 0);
  };

  const handleDeleteAccount = () => {
    if (deleteStep === 1) {
      setDeleteStep(2);
    } else if (deleteStep === 2) {
      setDeleteStep(3);
    } else {
      // Final confirmation - delete all data
      localStorage.clear();
      alert('All data has been deleted. You will be redirected to the home page.');
      window.location.href = '/';
    }
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
                <DocumentArrowDownIcon className="w-8 h-8 text-cpn-yellow" />
                <div>
                  <h1 className="text-3xl font-heading text-cpn-white">Data Management</h1>
                  <p className="text-cpn-gray mt-1">
                    Export your data, create backups, and manage account deletion
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
          
          {/* Data Overview */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <FolderIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Your Data Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">{girls.length}</div>
                <div className="text-sm text-cpn-gray">Girls Tracked</div>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">{dataEntries.length}</div>
                <div className="text-sm text-cpn-gray">Data Entries</div>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">
                  {formatCurrency(calculateTotalSpent())}
                </div>
                <div className="text-sm text-cpn-gray">Total Spent</div>
              </div>
              <div className="bg-cpn-dark2/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cpn-white mb-1">
                  {Math.round((JSON.stringify({ girls, dataEntries }).length / 1024))}KB
                </div>
                <div className="text-sm text-cpn-gray">Data Size</div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="card-cpn">
            <h2 className="text-xl font-heading text-cpn-white mb-6">Export Your Data</h2>
            
            {/* Export Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-cpn-white mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { format: 'csv', name: 'CSV', description: 'Spreadsheet compatible' },
                  { format: 'json', name: 'JSON', description: 'Complete backup format' },
                  { format: 'pdf', name: 'PDF', description: 'Formatted report (coming soon)' }
                ].map((option) => (
                  <button
                    key={option.format}
                    onClick={() => updateExportOptions({ format: option.format as any })}
                    disabled={option.format === 'pdf'}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      exportOptions.format === option.format && option.format !== 'pdf'
                        ? 'border-cpn-yellow bg-cpn-yellow/10'
                        : option.format === 'pdf'
                        ? 'border-cpn-gray/10 bg-cpn-gray/5 cursor-not-allowed opacity-50'
                        : 'border-cpn-gray/20 hover:border-cpn-gray/40'
                    }`}
                  >
                    <div className="font-medium text-cpn-white">{option.name}</div>
                    <div className="text-sm text-cpn-gray">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-cpn-white mb-3">
                What to Include
              </label>
              <div className="space-y-3">
                {[
                  {
                    key: 'includeGirls',
                    title: 'Girls Data',
                    description: `All ${girls.length} girl profiles with ratings and details`
                  },
                  {
                    key: 'includeDataEntries',
                    title: 'Data Entries',
                    description: `All ${dataEntries.length} entries with spending and activity data`
                  },
                  {
                    key: 'includeCalculatedMetrics',
                    title: 'Calculated Metrics',
                    description: 'Cost per nut, efficiency scores, and summary statistics'
                  },
                  {
                    key: 'includeSettings',
                    title: 'App Settings',
                    description: 'Theme preferences, privacy settings, and app configuration'
                  }
                ].map((option) => (
                  <div key={option.key} className="flex items-center justify-between p-4 bg-cpn-dark2/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-cpn-white">{option.title}</h4>
                      <p className="text-sm text-cpn-gray">{option.description}</p>
                    </div>
                    <button
                      onClick={() => updateExportOptions({ 
                        [option.key]: !exportOptions[option.key as keyof ExportOptions] 
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        exportOptions[option.key as keyof ExportOptions] ? 'bg-cpn-yellow' : 'bg-cpn-gray'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          exportOptions[option.key as keyof ExportOptions] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting || exportComplete}
                className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isExporting
                    ? 'bg-cpn-gray/30 text-cpn-gray cursor-not-allowed'
                    : exportComplete
                    ? 'bg-green-500 text-white'
                    : 'bg-cpn-yellow text-cpn-dark hover:bg-cpn-yellow/90'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isExporting ? (
                    <>
                      <ClockIcon className="w-5 h-5 animate-spin" />
                      Exporting...
                    </>
                  ) : exportComplete ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Export Complete!
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      Export Data
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="card-cpn">
            <div className="flex items-center gap-3 mb-6">
              <DocumentDuplicateIcon className="w-6 h-6 text-cpn-yellow" />
              <h2 className="text-xl font-heading text-cpn-white">Backup & Restore</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-cpn-dark2/30 rounded-lg">
                <h4 className="font-medium text-cpn-white mb-2">Create Full Backup</h4>
                <p className="text-sm text-cpn-gray mb-4">
                  Download a complete backup of all your data, settings, and preferences in JSON format.
                </p>
                <button
                  onClick={() => {
                    updateExportOptions({
                      includeGirls: true,
                      includeDataEntries: true,
                      includeCalculatedMetrics: true,
                      includeSettings: true,
                      format: 'json'
                    });
                    handleExport();
                  }}
                  className="btn-cpn"
                >
                  Create Backup
                </button>
              </div>

              <div className="p-4 bg-cpn-dark2/30 rounded-lg opacity-60">
                <h4 className="font-medium text-cpn-white mb-2">Restore from Backup</h4>
                <p className="text-sm text-cpn-gray mb-4">
                  Restore your data from a previously created backup file. (Coming soon)
                </p>
                <button
                  disabled
                  className="py-2 px-4 bg-cpn-gray/30 text-cpn-gray rounded-lg cursor-not-allowed"
                >
                  Restore Backup
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone - Account Deletion */}
          <div className="card-cpn border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-heading text-red-400">Danger Zone</h2>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="font-medium text-red-400 mb-2">Delete All Data</h4>
              <p className="text-sm text-red-300 mb-4">
                This will permanently delete all your data, including girls, entries, settings, and preferences. 
                This action cannot be undone.
              </p>
              
              {!showDeleteConfirmation ? (
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="py-2 px-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <TrashIcon className="w-4 h-4 inline mr-2" />
                  Delete All Data
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-red-300">
                    {deleteStep === 1 && 'Are you sure you want to delete all your data?'}
                    {deleteStep === 2 && 'This action is permanent and cannot be undone. Continue?'}
                    {deleteStep === 3 && 'Final confirmation: Delete all data permanently?'}
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setDeleteStep(1);
                      }}
                      className="py-2 px-4 text-cpn-gray border border-cpn-gray/30 rounded-lg hover:text-cpn-white hover:border-cpn-gray transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className={`py-2 px-4 rounded-lg transition-colors ${
                        deleteStep === 3
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {deleteStep === 1 && 'Yes, Delete Data'}
                      {deleteStep === 2 && 'Confirm Deletion'}
                      {deleteStep === 3 && 'PERMANENTLY DELETE'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data Information */}
          <div className="text-center">
            <p className="text-cpn-gray text-sm leading-relaxed">
              All your data is stored locally on your device for privacy and security.
              <br />
              Exports are generated client-side and never sent to external servers.
              <br />
              <span className="text-cpn-yellow">
                We recommend creating regular backups of your data.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}