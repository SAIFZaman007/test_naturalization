import React, { useEffect, useState } from "react";
import OverviewSecondSection from "./components/OverviewSecondSection";
import OverviewSection from "./components/OverviewSection";
import TopPerformingThemes from "./components/TopPerformingThemes";

const DashboardOverView = () => {
  const [themes, setThemes] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          "https://mamadou.mtscorporate.com/api/v1/dashboard/all-courses-stats",
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;

        // Map API response into themes used by the child
        const mapped = data.map((item) => ({
          name: item.course_name,
          completions: item.completed_count ?? item.total_students ?? 0,
          percentage: Math.round(item.average_progress ?? 0),
        }));

        // Sort themes by performance percentage descending (highest first)
        mapped.sort((a, b) => b.percentage - a.percentage);
        setThemes(mapped);

        // Compute weighted average by total_students when available
        const totalStudents = data.reduce(
          (sum, item) => sum + (item.total_students ?? 0),
          0
        );
        let avg = 0;
        if (totalStudents > 0) {
          const weighted = data.reduce(
            (sum, item) => sum + (item.average_progress ?? 0) * (item.total_students ?? 0),
            0
          );
          avg = weighted / totalStudents;
        } else if (data.length > 0) {
          avg = data.reduce((s, it) => s + (it.average_progress ?? 0), 0) / data.length;
        }
        setAverageScore(Number.isFinite(avg) ? Number(avg.toFixed(1)) : null);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="">
      <OverviewSection averageScore={averageScore} loading={loading} error={error} />
      <OverviewSecondSection />
      <TopPerformingThemes themes={themes} loading={loading} error={error} />
    </div>
  );
};

export default DashboardOverView;
