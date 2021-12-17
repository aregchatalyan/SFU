import { Button } from "../../../Button";
import "./leftSideMenuStyle.scss";

export const LeftSideMenu = ({ showUser }) => {
  return (
    <div className="left">
      <Button type="showUser" condition={true} method={showUser} />
      <Button type="book" condition={true} />
      <Button type="word" condition={true} />
      <Button type="exel" condition={true} />
    </div>
  );
};
