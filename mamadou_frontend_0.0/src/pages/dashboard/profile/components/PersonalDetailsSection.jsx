import PersonalDetailsForm from "../../../../components/PersonalDetailsForm";

const PersonalDetailsSection = () => {
  return (
    <div className="bg-white rounded-xl px-6 py-3 md:p-6 lg:px-11 lg:py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#5F0006] pt-2 my-2">Personal Details</h2>
      <PersonalDetailsForm />
    </div>
  );
};

export default PersonalDetailsSection;
