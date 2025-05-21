"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', total: 400 },
  { name: 'Tue', total: 300 },
  { name: 'Wed', total: 500 },
  { name: 'Thu', total: 700 },
  { name: 'Fri', total: 200 },
];

export default function Chart() {
  return (
    <div className="bg-white dark:bg-zinc-900">
      <h3 className="text-sm text-gray-500 mb-2 dark:text-gray-400">Weekly Revenue</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
