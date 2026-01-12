import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mamadou.mtscorporate.com/api/v1';

const SubscriptionDistribution = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        setLoading(true);
        
        const token = Cookies.get('authToken');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(
          `${API_BASE_URL}/dashboard/statistics/subscription-distribution`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/login';
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (Array.isArray(result) && result.length > 0) {
          setData(result);
        } else {
          // Fallback data with colors matching reference
          setData([
            { label: "Free", percentage: 100, color: "#FFC0CB", count: 0 },
          ]);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("Failed to fetch subscription distribution:", error);
        
        if (error.name !== 'AbortError') {
          toast.error("Failed to load subscription data");
        }
        
        // Fallback data
        setData([
          { label: "Free", percentage: 100, color: "#FFC0CB", count: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistribution();
  }, []);

  // Create pie chart segments (placed in center)
  const createPieSegments = () => {
    const centerX = 100;
    const centerY = 100;
    const radius = 70;
    
    let currentAngle = -90; // Start from top

    return data.map((item, index) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      currentAngle = endAngle;

      return { pathData, color: item.color };
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const segments = createPieSegments();
  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
      {/* Header with Total Users in top-right */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Subscription Distribution</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total: {totalUsers} Users</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Pie Chart in Center */}
        <div className="mb-6">
          <svg viewBox="0 0 200 200" className="w-56 h-56">
            {segments.map((segment, index) => (
              <path 
                key={index} 
                d={segment.pathData} 
                fill={segment.color}
                className="transition-opacity hover:opacity-80"
              />
            ))}
            {/* Center circle for donut effect (optional) */}
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="white"
            />
          </svg>
        </div>

        {/* Legend with horizontal bars */}
        <div className="w-full space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {/* Color indicator */}
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                
                {/* Label */}
                <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                  {item.label}
                </span>

                {/* Progress bar */}
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
              
              {/* Count and Percentage */}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 min-w-[30px] text-right">{item.count}</span>
                <span className="font-semibold text-gray-800 min-w-[50px] text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDistribution;