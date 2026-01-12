const ResponsiveTable = () => {
  return (
    <style>{`
        .table-wrapper::-webkit-scrollbar {
          height: 10px;
        }
        .table-wrapper::-webkit-scrollbar-track {
          background: #f8d7da;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .table-wrapper::-webkit-scrollbar-thumb {
          background: #F18A91;
          border-radius: 10px;
        }
        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #E1000F;
        }
        .table-wrapper {
          scrollbar-width: thin;
          scrollbar-color: #F18A91 #f8d7da;
        }
      `}</style>
  );
};
 
export default ResponsiveTable;