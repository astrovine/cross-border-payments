import React, { useState } from 'react';
import { Globe, TrendingUp, Users, Shield } from 'lucide-react';
import bgImage from './image/travel-elements-map-top-view.jpg';
import PaymentForm from './components/PaymentForm';
import RecommendationResult from './components/RecommendationResult';
import ExchangeRateTicker from './components/ExchangeRateTicker';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDestCurrency, setCurrentDestCurrency] = useState('USD');

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://cross-border-payments-app.onrender.com'
    : 'http://localhost:8000';

  const handleSubmit = async ({ amount, sourceCurrency, destCurrency, priority }) => {
    setLoading(true);
    setResult(null);
    setCurrentDestCurrency(destCurrency);

    try {
      const queryParams = new URLSearchParams({
        amount: amount.toString(),
        source_currency: sourceCurrency,
        dest_currency: destCurrency,
        priority: priority
      });


      if (!res.ok) {
        const text = await res.text();
        setResult({ error: `API error: ${res.status} ${text}` });
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        error: 'Failed to connect to app. Please ensure the app server is running.'
      });
    }

    setLoading(false);
  };

  const handleRateClick = (fromCurrency, toCurrency) => {
    // Future: Auto-fill form with selected currency pair
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(8, 47, 73, 0.8), rgba(7, 89, 133, 0.8)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-blue-600/20"></div>
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8" />
              <span className="text-xl font-bold">Payments</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="https://github.com/astrovine/cross-border-payments" className="hover:text-sky-300 transition">How it works</a>
              <a href="#" className="hover:text-sky-300 transition">Providers</a>
              <a href="https://open.substack.com/pub/uzoukwud/p/cross-the-border?utm_source=share&utm_medium=android&r=15nwd5" className="hover:text-sky-300 transition">About</a>
            </div>
          </div>
        </nav>

        <div className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Smart Cross-Border
              <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent"> Payments</span>
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-3xl mx-auto">
              Compare rates from top providers worldwide. Save up to 10% on international transfers with our cutting edge optimization engine.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sky-200">
                <TrendingUp className="w-5 h-5" />
                <span>Best Rates</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sky-200">
                <Users className="w-5 h-5" />
                <span>20+ Providers</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sky-200">
                <Shield className="w-5 h-5" />
                <span>Secure & Fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="relative -mt-20 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-8">

            <div className="xl:col-span-1 lg:col-span-1">
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur border border-white/20">
                  <PaymentForm onSubmit={handleSubmit} loading={loading} />
                </div>

                <div className="bg-white rounded-2xl shadow-xl backdrop-blur border border-white/20 overflow-hidden">
                  <ExchangeRateTicker onRateClick={handleRateClick} />
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 lg:col-span-2">
              {loading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
                      <p className="text-xl font-semibold text-gray-700">Finding Best Rates...</p>
                      <p className="text-gray-500 mt-2">Comparing rates from multiple providers</p>
                    </div>
                  </div>
                </div>
              )}
              
              {result && !loading && (
                <div className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <RecommendationResult result={result} destCurrency={currentDestCurrency} />
                </div>
              )}

              {!result && !loading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20">
                  <div className="text-center py-20">
                    <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Compare Rates?</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Enter your transfer details in the form to get personalized recommendations from top providers worldwide.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-sky-500 rounded-full mr-2"></div>
                        Real time exchange rates
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Transparent fee comparison
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Speed vs cost analysis
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        Savings calculator
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6" />
                <span className="text-lg font-bold">Payments</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                What are we transferring today?. Compare rates, save money, and transfer funds globally with confidence.
              </p>
              <div className="flex space-x-4">
                <div className="text-sm text-gray-400">
                  <span className="font-semibold text-white">20+</span> Providers
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-semibold text-white">150+</span> Countries
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-semibold text-white">$50M+</span> Transferred
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com/astrovine/cross-border-payments" className="hover:text-white transition">How it works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="https://cross-border-payments-app.onrender.com/docs#/default/get_recommendation_recommend_get" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 astrovine. All rights reserved. Built for global financial inclusion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
