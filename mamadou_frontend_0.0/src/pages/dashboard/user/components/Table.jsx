import { useState, useEffect } from "react";
import Thead from "./Thead";
import Tbody from "./Tbody";
import ResponsiveTable from "../../../../components/ResponsiveTable";
import Pagination from "../../../../components/Pagination";
import api from "../../../../api/ApiService";
import { toast } from "react-toastify";

const Table = ({ statusFilterOne, statusFilterTwo, searchQuery }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 7;

  // Fetch users from API; if a status filter is selected, call the filter endpoint.
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let allUsers = [];

        // If a specific status filter is applied, call the filter API directly
        if (statusFilterOne && statusFilterOne !== "All Status") {
          // Normalize status token to backend-expected values.
          // Accept either label forms ("Active", "Inactive", "Suspended")
          // or token forms ("active", "inactive", "suspended") coming from dropdown.
          let acc_status_token = statusFilterOne.toString().toLowerCase();

          // Backend expects 'suspend' (not 'suspended'), map accordingly
          if (acc_status_token === "suspended") acc_status_token = "suspend";

          // Defensive: if the UI somehow sends human labels like 'Active', still handled by toLowerCase()
          const response = await api.get(`/dashboard/user/all/filter/${encodeURIComponent(acc_status_token)}`, { showToast: false });
          let dataArray = [];
          if (response && response.success) {
            if (Array.isArray(response.data)) dataArray = response.data;
            else if (Array.isArray(response.data?.data)) dataArray = response.data.data;
            else if (Array.isArray(response.data?.users)) dataArray = response.data.users;
            else if (Array.isArray(response.data?.results)) dataArray = response.data.results;
          }
          allUsers = dataArray;
        } else {
          // No status filter -> fetch all users in pages
          let skip = 0;
          const limit = 100;
          let hasMore = true;
          while (hasMore) {
            const response = await api.get(`/dashboard/user/all`, { params: { skip, limit }, showToast: false });
            let dataArray = [];
            if (response && response.success) {
              if (Array.isArray(response.data)) dataArray = response.data;
              else if (Array.isArray(response.data?.data)) dataArray = response.data.data;
              else if (Array.isArray(response.data?.users)) dataArray = response.data.users;
              else if (Array.isArray(response.data?.items)) dataArray = response.data.items;
              else if (Array.isArray(response.data?.results)) dataArray = response.data.results;
            }
            if (dataArray.length > 0) {
              allUsers = [...allUsers, ...dataArray];
              if (dataArray.length < limit) hasMore = false; else skip += limit;
            } else {
              hasMore = false;
            }
          }
        }

        // Normalize and map user objects
        const users = allUsers
          .filter((item) => {
            const u = item?.user || item;
            return (u?.role || '').toUpperCase() === 'USER';
          })
          .map((item) => {
            const u = item?.user || item;
            const id = u?.id || item?.id || '-';
            const first = u?.first_name || u?.firstName || '-';
            const last = u?.last_name || u?.lastName || '-';
            const phone = u?.phone_number || u?.phone || '-';
            const email = u?.email || '-';
            const status = u?.account_status || u?.status || 'Inactive';
            const subscription = item?.subscription || u?.subscription || 'Free';
            const registrationDate = u?.created_at || u?.createdAt;

            return {
              id: id,
              phone_number: phone,
              name: `${first} ${last}`.trim() || '-',
              email: email,
              status: status,
              subscription: subscription,
              registrationDate: registrationDate ? new Date(registrationDate).toLocaleDateString() : '-',
              score: typeof item?.score !== 'undefined' ? item.score : '-',
              isChecked: false,
            };
          });

        setUserData(users);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [statusFilterOne]); // Re-run when status filter changes

  const getStatusClasses = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "ACTIVE":
        return "bg-[#000091] text-[#fff]";
      case "INACTIVE":
        return "bg-[#E1000F] text-[#fff]";
      case "SUSPENDED":
        return "bg-[#E1000F] text-[#fff]";
      default:
        return "bg-gray-100 text-[#fff]";
    }
  };

  const getSubscriptionClasses = (subscription) => {
    const s = (subscription || "").toString().toLowerCase();
    if (s.includes("premium")) return "bg-[#5454B5] text-white";
    if (s.includes("basic")) return "bg-[#B0B0DD] text-white";
    if (s.includes("free")) return "bg-[#F6B0B5] text-[#5F0006]";
    return "bg-gray-100 text-white";
  };

  const filteredData = userData.filter((user) => {
    // Normalize selected status to a token: 'all', 'active', 'inactive', 'suspend'
    const selectedToken =
      statusFilterOne === "All Status"
        ? "all"
        : statusFilterOne.toString().toLowerCase() === "suspended"
        ? "suspend"
        : statusFilterOne.toString().toLowerCase();

    const userStatusToken = (user.status || "").toString().toLowerCase();

    const statusMatch =
      selectedToken === "all" ||
      (selectedToken === "active" && userStatusToken === "active") ||
      (selectedToken === "inactive" && userStatusToken === "inactive") ||
      ((selectedToken === "suspended" || selectedToken === "suspend") &&
        (userStatusToken === "suspended" || userStatusToken === "suspend" || userStatusToken === "suspended"));

    const subscriptionMatch =
      statusFilterTwo === "All Plans" || user.subscription === statusFilterTwo;

    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toString().includes(searchLower);

    return statusMatch && subscriptionMatch && searchMatch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilterOne, statusFilterTwo, searchQuery]);

  const totalResults = filteredData.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const indexOfLastItem = currentPage * resultsPerPage;
  const indexOfFirstItem = indexOfLastItem - resultsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-none p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ResponsiveTable />
      <div className="bg-white rounded-xl shadow-none">
        <div className="overflow-x-auto table-wrapper">
          <table className="min-w-full divide-y divide-[#F6B0B5] border-b border-[#F6B0B5]">
            <Thead />
            <Tbody
              currentItems={currentItems}
              getSubscriptionClasses={getSubscriptionClasses}
              getStatusClasses={getStatusClasses}
                onUserDeleted={(id) => setUserData((prev) => prev.filter((u) => u.id !== id))}
                onUserUpdated={(id, newStatus) =>
                  setUserData((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
                  )
                }
            />
          </table>
        </div>

        {currentItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          totalPages={totalPages}
          totalResults={totalResults}
        />
      </div>
    </div>
  );
};

export default Table;
