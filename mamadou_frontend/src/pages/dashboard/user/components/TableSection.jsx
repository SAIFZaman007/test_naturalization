import { useState } from "react";
import DropDownSection from "./DropDownSection";
import SearchSection from "./SearchSection";
import Table from "./Table";

const TableSection = () => {
  const [statusFilterOne, setStatusFilterOne] = useState("All Status");
  const [statusFilterTwo, setStatusFilterTwo] = useState("All Plans");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="text-[#121111] border border-[#F6B0B5] rounded-xl md:p-5 p-4 py-10 bg-white">
      <div className="lg:flex items-center justify-between md:gap-6 gap-4 md:mb-3 mb-2 lg:space-y-0 space-y-4">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <DropDownSection
          statusFilterOne={statusFilterOne}
          setStatusFilterOne={setStatusFilterOne}
          statusFilterTwo={statusFilterTwo}
          setStatusFilterTwo={setStatusFilterTwo}
        />
      </div>
      <Table
        statusFilterOne={statusFilterOne}
        statusFilterTwo={statusFilterTwo}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default TableSection;
