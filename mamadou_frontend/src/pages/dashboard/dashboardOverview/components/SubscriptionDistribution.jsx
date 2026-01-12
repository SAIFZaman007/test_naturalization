const data = [
  { label: "Free", percentage: 45, color: "#FFC0CB" },
  { label: "Basic", percentage: 30, color: "#00008B" },
  { label: "Premium", percentage: 25, color: "#DC143C" },
];

const SubscriptionDistribution = () => {
  const createDonutSegments = () => {
    const radius = 80;
    const innerRadius = 55;
    const centerX = 100;
    const centerY = 100;

    let currentAngle = -90;

    return data.map((item) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const innerX1 = centerX + innerRadius * Math.cos(startRad);
      const innerY1 = centerY + innerRadius * Math.sin(startRad);
      const innerX2 = centerX + innerRadius * Math.cos(endRad);
      const innerY2 = centerY + innerRadius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${innerX2} ${innerY2}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1}`,
        "Z",
      ].join(" ");

      currentAngle = endAngle;

      return { pathData, color: item.color };
    });
  };

  const segments = createDonutSegments();
  const totalUsers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="w-full text-[#121111]">
      <div className="bg-white rounded-xl shadow-sm border border-[#F6B0B5] p-6 w-full h-[340px]">
        <h2 className="text-lg font-semibold">Subscription Distribution</h2>

        <div className="text-top-right">
        <p className="text-sm text-gray-500">Total: {totalUsers} Users</p>
        </div>

        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {segments.map((segment, index) => (
              <path key={index} d={segment.pathData} fill={segment.color} />
            ))}
          </svg>

          {/* Legend */}
          <div className="w-full max-w-md space-y-1.5">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-1">
                  <span
                    className="text-sm font-medium"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>

                  <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.percentage / 45) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium ml-3">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDistribution;
