import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export class UIPieChartDemo extends React.Component {

  render() {
    return (
      <div className='d-flex justify-content-center'>
        <PieChart width={600} height={600}>
          <Pie dataKey="value" isAnimationActive={false} data={data}
            cx={300} cy={300} outerRadius={200} fill="#8884d8" label >
            {
              data.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}
