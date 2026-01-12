import Header from "../../../../components/Header";

const SystemAdministration = () => {
  return (
    <div className="text-[#121111]">
      <div className="lg:mb-7 md:mb-6 mb-5 md:gap-0 gap-4 flex justify-between items-center">
        <Header
          heading={"System Administration"}
          paragraph={" Manage system settings, roles, and monitor health"}
        />
      </div>
    </div>
  );
};

export default SystemAdministration;
