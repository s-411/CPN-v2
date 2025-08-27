import React from 'react';

export default function SharePage() {
  return (
    <div className="min-h-screen bg-cpn-dark flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">📤</div>
        <h1 className="text-2xl font-heading text-cpn-white mb-2">Share</h1>
        <p className="text-cpn-gray mb-4">Coming soon in a future update</p>
        <div className="bg-cpn-gray/10 rounded-lg p-4 max-w-md">
          <p className="text-sm text-cpn-gray">
            This feature will allow you to export data, share statistics, and compare with friends.
          </p>
        </div>
      </div>
    </div>
  );
}