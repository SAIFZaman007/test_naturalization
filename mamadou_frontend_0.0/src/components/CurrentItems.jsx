const CurrentITems = ({ currentItems }) => {
  return (
    <div>
      {currentItems.length === 0 && (
        <tr>
          <td colSpan="7" className="p-4 text-center text-[#f13f4b]">
            No results found for the selected filters.
          </td>
        </tr>
      )}
    </div>
  );
};

export default CurrentITems;
