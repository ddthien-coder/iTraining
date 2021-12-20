import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
import { data } from './UIBarChartDemo'

const gradientOffset = () => {
  const dataMax = Math.max(...data.map(i => i.profit));
  const dataMin = Math.min(...data.map(i => i.profit));
  if (dataMax <= 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }

  return dataMax / (dataMax - dataMin);
};

const off = gradientOffset();

export class UIAreaChartDemo extends React.Component {

  render() {
    return (
      <div className='d-flex justify-content-center'>
        <AreaChart width={700} height={600} data={data} margin={{ top: 5, right: 20, left: 20, bottom: 10, }} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="green" stopOpacity={1} />
              <stop offset={off} stopColor="red" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area name="Revenue" type="monotone" dataKey="revenue" stroke="#000" fill="url(#splitColor)" />
        </AreaChart>
      </div>
    );
  }
}
