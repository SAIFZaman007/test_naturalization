import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const translationsOne = {
  statuses: {
    active: "All Status",
    inactive: "Active",
    suspended: "Inactive",
    pending: "Suspended",
  },
};

const translationsTwo = {
  statuses: {
    active: "All Plans",
    inactive: "Free",
    suspended: "Basic",
    pending: "Premium",
  },
};

const DropDownSection = ({
  statusFilterOne,
  setStatusFilterOne,
  statusFilterTwo,
  setStatusFilterTwo,
}) => {
  const [isDropdownOneOpen, setIsDropdownOneOpen] = useState(false);
  const [isDropdownTwoOpen, setIsDropdownTwoOpen] = useState(false);

  const handleStatusChangeOne = (e) => {
    setStatusFilterOne(e.target.value);
    setIsDropdownOneOpen(false);
  };
  const handleStatusChangeTwo = (e) => {
    setStatusFilterTwo(e.target.value);
    setIsDropdownTwoOpen(false);
  };

  const baseIconClass =
    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 transition-transform duration-200";

  return (
    <div className="flex items-center gap-6 w-full">
      {/* First Dropdown */}
      <div className="flex gap-4 w-full">
        <div className="relative w-full">
          <select
            // Use statusFilterOne for value ---
            value={statusFilterOne}
            onChange={handleStatusChangeOne}
            onFocus={() => setIsDropdownOneOpen(true)}
            onBlur={() => setIsDropdownOneOpen(false)}
            className="h-12 w-full appearance-none rounded-lg border border-[#F6B0B5] bg-[#fffcfc] pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#F6B0B5]"
          >
            <option value="All Status">
              {translationsOne.statuses.active}
            </option>
            <option value="active">{translationsOne.statuses.inactive}</option>
            <option value="inactive">
              {translationsOne.statuses.suspended}
            </option>
            <option value="suspended">
              {translationsOne.statuses.pending}
            </option>
          </select>

          {/* Add conditional rotation class --- */}
          <FiChevronDown
            className={`${baseIconClass} ${
              isDropdownOneOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Second Dropdown */}
      <div className="flex gap-4 w-full">
        <div className="relative w-full">
          <select
            // statusFilterTwo for value ---
            value={statusFilterTwo}
            onChange={handleStatusChangeTwo}
            onFocus={() => setIsDropdownTwoOpen(true)}
            onBlur={() => setIsDropdownTwoOpen(false)}
            className="h-12 w-full appearance-none rounded-lg border border-[#F6B0B5] bg-[#fffcfc] pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#F6B0B5]"
          >
            <option value="All Plans">{translationsTwo.statuses.active}</option>
            <option value="Free">{translationsTwo.statuses.inactive}</option>
            <option value="Basic">{translationsTwo.statuses.suspended}</option>
            <option value="Premium">{translationsTwo.statuses.pending}</option>
          </select>

          {/* conditional rotation class --- */}
          <FiChevronDown
            className={`${baseIconClass} ${
              isDropdownTwoOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default DropDownSection;