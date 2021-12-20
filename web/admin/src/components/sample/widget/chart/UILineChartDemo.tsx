import React from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Brush, Tooltip, Legend } from 'recharts';
import { data } from './UIBarChartDemo'

interface UILineChartDemoProps { }
interface UILineChartDemoState {
  disable: any;
}
export class UILineChartDemo extends React.Component<UILineChartDemoProps, UILineChartDemoState> {
  constructor(props: UILineChartDemoProps) {
    super(props);
    this.state = {
      disable: [],
    }
  }

  onChangeLineChart = (e: any) => {
    let disable = this.state.disable;
    let index = disable.indexOf(e.dataKey.trim());
    if (index >= 0) {
      disable.splice(index, 1);
    } else disable.push(e.dataKey.trim());
    this.setState({ disable });
  }

  render() {

    return (
      <div className='d-flex justify-content-center'>
        <LineChart
          width={1500}
          height={600}
          data={data}
          margin={{
            top: 80, right: 20, left: 20, bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" label={{ value: 'Profit', angle: -90, position: 'insideRight' }} orientation="right" />
          <Tooltip />
          <Legend height={36} iconSize={20} iconType='circle' onClick={this.onChangeLineChart} wrapperStyle={{ top: 600 }} />
          <Line name="Revenue" legendType="rect" isAnimationActive={false} yAxisId="left" type="linear" dataKey={this.state.disable.includes('revenue') ? 'revenue ' : 'revenue'} stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line name="Profit" legendType="rect" isAnimationActive={false} yAxisId="right" type="linear" dataKey={this.state.disable.includes('profit') ? 'profit ' : 'profit'} stroke="#82ca9d" />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
        </LineChart>
      </div>
    );
  }
}