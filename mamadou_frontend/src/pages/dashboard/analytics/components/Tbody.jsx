import { useState } from "react";
import { GoChevronRight } from "react-icons/go";
import DetailsModal from "./DetailsModal";

const Tbody = ({ fakeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row) => {
    setSelectedRow(row);
    setIsOpen(true);
  };

  const handleClose = () => {
    setSelectedRow(null);
    setIsOpen(false);
  };
  return (
    <tbody className="bg-white divide-y divide-[#F6B0B5]">
      {/* Table Body */}
      {fakeData.map((user) => (
        <tr key={user.id} className="hover:bg-pink-50 transition duration-150">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="md:text-base text-sm font-[500]  text-[#000]">
              {user.id}
            </div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-4 py-1 inline-flex text-sm md:text-base leading-5 font-[500] border border-[#F6B0B5] rounded-full p-1`}
            >
              {user.category}
            </span>
          </td>

          <td className="px-2 py-4 whitespace-nowrap text-sm">
            <span
              className={`px-4 py-1 inline-flex text-sm md:text-base leading-5 font-[500] `}
            >
              {user.question}
            </span>
          </td>

          {/* *** UPDATED TD FOR PROGRESS BAR *** */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="w-24 bg-pink-100 rounded-full h-2.5">
                <div
                  className="bg-[#E7333F] h-2.5 rounded-full"
                  style={{ width: user.success_rate }}
                ></div>
              </div>
              <span className="text-sm md:text-base font-[500] text-[#000]">
                {user.success_rate}
              </span>
            </div>
          </td>

          <td className="px-6 pr-10 py-4 whitespace-nowrap text-sm md:text-base leading-5 font-[500]">
            {user.attempts}
          </td>

          <td
            onClick={() => handleOpen(user)}
            className="px-6 py-4 cursor-pointer whitespace-nowrap text-sm md:text-base leading-5 font-[600] text-black flex items-center gap-2"
          >
            Details <GoChevronRight className="md:w-7 w-6 md:h-7 h-6" />
          </td>
        </tr>
      ))}

      {/* Details Modal */}
      {isOpen && (
        <DetailsModal
          fakeData={fakeData}
          selectedRow={selectedRow}
          handleClose={handleClose}
        />
      )}
    </tbody>
  );
};

export default Tbody;
