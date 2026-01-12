import AdvancedAnalytics from "./components/AdvancedAnalytics";
import MostFailedQuestions from "./components/MostFailedQuestions";
import MostViewedThemes from "./components/MostViewedThemes";

const AnalyticsView = () => {
  return (
    <div>
      <AdvancedAnalytics />
      <MostFailedQuestions />
      <MostViewedThemes />
    </div>
  );
};

export default AnalyticsView;
