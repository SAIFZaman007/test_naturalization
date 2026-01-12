import { Search } from "lucide-react";

const SearchBar = ({activeTab, searchQuery, setSearchQuery}) => {
    return (
         <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full  sm:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full  pl-10  pr-4 py-3 border border-[#F6B0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
    );
};

export default SearchBar;