export { CustomButtonWithIcon } from "./CustomButtonWithIcon";
export { ButtonWithTextAndIcon } from "./ButtonWithTextAndIcon";
export { ButtonWithSlider } from "./ButtonWithSlider";

const CustomButton = ({ onClick, text, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {text ? text : children}
    </button>
  );
};

export default CustomButton;
