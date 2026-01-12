const Header = ({ heading, paragraph }) => {
  return (
    <div className="mb-2 md:mb-0">
      <h1 className=" capitalize font-[700] text-xl sm:text-2xl md:text-3xl">
        {heading}
      </h1>
      <p className="text-sm md:text-base text-[#EB545E] mt-1">
        {paragraph}
      </p>
    </div>
  );
};

export default Header;

