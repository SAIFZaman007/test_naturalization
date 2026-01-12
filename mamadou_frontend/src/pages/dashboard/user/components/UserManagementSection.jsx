import Header from "../../../../components/Header";

const UserManagementSection = () => {
  return (
    <div className="text-[#121111]">
      <div className="lg:mb-7 md:mb-6 mb-5 md:gap-0 gap-4 flex justify-between items-center">
        <Header
          heading={"User Management"}
          paragraph={" Manage users, subscriptions, and support requests"}
        />
      </div>
    </div>
  );
};

export default UserManagementSection;
