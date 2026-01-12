import { FiCheckCircle, FiEye } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import CurrentITems from "../../../../components/CurrentItems";
import { useState } from "react";
import Modal from "../../../../components/Modal";
import api from "../../../../api/ApiService";
import DeleteModal from "../../content/components/Modals/DeleteModal";
import { Trash2 } from "lucide-react";

const Tbody = ({
  currentItems,
  getStatusClasses,
  getSubscriptionClasses,
  onUserDeleted,
  onUserUpdated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [studyHours, setStudyHours] = useState("-");
  const [studyLoading, setStudyLoading] = useState(false);
  const [changingIds, setChangingIds] = useState([]);

  const selectStatusClasses = (token) => {
    switch ((token || "").toString().toLowerCase()) {
      case "active":
        return "bg-[#000091] text-white";
      case "inactive":
        return "bg-[#E1000F] text-white";
      case "suspend":
        return "bg-[#E1000F] text-white";
      default:
        return "bg-gray-100 text-[#5F0006]";
    }
  };

  const deleteOpenModal = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModal(true);
  };

  const deleteCloseModal = () => {
    setIsDeleteModal(false);
    setDeleteTargetId(null);
  };

  const openModal = async (id) => {
    setIsOpen(true);
    setModalLoading(true);
    setSelectedUser(null);
    setStudyHours("-");
    setStudyLoading(false);
    try {
      // First try the list/filter endpoint and pick the matching user object
      const listRes = await api.get(`/dashboard/user/all/filter/active`, {
        params: { skip: 0, limit: 100 },
        showToast: false,
      });
      let found = null;
      if (listRes && listRes.success) {
        const arr = Array.isArray(listRes.data) ? listRes.data : listRes.data?.data || listRes.data?.results || [];
        found = arr.find((it) => (it.user && (it.user.id === id || it.user.id === id)) || it.id === id || it.user_id === id);
      }

      if (found) {
        setSelectedUser(found);
        // fetch study time for this user via per-user endpoint
        try {
          setStudyLoading(true);
          const targetId = found.user?.id || found.user_id || id;
          const timeRes = await api.get(`/time/user/${encodeURIComponent(targetId)}`, { showToast: false });
          const entry = timeRes && timeRes.success ? timeRes.data : timeRes?.data || null;
          if (entry && typeof entry.total_time !== 'undefined') {
            const seconds = Number(entry.total_time || 0);
            const minutes = Math.round((seconds / 60) * 10) / 10; // 1 decimal
            if (minutes >= 60) {
              const hours = Math.round((minutes / 60) * 10) / 10;
              setStudyHours(`${hours}h`);
            } else {
              setStudyHours(`${minutes}m`);
            }
          } else {
            setStudyHours("-");
          }
        } catch (err) {
          setStudyHours("-");
        } finally {
          setStudyLoading(false);
        }
      } else {
        // Fallback: try the detailed endpoint if list did not include the item
        const res = await api.get(`/dashboard/users/${encodeURIComponent(id)}`, { showToast: false });
        const payload = res && res.success ? res.data : null;
        if (payload) {
          setSelectedUser(payload);
        } else {
          // final fallback to /users/{id}
          const fallback = await api.get(`/users/${id}`, { showToast: false });
          setSelectedUser(fallback && fallback.success ? fallback.data : null);
        }
      }
    } catch (err) {
      setSelectedUser(null);
      setStudyHours("-");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
    setModalLoading(false);
  };

  const statusToHideDelete = "Suspended";

  return (
    <tbody className="bg-white divide-y divide-[#F6B0B5]">
      {/* Table Body */}
      {currentItems.map((user) => (
        <tr key={user.id} className="hover:bg-pink-50 transition duration-150">
          <td className="px-4 py-3 whitespace-nowrap">
            <div className=" text-sm font-[500]  text-[#000]">{user.name}</div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className=" text-sm font-[500]  text-[#000]">{user.email}</div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <div className=" text-sm font-[500]  text-[#000]">{user.phone_number}</div>
          </td>

          <td className="px-4 py-3 whitespace-nowrap">
            <div className="w-36">
              <select
                value={
                  // normalize token for select value
                  (user.status || "").toString().toLowerCase() === "suspended"
                    ? "suspend"
                    : (user.status || "").toString().toLowerCase()
                }
                onChange={async (e) => {
                  const newToken = e.target.value; // 'active' | 'inactive' | 'suspend'
                  // optimistic UI: show loading for this row
                  setChangingIds((prev) => [...prev, user.id]);
                  try {
                    // call PATCH /dashboard/user/status/change/{id}?acc_status={token}
                    await api.patch(
                      `/dashboard/user/status/change/${encodeURIComponent(user.id)}`,
                      null,
                      { params: { acc_status: newToken }, showToast: true }
                    );

                    // Map token back to UI label
                    const label =
                      newToken === "active"
                        ? "ACTIVE"
                        : newToken === "inactive"
                        ? "INACTIVE"
                        : "SUSPENDED";

                    if (typeof onUserUpdated === "function") onUserUpdated(user.id, label);
                  } catch (err) {
                  } finally {
                    setChangingIds((prev) => prev.filter((i) => i !== user.id));
                  }
                }}
                disabled={changingIds.includes(user.id)}
                className={`h-9 w-full rounded-lg pl-3 pr-8 text-sm font-[600] ${selectStatusClasses(
                  (user.status || "").toString().toLowerCase() === "suspended"
                    ? "suspend"
                    : (user.status || "").toString().toLowerCase()
                )} ${changingIds.includes(user.id) ? 'opacity-90 cursor-not-allowed' : ''}`}
              >
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
                <option value="suspend">SUSPENDED</option>
              </select>
            </div>
          </td>

          <td className="px-4 py-3 whitespace-nowrap text-sm">
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-[600] rounded-full items-center justify-center ${getSubscriptionClasses(
                user.subscription
              )}`}
            >
              {user.subscription}
            </span>
          </td>

          <td className="px-4 pl-9 py-3 whitespace-nowrap text-sm  leading-5 font-[500]">
            {user.registrationDate}
          </td>

          <td className="px-4 pl-7 py-3 whitespace-nowrap text-sm  leading-5 font-[500]">
            {user.score}
          </td>

          <td className="px-4 py-3 whitespace-nowrap text-right text-sm  leading-5 font-[500]">
            <div className="flex justify-end space-x-2">
              {/* View Details Button (Always Shown) */}
              <button
                onClick={() => openModal(user.id)}
                title="View Details"
                className="text-gray-600 hover:text-pink-600 p-2 rounded-md hover:bg-pink-50"
                style={{ width: "40px", height: "40px" }}
              >
                <FiEye size={18} />
              </button>

              {/* Delete Button (Conditional Rendering based on status) */}
              {user.status !== statusToHideDelete && (
                <button
                  onClick={() => deleteOpenModal(user.id)}
                  title="Delete User"
                  className="text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-red-50"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}

      {/* Delete Modal */}
      {isDeleteModal && (
        <DeleteModal
          isOpen={isDeleteModal}
          onClose={deleteCloseModal}
          itemName="user"
          onConfirm={async () => {
            try {
              const res = await api.delete(`/users/${deleteTargetId}`);
              // ApiService returns ApiResponse
              if (res && res.success) {
                // notify parent to remove user from list if provided
                if (typeof onUserDeleted === "function")
                  onUserDeleted(deleteTargetId);
              }
            } catch (err) {
            }
          }}
        />
      )}

      {/*View Details Modal */}
      {isOpen && (
        <Modal
          className={"lg:!w-[40%] lg:!h-[65%]"}
          currentItems={currentItems}
          closeModal={closeModal}
        >
          <div className="flex flex-col gap-4 ">
            {modalLoading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : selectedUser ? (
              <>
                <div>
                  <div className="text-[#5F0006]">
                    <h2 className="font-[700] text-2xl">User Profile</h2>
                    <p className="text-base text-[#F18A91]">
                      Detailed user information and activity
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="bg-[#F6B0B5] p-3 rounded-full">
                      <h2 className="text-white font-[600] text-[26px]">
                        {`${selectedUser.user?.first_name?.[0] || selectedUser.user_details?.first_name?.[0] || selectedUser.first_name?.[0] || ""}${
                          selectedUser.user?.last_name?.[0] || selectedUser.user_details?.last_name?.[0] || selectedUser.last_name?.[0] || ""
                        }`.toUpperCase() || "-"}
                      </h2>
                    </div>
                    <div>
                      <h3 className="font-[700] text-xl text-[#5F0006]">{`${
                        selectedUser.user?.first_name || selectedUser.user_details?.first_name || selectedUser.first_name || "-"
                      } ${selectedUser.user?.last_name || selectedUser.user_details?.last_name || selectedUser.last_name || "-"}`}</h3>
                      <p className="text-base font-[500] text-[#F18A91]">
                        {selectedUser.user?.email || selectedUser.user_details?.email || selectedUser.email || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 py-4">
                  <div className="bg-[#E6E6F4] p-3 rounded-xl flex flex-col items-center">
                    <p className="text-sm md:text-base font-medium text-[#F18A91]">
                      Average Score
                    </p>
                    <h2 className="font-bold text-xl sm:text-2xl md:text-[26px] text-[#000091]">
                      {
                        // Prefer the success_rate from the list payload shape: selectedUser.success_rate
                        typeof selectedUser?.success_rate !== 'undefined'
                          ? `${selectedUser.success_rate}%`
                          : typeof selectedUser?.user_details?.success_rate !== 'undefined'
                          ? `${selectedUser.user_details.success_rate}%`
                          : typeof selectedUser?.user?.success_rate !== 'undefined'
                          ? `${selectedUser.user.success_rate}%`
                          : "-"
                      }
                    </h2>
                  </div>

                  <div className="bg-[#FCE6E7] text-[#E7333F] p-3 rounded-xl flex flex-col items-center">
                    <p className="text-sm md:text-base font-medium text-[#F18A91]">
                      Tests Completed
                    </p>
                    <h2 className="font-bold text-xl sm:text-2xl md:text-[26px]">
                      {typeof selectedUser?.score === 'number' ? selectedUser.score : (selectedUser.tests_completed ?? "-")}
                    </h2>
                  </div>

                  <div className="bg-[#B0B0DD] p-3 rounded-xl flex flex-col items-center">
                    <p className="text-sm md:text-base font-medium text-[#F18A91]">
                      Study Hours
                    </p>
                    <h2 className="font-bold text-xl sm:text-2xl md:text-[26px] text-[#121111]">
                      {studyLoading ? "..." : studyHours}
                    </h2>
                  </div>
                </div>

                <div>
                  <h2 className="font-[700] text-xl py-3">In Progress Activity</h2>
                  <div className="space-y-2.5">
                    {Array.isArray(selectedUser.in_progress_lessons) && selectedUser.in_progress_lessons.length > 0 ? (
                      selectedUser.in_progress_lessons.map((lesson, idx) => (
                        <p
                          key={lesson.id || idx}
                          className="flex items-center p-2 bg-[#E6E6F4] rounded-lg gap-2"
                        >
                          <FiCheckCircle className="md:w-6 md:h-6 w-5 h-5 text-[#7373af]" />
                          <span className="text-sm text-[#E7333F] font-[500]">
                            {lesson.name} — {lesson.my_progress ?? lesson.progress ?? 0}%
                          </span>
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">-</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No details available
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* No results found */}
      {<CurrentITems currentItems={currentItems} />}
    </tbody>
  );
};

export default Tbody;
