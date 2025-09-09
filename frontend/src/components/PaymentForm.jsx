import React, { useState } from 'react';

export default function PaymentForm({ onSubmit }) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [priority, setPriority] = useState('cost');

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ amount, currency, priority });
      }}
    >
      <input
        type="number"
        className="text-2xl p-4 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Amount (USD)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <select
        className="text-xl p-4 border rounded"
        value={currency}
        onChange={e => setCurrency(e.target.value)}
      >
        <option value="NGN">Nigerian Naira (NGN)</option>
        <option value="GBP">British Pound (GBP)</option>
        <option value="EUR">Euro (EUR)</option>
      </select>
      <select
        className="text-xl p-4 border rounded"
        value={priority}
        onChange={e => setPriority(e.target.value)}
      >
        <option value="cost">Lowest Cost</option>
        <option value="speed">Fastest Transfer</option>
      </select>
      <button
        type="submit"
        className="bg-sky-600 text-white text-2xl py-3 rounded shadow hover:bg-sky-700 transition"
      >
        Get Recommendation
      </button>
    </form>
  );
}
