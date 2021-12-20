import React from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, Bar, Brush} from 'recharts';
import { data } from './UIBarChartDemo'

export class UIComboChartDemo extends React.Component {
  render() {
    return (
      <div className='d-flex justify-content-center'>
        <ComposedChart
          width={900}
          height={800}
          data={data}
          margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" label={{ value: 'Month', position: 'insideBottomRight', offset: 0 }} />
          <YAxis label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="profit" stroke="#ff7300" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
        </ComposedChart>
      </div>
    )
  }
}