import React from 'react';

export default function RecommendationResult({ result }) {
  if (result.error) {
    return <div className="text-red-600 mt-4">{result.error}</div>;
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow text-lg">
      <h2 className="font-bold text-2xl mb-2 text-sky-700">Best Provider</h2>
      <p>
        <span className="font-semibold">Provider:</span> {result.Provider}
      </p>
      <p>
        <span className="font-semibold">Total Cost:</span>{' '}
        {typeof result.Total_Cost === 'number' ? result.Total_Cost.toLocaleString(undefined, { maximumFractionDigits: 2 }) : result.Total_Cost}
      </p>
      <p>
        <span className="font-semibold">Speed (hours):</span> {result.Avg_Speed_Hours}hrs
      </p>
    </div>
  );
}
