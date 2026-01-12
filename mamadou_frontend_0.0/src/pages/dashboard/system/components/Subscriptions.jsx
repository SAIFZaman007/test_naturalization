import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDoneAll } from "react-icons/md";
import Modal from "./../../../../components/Modal";
import AddPlanModal from "../../user/components/AddPlanModal";
import EditPlanModal from "../../user/components/EditPlanModal";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import AlertDialog from "../../../../components/common/AlertDialog";
import { api } from "../../../../api/axiosInstance";

const Subscriptions = () => {
  const [addPlanOpen, setIsAddPlanOpen] = useState(false);
  const [editPlanOpen, setIsEditPlanOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Custom dialog states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, planId: null });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: "info", title: "", message: "" });

  // Fetch subscription plans from API
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/subscription_plans/?skip=0&limit=10");
      setPlans(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlanOpen = () => {
    setIsAddPlanOpen(true);
  };

  const handleAddPlanClose = () => {
    setIsAddPlanOpen(false);
    fetchPlans(); // Refresh plans after adding
  };

  const handleEditPlanOpen = async (plan) => {
    try {
      // Fetch plan details from API
      const response = await api.get(`/subscription_plans/${plan.id}`);
      setSelectedPlan(response.data);
      setIsEditPlanOpen(true);
    } catch (error) {
      setAlertDialog({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to load plan details. Please try again."
      });
    }
  };

  const handleEditPlanClose = () => {
    setIsEditPlanOpen(false);
    setSelectedPlan(null);
    fetchPlans(); // Refresh plans after editing
  };

  const handleDeleteClick = (planId) => {
    setConfirmDialog({ isOpen: true, planId });
  };

  const handleDeleteConfirm = async () => {
    const planId = confirmDialog.planId;
    setConfirmDialog({ isOpen: false, planId: null });

    try {
      setDeletingId(planId);
      await api.delete(`/subscription_plans/${planId}`);
      // Refresh list after delete
      await fetchPlans();
      setAlertDialog({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Plan deleted successfully!"
      });
    } catch (error) {
      setAlertDialog({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to delete plan. Please try again."
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col text-[#121111] border border-[#F6B0B5] rounded-xl px-2 md:px-4 py-4 pb-8 bg-white w-full ">
      {/* Header */}
      <div className="flex   sm:flex-row items-start sm:items-center justify-between gap-6 md:px-12  sm:gap-0 py-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#5F0006] pt-2 py-2">
          Subscriptions
        </h2>
        <button
          onClick={handleAddPlanOpen}
          className="flex items-center gap-2 px-6 py-2 md:px-8 md:py-3 border border-[#F18A91] text-white rounded-xl font-medium text-sm md:text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg whitespace-nowrap"
        >
          <IoMdAdd className="w-4 h-4 md:w-5 md:h-5" /> Add Plan
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-7 mt-6 justify-center">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading plans...</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subscription plans found
          </div>
        ) : (
          plans.map((plan) => {
            const priceColorClass =
              plan.plan_price > 0 ? "text-[#000091]" : "text-black";

            return (
              <div
                key={plan.id}
                className="flex flex-col justify-between border border-[#F6B0B5] rounded-xl p-5 w-full sm:w-[48%] lg:w-[30%]"
              >
                {/* Title & Price */}
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-black">
                    {plan.title}
                  </h2>
                  <h2
                    className={`text-xl md:text-2xl font-bold ${priceColorClass} mt-1`}
                  >
                    € {plan.plan_price}
                  </h2>
                  <p className="text-sm text-[#404040] mt-1">{plan.duration}</p>

                  {/* Features */}
                  <div className="flex flex-col gap-2 mt-4 text-[#171717] text-base">
                    {plan.features.map((feature, i) => (
                      <p key={i} className="flex items-center gap-2">
                        <MdDoneAll className="w-4 h-4 md:w-5 md:h-5 text-[#171717]" />
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex flex-row gap-4 items-center justify-center">
                  <button
                    onClick={() => handleEditPlanOpen(plan)}
                    className="mt-5 w-full px-6 py-2 md:px-8 md:py-3 text-white font-medium text-base rounded-xl bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg flex justify-center items-center gap-2 whitespace-nowrap"
                  >
                    Edit Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(plan.id)}
                    disabled={deletingId === plan.id}
                    className="mt-5 w-full px-6 py-2 md:px-8 md:py-3 text-white font-medium text-base rounded-xl bg-red-600 hover:bg-red-700 shadow-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === plan.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Plan Modal */}
      {addPlanOpen && (
        <Modal
          className="w-full max-w-md h-auto lg:w-[40%] lg:h-auto max-h-[90vh] overflow-auto"
          closeModal={handleAddPlanClose}
        >
          <AddPlanModal closeModal={handleAddPlanClose} />
        </Modal>
      )}

      {/* Edit Plan Modal */}
      {editPlanOpen && selectedPlan && (
        <Modal
          className="w-full max-w-md h-auto lg:w-[40%] lg:h-auto max-h-[90vh] overflow-auto"
          closeModal={handleEditPlanClose}
        >
          <EditPlanModal
            closeModal={handleEditPlanClose}
            planData={selectedPlan}
          />
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, planId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        type={alertDialog.type}
        title={alertDialog.title}
        message={alertDialog.message}
      />
    </div>
  );
};

export default Subscriptions;
