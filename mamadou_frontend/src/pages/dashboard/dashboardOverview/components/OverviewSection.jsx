import React, { useState, useEffect } from "react";
import { CgDollar } from "react-icons/cg";
import { LuVolleyball } from "react-icons/lu";
import { TbUsers } from "react-icons/tb";
import { FiChevronDown } from "react-icons/fi";
import { IoMdTrendingUp } from "react-icons/io";
import Header from "../../../../components/Header";

const revenue = [
  {
    id: 1,
    icon: <TbUsers />,
    title: "Active Users",
  },
  {
    id: 2,
    icon: <CgDollar />,
    title: "Monthly Revenue",
    revenue: "28.6",
    total_user: "12,450",
  },
  {
    id: 3,
    icon: <LuVolleyball />,
    title: "Average Score",
    revenue: "5.3",
    total_user: "76.4%",
  },
];

const translations = {
  statuses: {
    active: "Last 24h",
    inactive: "Last 7 days",
    suspended: "Last 30 days",
    pending: "Last 90 days",
  },
};

import { api } from "../../../../api/axiosInstance";

const OverviewSection = ({ averageScore, loading: avgLoading, error: avgError }) => {
  const [statusFilter, setStatusFilter] = useState("Last 24h");
  const [monthlyActive, setMonthlyActive] = useState(null);
  const [maLoading, setMaLoading] = useState(false);
  const [maError, setMaError] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [mrLoading, setMrLoading] = useState(false);
  const [mrError, setMrError] = useState(null);
  // Overview receives `averageScore`, `loading` and `error` from parent
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchMonthlyActive = async () => {
      setMaLoading(true);
      setMaError(null);
      try {
        const res = await api.get("/dashboard/statistics/users/activity?days=30");
        const data = res.data || {};
        setMonthlyActive(data.active_users ?? null);
      } catch (err) {
        setMaError("Failed to load");
      } finally {
        setMaLoading(false);
      }
    };

    fetchMonthlyActive();
    const fetchMonthlyRevenue = async () => {
      setMrLoading(true);
      setMrError(null);
      try {
        // axiosInstance already sets baseURL to https://mamadou.mtscorporate.com/api/v1
        // so call the endpoint relative to that base URL (no duplicate `/api/v1`)
        const res = await api.get("/paymentss/payments/total-last-30days");
        const data = res.data || {};
        // API returns { status: "success", total_amount: 3710, time_period: "last 30days" }
        setMonthlyRevenue(typeof data.total_amount === "number" ? data.total_amount : Number(data.total_amount) || null);
      } catch (err) {
        setMrError("Failed to load");
      } finally {
        setMrLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  // const iconRotateClass = isDropdownOpen ? "rotate-180" : "rotate-0";

  return (
  <div className="text-[#121111] ">
  {/* Header + Filters */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-5 md:mb-6 lg:mb-7">
    {/* Left Title Area */}
    <Header
      heading={"Dashboard Overview"}
      paragraph={"Monitor your app performance and user engagement"}
    />

    {/* Right Filters */}
    <div className="flex gap-4 w-full md:w-auto">
      {/* <div className="relative w-full md:w-auto">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setIsDropdownOpen(false)}
          className="w-full md:w-auto h-12 appearance-none rounded-lg border border-[#F6B0B5] bg-[#fffcfc] pl-4 pr-10 text-sm md:text-base font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#F6B0B5]"
        >
          {Object.values(translations.statuses).map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </select>

        <FiChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-200 ${iconRotateClass}`}
        />
      </div> */}
    </div>
  </div>

  {/* Revenue Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {revenue.map((rev) => {
      let displayTotal = rev.total_user;
      if (rev.id === 1) {
        displayTotal = maLoading ? "..." : maError ? "-" : monthlyActive !== null ? monthlyActive : rev.total_user;
      }
      if (rev.id === 2) {
        displayTotal = mrLoading ? "..." : mrError ? "-" : monthlyRevenue !== null ? monthlyRevenue.toLocaleString() : rev.total_user;
      }
      if (rev.id === 3) {
        displayTotal = avgLoading ? "..." : avgError ? "-" : averageScore !== null && averageScore !== undefined ? `${averageScore}%` : rev.total_user;
      }

      return (
        <div
          key={rev.id}
          className="col-span-1 border border-[#F6B0B5] rounded-xl p-4 sm:p-6 flex flex-col bg-white"
        >
          <div className="flex items-center gap-3 justify-between">
            <p className="text-sm md:text-base lg:text-lg text-[#EB545E] font-medium">{rev.title}</p>
            <p className="bg-[#E6E6F4] p-2 rounded-lg">
              {rev.icon &&
                React.cloneElement(rev.icon, {
                  className: `w-6 h-6 sm:w-7 sm:h-7 ${rev.icon.props.className || ""}`,
                })}
            </p>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-bold">{displayTotal}</h2>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default OverviewSection;
