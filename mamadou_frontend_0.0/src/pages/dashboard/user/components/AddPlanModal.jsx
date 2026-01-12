// const AddPlanModal = ({closeModal}) => {
//   return (
//     <div className="text-[#5F0006] flex flex-col gap-5">
//       <p className="font-[700] text-2xl">Add Plan</p>
//       <div className="flex flex-col gap-3">
//         <div className="">
//           <p className="text-base">Tittle</p>
//           <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//             <input
//               type="text"
//               placeholder="Enter card name"
//               onChange=""
//               className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//             />
//           </div>
//         </div>

//         <div className="">
//           <p className="text-base">Plan Price</p>
//           <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//             <input
//               type="text"
//               placeholder="€ 0.00"
//               onChange=""
//               className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//             />
//           </div>
//         </div>

//         <div className="">
//           <p className="text-base">Price ID</p>
//           <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//             <input
//               type="text"
//               placeholder="price_1SOfogQ1BLrLdBOmlW9z0rWv"
//               onChange=""
//               className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <button
//           className={`mt-auto px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg flex justify-center items-center text-center gap-2`}
//         >
//          Monthly
//         </button>
//         <button
//           className={`mt-auto px-8 py-3 border-[#F18A91] rounded-xl font-medium text-base bg-[#838383] text-white shadow-lg flex justify-center items-center text-center gap-2`}
//         >
//          Yearly
//         </button>
//       </div>

//       <div className="">
//         <h2 className="font-[700] text-2xl">Feature Options</h2>
//         <div className="flex flex-col space-y-10">
//           <div className="md:my-2.5 sm:my-2 my-1.5">
//             <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//               <input
//                 type="text"
//                 placeholder="Feature Option 1"
//                 onChange=""
//                 className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//               />
//             </div>
//           </div>

//           <div className="md:my-2.5 sm:my-2 my-1.5">
//             <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//               <input
//                 type="text"
//                 placeholder="Feature Option 2"
//                 onChange=""
//                 className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//               />
//             </div>
//           </div>

//           <div className="md:my-2.5 sm:my-2 my-1.5">
//             <div className="flex items-center w-full bg-white rounded-lg border border-[#F6B0B5] shadow-sm">
//               <input
//                 type="text"
//                 placeholder="Feature Option 3"
//                 onChange=""
//                 className="w-full py-2 text-gray-700 px-2 placeholder-[#F6B0B5] focus:outline-none focus:ring-0 border-none"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-end gap-4">
//         <button onClick={closeModal}
//           className={`mt-auto px-8 py-3 border border-[#F18A91] rounded-xl font-medium text-base text-black`}
//         >
//          Cancel
//         </button>
//         <button
//           className={`mt-auto px-8 py-3 border-[#F18A91] text-[#fff] rounded-xl font-medium text-base bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg flex justify-center items-center text-center gap-2`}
//         >
//          Save
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddPlanModal;

import React, { useState } from "react";
import { api } from "../../../../api/axiosInstance";
import AlertDialog from "../../../../components/common/AlertDialog";

const AddPlanForm = ({ closeModal }) => {
  const [duration, setDuration] = useState("Monthly");
  const [title, setTitle] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [features, setFeatures] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState({ isOpen: false, type: "info", title: "", message: "" });

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validate inputs
      if (!title.trim()) {
        setAlertDialog({
          isOpen: true,
          type: "error",
          title: "Validation Error",
          message: "Plan name is required."
        });
        setIsLoading(false);
        return;
      }
      
      // Prepare features array (only include non-empty features)
      const validFeatures = features.filter(f => f.trim() !== "");
      
      // Prepare payload
      const payload = {
        title: title.trim(),
        plan_price: parseFloat(planPrice) || 0,
        duration: duration,
        features: validFeatures
      };

      // Make POST request
      const response = await api.post("/subscription_plans/", payload);
      
      // Show success message
      setAlertDialog({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Plan created successfully!"
      });
      
      // Close modal after a short delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setAlertDialog({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.response?.data?.detail || "Failed to create plan. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="text-[#5F0006] flex flex-col gap-6 w-full  py-6">
      {/* Title */}
      <p className="font-bold text-2xl">Add Plan</p>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">Enter Plan Name</p>
          <input
            type="text"
            placeholder="Premium Plan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full py-2 px-3 text-gray-700 placeholder-[#F6B0B5] bg-white border border-[#F6B0B5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E1000F]"
          />
          <p className="text-xs text-gray-500">Enter Plan Like : Free Plan or Basic Plan or Premium Plan</p>
        </div>

        {/* Plan Price */}
        <div className="flex flex-col gap-2">
          <p className="text-base font-medium">Plan Price</p>
          <input
            type="number"
            placeholder="€ 0.00"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            className="w-full py-2 px-3 text-gray-700 placeholder-[#F6B0B5] bg-white border border-[#F6B0B5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E1000F]"
          />
        </div>

        {/* Price ID */}
        {/* <div className="flex flex-col gap-2">
          <p className="text-base font-medium">Price ID</p>
          <input
            type="text"
            placeholder="price_1SOfogQ1BLrLdBOmlW9z0rWv"
            className="w-full py-2 px-3 text-gray-700 placeholder-[#F6B0B5] bg-white border border-[#F6B0B5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E1000F]"
          />
        </div> */}
      </div>

      {/* Plan Type Buttons */}
      <div>
        <p className="text-base font-medium">Plan Duration</p>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mt-4">
          {/* Primary Button */}
          <button
            type="button"
            onClick={() => setDuration("Monthly")}
            aria-pressed={duration === "Monthly"}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base lg:text-lg font-medium text-white rounded-xl transition-all duration-200 ${
              duration === "Monthly"
                ? "bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg ring-2 ring-[#E1000F]"
                : "bg-[#838383] shadow-sm"
            }`}
          >
            Monthly
          </button>

          {/* Secondary Button */}
          <button
            type="button"
            onClick={() => setDuration("Yearly")}
            aria-pressed={duration === "Yearly"}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base lg:text-lg font-medium text-white rounded-xl transition-all duration-200 ${
              duration === "Yearly"
                ? "bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg ring-2 ring-[#E1000F]"
                : "bg-[#838383] shadow-sm"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Feature Options */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl">Feature Options</h2>
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E1000F] to-[#3333A7] rounded-lg shadow hover:from-[#F23B3B] hover:to-[#4444C8] transition-all duration-200"
          >
            + Add Feature
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Feature Option ${index + 1}`}
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="w-full py-2 px-3 text-gray-700 placeholder-[#F6B0B5] bg-white border border-[#F6B0B5] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E1000F]"
              />
              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 flex-shrink-0"
                  title="Remove feature"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button
          onClick={closeModal}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base lg:text-lg font-medium text-black rounded-xl border border-[#F18A91] hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base lg:text-lg font-medium text-white rounded-xl bg-gradient-to-r from-[#E1000F] to-[#3333A7] shadow-lg hover:from-[#F23B3B] hover:to-[#4444C8] transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>

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

export default AddPlanForm;
