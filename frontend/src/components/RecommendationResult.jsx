import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Award, DollarSign, CheckCircle } from 'lucide-react';

export default function RecommendationResult({ result }) {
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
  
  // Ensure providers is an array and has valid data
  const validProviders = Array.isArray(providers) ? providers.filter(p => p && p.Provider && typeof p.Total_Cost === 'number') : [];
  
  // Prepare chart data with fallback values
  const chartData = validProviders.map(provider => ({
    name: (provider.Provider || 'Unknown').substring(0, 12), // Truncate long names
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

  const formatCurrency = (amount, currency = 'USD') => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-2">
            <Award className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">Best Provider</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{best.Provider || 'Unknown'}</h3>
          <p className="text-2xl font-bold">{formatCurrency(bestCost)}</p>
          <p className="text-sm opacity-90 mt-1">
            <Clock className="inline w-4 h-4 mr-1" />
            {formatTime(best.Avg_Speed_Hours)}
          </p>
        </div>

        {/* Savings Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-6 h-6 mr-2" />
            <span className="text-sm font-medium opacity-90">You Save</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(Math.max(0, savings))}</p>
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
            Best rate: {best.Exchange_Rate ? `${Number(best.Exchange_Rate).toFixed(4)}` : 'N/A'}
          </p>
          {validProviders.length > 0 && (
            <p className="text-sm opacity-90">
              Range: {formatTime(Math.min(...validProviders.map(p => Number(p.Avg_Speed_Hours || 0))))} - {formatTime(Math.max(...validProviders.map(p => Number(p.Avg_Speed_Hours || 0))))}
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
                  label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), 'Total Cost']}
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
            Chart requires valid provider data with costs. Received {validProviders.length} valid providers.
          </p>
        </div>
      )}

      {validProviders.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-sky-600" />
              All Provider Options ({validProviders.length})
            </h3>
            <p className="text-gray-600 mt-1">Compare all available transfer options</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Provider</th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">Total Cost</th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">Fees</th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">Exchange Rate</th>
                  <th className="text-right py-3 px-6 font-semibold text-gray-700">Transfer Time</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {validProviders.map((provider, index) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors ${provider.Provider === best.Provider ? 'bg-sky-50 border-l-4 border-sky-500' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {provider.Provider === best.Provider && (
                          <Award className="w-4 h-4 text-sky-600 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">{provider.Provider}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-semibold ${provider.Provider === best.Provider ? 'text-sky-700' : 'text-gray-900'}`}>
                        {formatCurrency(provider.Total_Cost)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-600">
                      {formatCurrency(provider.Fees || 0)}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-600">
                      {provider.Exchange_Rate ? Number(provider.Exchange_Rate).toFixed(4) : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(provider.Avg_Speed_Hours)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {provider.Provider === best.Provider ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Recommended
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Insights */}
      {validProviders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Transfer Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-700">
                <strong>Best Value:</strong> {best.Provider} offers the lowest total cost at {formatCurrency(bestCost)}.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Time vs Cost:</strong> Fastest option takes {formatTime(Math.min(...validProviders.map(p => Number(p.Avg_Speed_Hours || 0))))}, 
                while cheapest takes {formatTime(best.Avg_Speed_Hours)}.
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <strong>Savings:</strong> You save {formatCurrency(Math.max(0, savings))} ({Math.max(0, savingsPercentage).toFixed(1)}%) compared to the most expensive option.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Market Range:</strong> Costs vary from {formatCurrency(Math.min(...validProviders.map(p => Number(p.Total_Cost || 0))))} to {formatCurrency(Math.max(...validProviders.map(p => Number(p.Total_Cost || 0))))}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
