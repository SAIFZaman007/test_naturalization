import Modal from "../../../../components/Modal";

const CompletionModal = ({ handleCloseModal, topic = '', views = 0, completion = 0 }) => {
  return (
    <Modal
      //  className={"xl:!h-[40vh]"}
      className={"lg:!w-[30%] lg:!h-[32%]"}
      closeModal={handleCloseModal}
    >
      <div className="flex flex-col gap-5">
        <div className="text-[#5F0006]">
          <h2 className="font-[700] text-2xl">Theme Statistics</h2>
          <p className="text-base text-[#F18A91]">Detailed performance metrics for this theme</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#E6E6F4] p-5 rounded-xl">
            <p className="text-base text-[#F18A91]">Views</p>
            <h2 className="font-[700] text-2xl text-[#000091]">{views?.toLocaleString?.() ?? views}</h2>
          </div>
          <div className="bg-[#FCE6E7] text-[#E7333F] p-5 rounded-xl">
            <p className="text-base text-[#F18A91]">Completion</p>
            <h2 className="font-[700] text-2xl">{completion}%</h2>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CompletionModal;
