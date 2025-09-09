import React, { useState } from 'react';
import bgImage from './image/travel-elements-map-top-view.jpg';
import PaymentForm from './components/PaymentForm';
import RecommendationResult from './components/RecommendationResult';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ amount, currency, priority }) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `http://localhost:8000/recommend?amount=${amount}&dest_currency=${currency}&priority=${priority}`
      );
      if (!res.ok) {
        const text = await res.text();
        setResult({ error: `API error: ${res.status} ${text}` });
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to fetch recommendation. Is backend running?' });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans text-white p-6"
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

  <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg text-center" style={{ color: 'black' }}>Cross-Border Payments</h1>
      <div className="w-full max-w-xl bg-white/95 text-slate-900 rounded-2xl shadow-2xl p-8 backdrop-blur">
        <PaymentForm onSubmit={handleSubmit} />
        {loading && <p className="text-lg text-sky-600 mt-4">Loading...</p>}
        {result && <RecommendationResult result={result} />}
      </div>
      <footer className="mt-8 text-white text-sm opacity-80">© 2025 Your Name</footer>
    </div>
  );
}

export default App;
