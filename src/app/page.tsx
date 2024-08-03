"use client"; // Add this line at the top
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchStockNews } from '../../utils/index';

export default function Home() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<string>('');

  useEffect(() => {
    async function getData() {
      const data = await fetchStockNews();
      setPhrases(data);
    }
    // getData();
  }, []);


  async function handleSubmit() {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `Tell me three dates that shifted ${stockSymbol} stocks and why it shifted in the last 3 months. Give me a link to a news article about it and about 50 characters.` }),
      });

      const data = await response.json();
      setPhrases(data.news)
      // setApiResponse(data.answer);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      

      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <input
          type="text"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          placeholder="Enter stock symbol"
          className="mb-4 p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
        {apiResponse && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">API Response:</h3>
            <p>{apiResponse}</p>
          </div>
        )}
      </div>

      {phrases.map((phrase, index) => (
        <div
          key={index}
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius:   '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          {phrase}
        </div>
      ))}
    </main>
  );
}