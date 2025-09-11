import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Award, DollarSign, CheckCircle } from 'lucide-react';

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'NGN': '₦',
  'KES': 'KSh',
  'GHS': '₵',
  'ZAR': 'R',
  'INR': '₹',
  'BRL': 'R$',
  'MXN': '$',
  'SGD': 'S$',
  'HKD': 'HK$',
  'NZD': 'NZ$',
  'SEK': 'kr',
  'NOK': 'kr',
};

export default function RecommendationResult({ result, destCurrency = 'USD' }) {
  if (result?.error) {
    return (
      <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center">
          <div className="text-red-600 text-lg font-medium">{result.error}</div>
        </div>
      </div>
    );
  }

  console.log('RecommendationResult received:', result);
  console.log('Destination currency:', destCurrency);

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

  console.log('Chart data prepared:', chartData);

  // Calculate savings with proper fallbacks
  const baselineCost = summary.baseline_cost || (validProviders.length > 0 ? Math.max(...validProviders.map(p => Number(p.Total_Cost || 0))) : 0);
  const bestCost = Number(best.Total_Cost || 0);
  const savings = baselineCost - bestCost;
  const savingsPercentage = baselineCost > 0 ? ((savings / baselineCost) * 100) : 0;

  // Get the correct currency symbol
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

  return (
    <div className="p-6 space-y-6">
      {/* Header with currency conversion info */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transfer Recommendation</h2>
            <p className="text-gray-600">
              From {getCurrencySymbol(sourceCurrency)} {sourceCurrency} to {getCurrencySymbol(resultDestCurrency)} {resultDestCurrency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Exchange Rate</p>
            <p className="text-lg font-semibold text-blue-600">
              1 {sourceCurrency} = {Number(best.Exchange_Rate || 0).toFixed(4)} {resultDestCurrency}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
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

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
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

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
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
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-sky-600" />
            Provider Cost Comparison ({chartData.length} providers)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: `Cost (${getCurrencySymbol(resultDestCurrency)})`, angle: -90, position: 'insideLeft' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value, resultDestCurrency), 'Total Cost']}
                  labelFormatter={(label) => `Provider: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Bar 
                  dataKey="cost" 
                  fill="#0EA5E9"
                  radius={[4, 4, 0, 0]}
                  name="Total Cost"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}


      {chartData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <p className="text-yellow-800 font-medium">No chart data available</p>
          <p className="text-yellow-700 text-sm mt-1">
            Provider data is insufficient for chart visualization. Check console for debugging information.
          </p>
        </div>
      )}


      {validProviders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">Providers Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">You Receive</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validProviders.slice(0, 5).map((provider, index) => (
                  <tr key={index} className={index === 0 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{provider.Provider}</div>
                        {index === 0 && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Best</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(provider.Total_Cost, resultDestCurrency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(provider.Avg_Speed_Hours)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(provider.Destination_Amount, resultDestCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
