import { BiSearch } from "react-icons/bi";

const SearchSection = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
      <div className="p-3 text-[#F6B0B5]">
        <BiSearch size={20} />
      </div>

      <input
        type="text"
        placeholder="Search users by name, email, or ID..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full py-3 pr-4 text-gray-700 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
      />
    </div>
  );
};

export default SearchSection;
