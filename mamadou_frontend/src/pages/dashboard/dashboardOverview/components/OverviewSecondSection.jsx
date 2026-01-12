import SubscriptionDistribution from "./SubscriptionDistribution";
import UserGrowthChart from "./UserGrowthChart";

const OverviewSecondSection = () => {
  return (
    <div className="text-[#121111] my-8 grid lg:grid-cols-2 grid-cols-1 gap-6">
      <div className="col-span-1">
        <UserGrowthChart />
      </div>
      <div className="">
        <SubscriptionDistribution />
      </div>
    </div>
  );
};

export default OverviewSecondSection;
