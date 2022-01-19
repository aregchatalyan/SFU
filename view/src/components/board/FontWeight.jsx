import "./theme/toolBoard.scss";

export function FontWeight({ method, setTooltype, prevToolType }) {
  const handleClick = (value) => (e) => {
    e.stopPropagation();
    setTooltype(prevToolType);
    method(value);
  };
  return (
    <ul className="fontWeight">
      <li onClick={handleClick(1)}>10px</li>
      <li onClick={handleClick(5)}>25px</li>
      <li onClick={handleClick(8)}>35px</li>
      <li onClick={handleClick(13)}>45px</li>
      <li onClick={handleClick(18)}>55px</li>
    </ul>
  );
}
