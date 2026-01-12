const Thead = () => {
  return (
    <thead>
      <tr className="bg-white">
        <th
          scope="col"
          className="px-6 py-3 text-left text-sm font-[700] text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5] whitespace-nowrap"
        >
          Question ID
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Theme
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Questions Text
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Failure Rate
        </th>
        <th
          scope="col"
          className="px-6 pl-2 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Attempts
        </th>
        <th
          scope="col"
          className="px-6 pl-10 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          view
        </th>
      </tr>
    </thead>
  );
};

export default Thead;
