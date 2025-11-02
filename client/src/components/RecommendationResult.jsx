import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Award, CheckCircle, Share2, Check } from 'lucide-react';

const CURRENCY_SYMBOLS = {
  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$', 'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥',
  'NGN': '₦', 'KES': 'KSh', 'GHS': '₵', 'ZAR': 'R', 'INR': '₹', 'BRL': 'R$', 'MXN': '$',
  'SGD': 'S$', 'HKD': 'HK$', 'NZD': 'NZ$', 'SEK': 'kr', 'NOK': 'kr',
};

export default function RecommendationResult({ result, destCurrency = 'USD' }) {
  const [copied, setCopied] = useState(false);

  if (result?.error) {
    return (
      <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center">
          <div className="text-red-600 text-lg font-medium">{result.error}</div>
        </div>
      </div>
    );
  }

  if (!result || !result.best) {
    return (
      <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="text-yellow-800 text-lg font-medium">
          No recommendation data available. Please try submitting the form again.
        </div>
      </div>
    );
  }

  const { best, providers = [], summary = {} } = result;
  const sourceCurrency = best.Source_Currency || 'USD';
  const resultDestCurrency = best.Dest_Currency || destCurrency;

  const validProviders = Array.isArray(providers) ? providers.filter(p => p && p.Provider && typeof p.Total_Cost === 'number') : [];

  const chartData = validProviders.map(provider => ({
    name: (provider.Provider || 'Unknown').substring(0, 12),
    cost: Number(provider.Total_Cost || 0),
    speed: Number(provider.Avg_Speed_Hours || 0),
    fees: Number(provider.Fees || 0)
  })).sort((a, b) => a.cost - b.cost);

  const baselineCost = summary.baseline_cost || (validProviders.length > 0 ? Math.max(...validProviders.map(p => Number(p.Total_Cost || 0))) : 0);
  const bestCost = Number(best.Total_Cost || 0);
  const savings = baselineCost - bestCost;
  const savingsPercentage = baselineCost > 0 ? ((savings / baselineCost) * 100) : 0;

  const getCurrencySymbol = (currencyCode) => {
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  };

  const formatCurrency = (amount, currency = resultDestCurrency) => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${getCurrencySymbol(currency)}0.00`;

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      const symbol = getCurrencySymbol(currency);
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const formatTime = (hours) => {
    if (!hours || typeof hours !== 'number') return 'N/A';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const shareResults = async () => {
    const shareText = `Payment Comparison
    
Sending: ${getCurrencySymbol(sourceCurrency)} ${sourceCurrency} → ${getCurrencySymbol(resultDestCurrency)} ${resultDestCurrency}
Best Provider: ${best.Provider}
Total Cost: ${formatCurrency(bestCost, resultDestCurrency)}
Transfer Time: ${formatTime(best.Avg_Speed_Hours)}
Savings: ${formatCurrency(Math.max(0, savings), resultDestCurrency)} (${Math.max(0, savingsPercentage).toFixed(1)}%)

Compare rates at: ${window.location.origin}`;

    try {
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        await navigator.share({
          title: 'Cross-Border Payment Comparison',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-3 sm:p-4 rounded-xl border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between sm:block">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Transfer Recommendation</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  From {getCurrencySymbol(sourceCurrency)} {sourceCurrency} to {getCurrencySymbol(resultDestCurrency)} {resultDestCurrency}
                </p>
              </div>
              <button
                onClick={shareResults}
                className="sm:hidden p-2 rounded-lg hover:bg-blue-100 transition-colors"
                title="Share results"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-blue-600" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Exchange Rate</p>
              <p className="text-base sm:text-lg font-semibold text-blue-600">
                1 {sourceCurrency} = {Number(best.Exchange_Rate || 0).toFixed(4)} {resultDestCurrency}
              </p>
            </div>
            <button
              onClick={shareResults}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-2">
            <Award className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Best Provider</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{best.Provider || 'Unknown'}</h3>
          <p className="text-2xl font-bold">{formatCurrency(bestCost, resultDestCurrency)}</p>
          <p className="text-sm opacity-90 mt-1">
            <Clock className="inline w-4 h-4 mr-1" />
            {formatTime(best.Avg_Speed_Hours)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">You Save</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(Math.max(0, savings), resultDestCurrency)}</p>
          <p className="text-lg font-semibold">
            {Math.max(0, savingsPercentage).toFixed(1)}% saved
          </p>
          <p className="text-sm opacity-90">vs most expensive</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Comparison</span>
          </div>
          <p className="text-lg font-bold">{validProviders.length} Providers</p>
          <p className="text-sm opacity-90 mt-1">
            You'll receive: {formatCurrency(Number(best.Destination_Amount || 0), resultDestCurrency)}
          </p>
          {validProviders.length > 0 && (
            <p className="text-sm opacity-90">
              Speed: {formatTime(Math.min(...validProviders.map(p => Number(p.Avg_Speed_Hours || 0))))} - {formatTime(Math.max(...validProviders.map(p => Number(p.Avg_Speed_Hours || 0))))}
            </p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-sky-600" />
            <span className="hidden sm:inline">Provider Cost Comparison ({chartData.length} providers)</span>
            <span className="sm:hidden">Cost Comparison</span>
          </h3>
          <div className="h-64 sm:h-80 w-full overflow-x-auto">
            <div className="min-w-[400px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
                  barCategoryGap="15%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    width={60}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value, resultDestCurrency), 'Total Cost']}
                    labelFormatter={(label) => `Provider: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="cost" 
                    fill="#0EA5E9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center sm:hidden">Swipe to see all providers</p>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <p className="text-yellow-800 font-medium">No chart data available</p>
          <p className="text-yellow-700 text-sm mt-1">
            Provider data is insufficient for chart visualization.
          </p>
        </div>
      )}

      {validProviders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-4 sm:p-6 border-b bg-gray-50">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Providers Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">You Receive</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {validProviders.slice(0, 5).map((provider, index) => (
                    <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{provider.Provider}</div>
                          {index === 0 && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Best</span>}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(provider.Total_Cost, resultDestCurrency)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(provider.Avg_Speed_Hours)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(provider.Destination_Amount, resultDestCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

