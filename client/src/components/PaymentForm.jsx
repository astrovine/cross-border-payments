import React, { useState } from 'react';
import { ArrowRightLeft, DollarSign, Clock, Zap } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
];

export default function PaymentForm({ onSubmit, loading }) {
  const [amount, setAmount] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [destCurrency, setDestCurrency] = useState('NGN');
  const [priority, setPriority] = useState('cost');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (sourceCurrency === destCurrency) {
      newErrors.currency = 'Source and destination currencies must be different';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        amount: parseFloat(amount),
        sourceCurrency,
        destCurrency,
        priority
      });
    }
  };

  const getCurrencyInfo = (code) => CURRENCIES.find(c => c.code === code) || { symbol: '$', name: code };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Transfers</h2>
        <p className="text-gray-600">Find the best rates and fastest transfers worldwide</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            <DollarSign className="inline w-4 h-4 mr-1" />
            Amount to Send
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              {getCurrencyInfo(sourceCurrency).symbol}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full pl-10 pr-4 py-3 text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
              }}
              required
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">From Currency</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={sourceCurrency}
              onChange={(e) => {
                setSourceCurrency(e.target.value);
                if (errors.currency) setErrors(prev => ({ ...prev, currency: null }));
              }}
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">To Currency</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={destCurrency}
              onChange={(e) => {
                setDestCurrency(e.target.value);
                if (errors.currency) setErrors(prev => ({ ...prev, currency: null }));
              }}
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errors.currency && (
          <p className="text-red-500 text-sm text-center">{errors.currency}</p>
        )}


        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-3 text-gray-600">
            <span className="text-lg font-medium">{getCurrencyInfo(sourceCurrency).symbol} {sourceCurrency}</span>
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-lg font-medium">{getCurrencyInfo(destCurrency).symbol} {destCurrency}</span>
          </div>
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Priority</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-3 border rounded-lg transition-all duration-200 ${
                priority === 'cost'
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setPriority('cost')}
            >
              <DollarSign className="w-5 h-5 mx-auto mb-1" />
              <span className="block text-sm font-medium">Lowest Cost</span>
            </button>
            <button
              type="button"
              className={`p-3 border rounded-lg transition-all duration-200 ${
                priority === 'speed'
                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setPriority('speed')}
            >
              <Zap className="w-5 h-5 mx-auto mb-1" />
              <span className="block text-sm font-medium">Fastest Transfer</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-xl font-semibold py-4 rounded-lg shadow-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Finding Best Rates
            </div>
          ) : (
            'Get Best Rates'
          )}
        </button>
      </form>
    </div>
  );
}
