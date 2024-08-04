"use client"; // Add this line at the top
import { useState } from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement
);

export default function Home() {
  const [stockSymbol, setStockSymbol] = useState('');
  const [chartDisplayData, setChartDisplayData] = useState<any>(null);

  async function handleSubmit() {
    try {
      const chartResponse = await fetch(`http://127.0.0.1:5000/historical_prices?ticker=${stockSymbol}`);
      const chartData = await chartResponse.json();

      const dates = chartData[0];
      const prices = chartData[1];

      // Identify significant rise or drop points over a rolling window of 30 days
      const significantPoints: any[] = [];
      const windowSize = 20; // Window size for delta calculation
      const threshold = 0.12; // Example threshold for significant change (10%)
      const minDistance = 30; // Minimum distance between significant points (number of days)

      const changes: any[] = [];
      for (let i = windowSize; i < prices.length; i++) {
        const pastPrice = prices[i - windowSize];
        const currentPrice = prices[i];
        const delta = (currentPrice - pastPrice) / pastPrice;
        
        if (Math.abs(delta) > threshold) {
          changes.push({
            index: i - windowSize,
            x: dates[i - windowSize],
            y: pastPrice,
            delta: delta
          });
          i = i + minDistance
        }
      }

      // Sort significant changes by absolute delta and filter out close points
      const filteredPoints = changes
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .filter((point, index, arr) => {
          // Ensure no close points (minDistance) are included
          if (index === 0) return true;
          return (point.index - arr[index - 1].index) >= minDistance;
        })
        // .slice(0, 4); // Limit to 3-4 significant points

      setChartDisplayData({
        labels: dates,
        datasets: [
          {
            label: `${stockSymbol} Stock Price`,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            data: prices,
            pointBackgroundColor: dates.map((_: any, i: any) =>
              filteredPoints.find(point => point.index === i) ? (filteredPoints.find(point => point.index === i)!.delta > 0 ? 'green' : 'red') : 'rgba(75, 192, 192, 0.6)'
            ),
            pointRadius: dates.map((_: any, i: any) =>
              filteredPoints.find(point => point.index === i) ? 5 : 0 // Show only significant points
            ),
            pointHoverRadius: 10 // Increase hover size for better visibility
          }
        ]
      });

      // Attach significant points data to chart options
      const chartOptions = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                const point = filteredPoints.find((p: any) => p.index === tooltipItem.dataIndex);
                if (point) {
                  return `Price: ${tooltipItem.raw}, Change: ${(point.delta * 100).toFixed(2)}%`;
                }
                return `Price: ${tooltipItem.raw}`;
              }
            }
          }
        }
      };

      setChartDisplayData((prevState: any) => ({
        ...prevState,
        options: chartOptions
      }));

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
        </div>

        {chartDisplayData && <Line data={chartDisplayData} options={chartDisplayData.options} />}
      </main>
    </>
  );
}
