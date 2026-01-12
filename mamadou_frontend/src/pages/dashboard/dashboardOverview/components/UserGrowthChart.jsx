// Yearly data: one value per month (Jan - Dec)
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar, Users, Activity, UserPlus } from 'lucide-react';
import api from '../../../../api/ApiService';

// Chart state (fetched from backend)
const UserGrowthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard/analytics/user-growth', { showToast: false });

        // ApiService returns ApiResponse with .success and .data
        const payload = res && res.success ? res.data : null;

        if (Array.isArray(payload)) {
          const mapped = payload.map((item) => ({
            // name shown on X axis
            name: item.label || (item.month ? item.month.split('-')[1] : ''),
            // active users (main metric)
            value: typeof item.active_users === 'number' ? item.active_users : 0,
            // new signups for tooltip
            newUsers: typeof item.new_users === 'number' ? item.new_users : 0,
            // raw month string for tooltip/year
            month: item.month || null,
            monthly_growth_rate: item.monthly_growth_rate ?? null,
          }));

          if (mounted) setData(mapped);
        } else {
          if (mounted) setData([]);
        }
      } catch (err) {
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalUsers = payload[0].value || 0;
    const newUsers = payload[0].payload.newUsers || 0;
    const monthlyRate = payload[0].payload.monthly_growth_rate;
    let growthRate = null;
    if (typeof monthlyRate === 'number') {
      growthRate = (monthlyRate * 100).toFixed(1);
    } else if (totalUsers > 0) {
      growthRate = ((newUsers / totalUsers) * 100).toFixed(1);
    } else {
      growthRate = '0.0';
    }

    // Determine year from month string if available (format: YYYY-MM)
    const monthRaw = payload[0].payload.month || null;
    const yearLabel = monthRaw ? monthRaw.split('-')[0] : new Date().getFullYear();

    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl min-w-[200px]">
        <p className="font-semibold text-gray-800 mb-2">{label} {yearLabel}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Active Users
            </span>
            <span className="font-bold text-gray-900">{totalUsers.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              New Signups
            </span>
            <span className="font-medium text-gray-600">+{newUsers.toLocaleString()}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-indigo-600 font-medium">Monthly Growth</span>
            <span className="text-indigo-600 font-bold">{growthRate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

  return (
    <div className="w-full text-[#121111]">
      <div className="bg-white rounded-xl shadow-sm border border-[#F6B0B5] p-6 w-full h-[340px]">
        <h2 className="text-base font-semibold mb-1 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" /> User Growth
        </h2>

        <div className="relative">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-100"></div>
            ))}
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E1000F', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Line type="monotone" dataKey="value" stroke="#E1000F" strokeWidth={4} dot={{ r: 4, fill: '#fff', stroke: '#4F46E5', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#4F46E5', stroke: '#C7D2FE', strokeWidth: 4 }} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / footer */}
          <div className="flex justify-between mt-4 items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-indigo-600 rounded-full shadow-sm"></div>
              <span className="text-sm text-gray-600 font-medium">Active Users</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="flex items-center gap-1 bg-teal-100 px-2 py-1 rounded text-xs text-green-500 font-medium">
                <UserPlus className="w-4 h-4 text-black" /> <span className='text-black'>New Signups</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;
