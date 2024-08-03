import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import stockData from './stockData.json';  // Adjust the path as necessary
import { format, parseISO, differenceInYears, differenceInMonths } from 'date-fns';  // Added differenceInMonths

const StockChart = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    setData(stockData);
    if (stockData.length > 0) {
      setDateRange({
        start: parseISO(stockData[0].date),
        end: parseISO(stockData[stockData.length - 1].date)
      });
    }
  }, []);

  const getFormatString = (start, end) => {
    const yearsDiff = differenceInYears(end, start);
    const monthsDiff = differenceInMonths(end, start);
    
    if (monthsDiff <= 2) return 'MMM d, yyyy';
    if (yearsDiff < 5) return 'MMM yyyy';
    return 'yyyy';
  };

  const tickFormatter = (tick) => {
    const date = parseISO(tick);
    const formatString = getFormatString(dateRange.start, dateRange.end);
    return format(date, formatString);
  };

  const handleBrushChange = (brushRange) => {
    if (brushRange && brushRange.startIndex !== undefined && brushRange.endIndex !== undefined) {
      setDateRange({
        start: parseISO(data[brushRange.startIndex].date),
        end: parseISO(data[brushRange.endIndex].date)
      });
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
            <XAxis 
        dataKey="date" 
        tickFormatter={tickFormatter}
        domain={['dataMin', 'dataMax']}
        stroke="black"
        />
        <YAxis 
        domain={['auto', 'auto']} 
        stroke="black"
        />
            <Tooltip 
        labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
        contentStyle={{ backgroundColor: 'white', border: '1px solid black', borderRadius: '0' }}
        />
            <Line type="monotone" dataKey="close" stroke="#71a19e" strokeWidth={2} dot={false} />
        <Brush dataKey="date" height={30} stroke="#bbb2cc" onChange={handleBrushChange} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
