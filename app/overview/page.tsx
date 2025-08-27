'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useGirls, useDataEntries } from '@/lib/context';
import { GirlWithMetrics, SortConfig } from '@/lib/types';
import { formatCurrency, formatTime, formatRating, sortGirlsByField } from '@/lib/calculations';

export default function OverviewPage() {
  const { girlsWithMetrics, deleteGirl } = useGirls();
  const { getEntriesByGirlId } = useDataEntries();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'name',
    direction: 'asc'
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteClick = (girlId: string) => {
    if (deleteConfirm === girlId) {
      deleteGirl(girlId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(girlId);
      // Auto-cancel confirmation after 5 seconds
      setTimeout(() => setDeleteConfirm(null), 5000);
    }
  };

  const sortedGirls = sortGirlsByField(girlsWithMetrics, sortConfig.field as any, sortConfig.direction);

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => {
    const isActive = sortConfig.field === field;
    const direction = sortConfig.direction;

    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover:text-cpn-yellow transition-colors"
      >
        {children}
        {isActive && (
          direction === 'asc' ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-cpn-dark">
      {/* Header */}
      <div className="border-b border-cpn-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-heading text-cpn-white">Overview</h1>
              <p className="text-cpn-gray mt-1">
                Comprehensive metrics for all your profiles
              </p>
            </div>
            <Link href="/girls" className="btn-cpn flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              Add New Girl
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {girlsWithMetrics.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="animate-fade-in">
              <div className="w-16 h-16 bg-cpn-gray/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlusIcon className="w-8 h-8 text-cpn-gray" />
              </div>
              <h3 className="text-xl font-heading text-cpn-white mb-2">
                No girls to display
              </h3>
              <p className="text-cpn-gray mb-6 max-w-md mx-auto">
                Add your first girl profile to start tracking and viewing comprehensive metrics.
              </p>
              <Link href="/girls" className="btn-cpn inline-flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Add Your First Girl
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="card-cpn overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="table-cpn">
                    <thead>
                      <tr>
                        <th>
                          <SortButton field="name">Name</SortButton>
                        </th>
                        <th>
                          <SortButton field="rating">Rating</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.totalNuts">Total Nuts</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.totalSpent">Total Spent</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.costPerNut">Cost per Nut</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.totalTime">Total Time</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.timePerNut">Time per Nut</SortButton>
                        </th>
                        <th>
                          <SortButton field="metrics.costPerHour">Cost per Hour</SortButton>
                        </th>
                        <th>Add Data</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedGirls.map((girl) => (
                        <tr key={girl.id}>
                          <td>
                            <div>
                              <div className="font-medium text-cpn-white">{girl.name}</div>
                              <div className="text-sm text-cpn-gray">
                                {girl.age} • {girl.nationality}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-cpn-yellow font-medium">
                              {formatRating(girl.rating)}
                            </span>
                          </td>
                          <td className="text-center font-medium">
                            {girl.metrics.totalNuts}
                          </td>
                          <td className="text-cpn-yellow font-medium">
                            {formatCurrency(girl.metrics.totalSpent)}
                          </td>
                          <td className="text-cpn-yellow font-bold">
                            {formatCurrency(girl.metrics.costPerNut)}
                          </td>
                          <td>
                            {formatTime(girl.metrics.totalTime)}
                          </td>
                          <td>
                            {girl.metrics.timePerNut > 0 ? `${Math.round(girl.metrics.timePerNut)}m` : '0m'}
                          </td>
                          <td className="text-cpn-yellow font-medium">
                            {formatCurrency(girl.metrics.costPerHour)}
                          </td>
                          <td>
                            <Link
                              href={`/girls/${girl.id}/add-data`}
                              className="inline-flex items-center gap-1 text-sm bg-cpn-yellow text-cpn-dark px-3 py-1 rounded-cpn hover:opacity-90 transition-opacity"
                            >
                              <PlusIcon className="w-4 h-4" />
                              Add
                            </Link>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => console.log('Edit:', girl)}
                                className="text-cpn-gray hover:text-cpn-yellow transition-colors p-1"
                                title="Edit girl"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(girl.id)}
                                className={`transition-colors p-1 ${
                                  deleteConfirm === girl.id
                                    ? 'text-red-400 hover:text-red-300'
                                    : 'text-cpn-gray hover:text-red-400'
                                }`}
                                title={deleteConfirm === girl.id ? 'Click again to confirm' : 'Delete girl'}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {sortedGirls.map((girl) => (
                <div key={girl.id} className="card-cpn">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-heading text-cpn-white">{girl.name}</h3>
                      <p className="text-sm text-cpn-gray">{girl.age} • {girl.nationality}</p>
                      <p className="text-sm text-cpn-yellow mt-1">{formatRating(girl.rating)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/girls/${girl.id}/add-data`}
                        className="btn-cpn text-sm px-3 py-1 flex items-center gap-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </Link>
                      <button
                        onClick={() => console.log('Edit:', girl)}
                        className="text-cpn-gray hover:text-cpn-yellow transition-colors p-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(girl.id)}
                        className={`transition-colors p-1 ${
                          deleteConfirm === girl.id
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-cpn-gray hover:text-red-400'
                        }`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-cpn-gray">Total Nuts</p>
                      <p className="font-medium text-cpn-white">{girl.metrics.totalNuts}</p>
                    </div>
                    <div>
                      <p className="text-cpn-gray">Total Spent</p>
                      <p className="font-medium text-cpn-yellow">
                        {formatCurrency(girl.metrics.totalSpent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-cpn-gray">Cost/Nut</p>
                      <p className="font-bold text-cpn-yellow">
                        {formatCurrency(girl.metrics.costPerNut)}
                      </p>
                    </div>
                    <div>
                      <p className="text-cpn-gray">Total Time</p>
                      <p className="font-medium text-cpn-white">
                        {formatTime(girl.metrics.totalTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-cpn-gray">Time/Nut</p>
                      <p className="font-medium text-cpn-white">
                        {girl.metrics.timePerNut > 0 ? `${Math.round(girl.metrics.timePerNut)}m` : '0m'}
                      </p>
                    </div>
                    <div>
                      <p className="text-cpn-gray">Cost/Hour</p>
                      <p className="font-medium text-cpn-yellow">
                        {formatCurrency(girl.metrics.costPerHour)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {deleteConfirm && (
              <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 md:right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 z-40">
                <p className="text-sm text-red-400">
                  Click the delete button again to permanently remove the girl and all associated data.
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-red-300 hover:text-red-200 ml-2 underline"
                  >
                    Cancel
                  </button>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}