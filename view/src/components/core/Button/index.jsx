export { CustomButtonWithIcon } from "./CustomButtonWithIcon";
export { ButtonWithTextAndIcon } from "./ButtonWithTextAndIcon";

const CustomButton = ({ onClick, text, className }) => {
  return <button onClick={onClick}></button>;
};

export default CustomButton;
