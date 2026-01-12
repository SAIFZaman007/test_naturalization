import React from "react";

const TopPerformingThemes = ({ themes = [], loading = false, error = null }) => {
  return (
    <div className="w-full text-[#121111]">
      <div className="bg-white rounded-xl shadow-sm border border-[#F6B0B5] p-6 w-full">
        <h2 className="text-base font-semibold mb-2 text-gray-900">Top Performing Themes</h2>

        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : themes.length === 0 ? (
          <div className="text-sm text-gray-500">No data available</div>
        ) : (
          <div className="space-y-6">
            {themes.map((theme, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-gray-900">{theme.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-[#F18A91]">{theme.completions} completions</span>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">{theme.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden bg-[#E6E6F4]">
                  <div className="h-full rounded-full bg-blue-900 transition-all duration-500" style={{ width: `${theme.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformingThemes;
