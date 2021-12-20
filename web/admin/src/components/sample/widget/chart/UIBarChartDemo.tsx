import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
export const data = [
  { name: 'January', revenue: 4000, profit: 2400, amt: 2400, },
  { name: 'February', revenue: 3000, profit: 1398, amt: 2210, },
  { name: 'March', revenue: 5000, profit: 3800, amt: 2290, },
  { name: 'April', revenue: 5600, profit: 3908, amt: 2000, },
  { name: 'May', revenue: 4800, profit: 3800, amt: 2181, },
  { name: 'June', revenue: 7390, profit: 4800, amt: 2500, },
  { name: 'July', revenue: 6490, profit: 4300, amt: 2100, },
  { name: 'August', revenue: 8890, profit: 4800, amt: 2181, },
  { name: 'September', revenue: 9000, profit: 6398, amt: 2210, },
  { name: 'October', revenue: 7000, profit: 6400, amt: 2400, },
  { name: 'November', revenue: 6000, profit: 4398, amt: 2210, },
  { name: 'December', revenue: 9890, profit: 6800, amt: 2181, },
];


export class UIBarChartDemo extends React.Component {
  render() {
    return (
      <div className='d-flex justify-content-center'>
        <BarChart
          width={1700}
          height={600}
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"
            label={{ value: 'Month', position: 'insideBottom', offset: 0 }} />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend height={36} />
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="profit" fill="#82ca9d" />
        </BarChart>
      </div>
    );
  }
}

