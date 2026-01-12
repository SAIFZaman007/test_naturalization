const Thead = () => {
  return (
    <thead>
      <tr className="bg-white">
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          User
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Email
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Phone
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Status
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Subscription
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Registration
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-sm font-[700]  text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Total Score
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-right pr-7 text-sm font-[700] text-[#7C0008] uppercase tracking-wider border-b border-[#F6B0B5]"
        >
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default Thead;
