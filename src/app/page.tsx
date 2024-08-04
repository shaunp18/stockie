"use client"; // Add this line at the top
import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'chart.js/auto'
import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

export default function Home() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [chartDisplayData, setChartDisplayData] = useState<any>(null);


  async function handleSubmit() {
    try {
      const chartResponse = await fetch("http://localhost:5000/historical_prices?ticker=" + stockSymbol)
      const chartData = await chartResponse.json()
      setApiResponse(chartData)
      setChartDisplayData({
        labels: chartData[0],
        datasets: [
          {
            label: 'Data Series 1',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: chartData[1],
          },
        ],
      });

      const newsResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: stockSymbol }),
      });

      const data = await newsResponse.json();
      setPhrases(data.news)
      console.log(data.news)
      // setApiResponse(data.answer);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <>
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
          {/* {apiResponse && (
          <div className="mt-4 p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">API Response:</h3>
            <p>{apiResponse}</p>
          </div> */}
          {/* )} */}
        </div>

        {/* {phrases.map((phrase, index) => (
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
      ))} */}
{
  chartDisplayData && 
<Line data={chartDisplayData} />
}
    

      </main>
    </>
  );
}