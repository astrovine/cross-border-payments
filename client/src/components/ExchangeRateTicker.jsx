import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const MAJOR_PAIRS = [
	{ from: 'USD', to: 'EUR', label: 'USD/EUR' },
	{ from: 'USD', to: 'GBP', label: 'USD/GBP' },
	{ from: 'USD', to: 'JPY', label: 'USD/JPY' },
	{ from: 'EUR', to: 'GBP', label: 'EUR/GBP' },
	{ from: 'USD', to: 'NGN', label: 'USD/NGN' },
	{ from: 'USD', to: 'CAD', label: 'USD/CAD' },
];

export default function ExchangeRateTicker({ onRateClick }) {
	const [rates, setRates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [lastUpdate, setLastUpdate] = useState(null);
	const generateMockRates = () => {
		return MAJOR_PAIRS.map((pair) => ({
			...pair,
			rate: (Math.random() * 2 + 0.5).toFixed(4),
			change: (Math.random() - 0.5) * 0.1,
			changePercent: (Math.random() - 0.5) * 2,
		}));
	};

	useEffect(() => {
		const loadRates = () => {
			setLoading(true);
			setTimeout(() => {
				setRates(generateMockRates());
				setLastUpdate(new Date());
				setLoading(false);
			}, 1000);
		};

		loadRates();

		const interval = setInterval(() => {
			setRates(generateMockRates());
			setLastUpdate(new Date());
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	const handleRateClick = (pair) => {
		if (onRateClick) {
			onRateClick(pair.from, pair.to);
		}
	};

	const formatTime = (date) => {
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	};

	if (loading) {
		return (
			<div className="bg-white border border-gray-200 rounded-lg p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="font-semibold text-gray-800">Live Exchange Rates</h3>
					<RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
				</div>
				<div className="space-y-2">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex justify-between items-center">
							<div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
							<div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-semibold text-gray-800">Live Exchange Rates</h3>
				<div className="flex items-center text-xs text-gray-500">
					<RefreshCw className="w-3 h-3 mr-1" />
					{lastUpdate && formatTime(lastUpdate)}
				</div>
			</div>

			<div className="space-y-2 max-h-48 overflow-y-auto">
				{rates.map((rate, index) => (
					<div
						key={index}
						onClick={() => handleRateClick(rate)}
						className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
					>
						<div className="flex items-center">
							<span className="text-sm font-medium text-gray-700">
								{rate.label}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<span className="text-sm font-mono">{rate.rate}</span>
							<div
								className={`flex items-center ${
									rate.change >= 0 ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{rate.change >= 0 ? (
									<TrendingUp className="w-3 h-3" />
								) : (
									<TrendingDown className="w-3 h-3" />
								)}
								<span className="text-xs ml-1">
									{Math.abs(rate.changePercent).toFixed(2)}%
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="mt-3 pt-3 border-t border-gray-100">
				<p className="text-xs text-gray-500 text-center">
					Rates update every 30 seconds • Click to use in calculator
				</p>
			</div>
		</div>
	);
}
