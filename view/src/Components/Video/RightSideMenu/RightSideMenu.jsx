import { Button } from "../../Button";
import "./rightSideMenuStyle.scss";

export const RightSideMenu = ({
  board,
  openBoard,
  request,
  openRequest,
  hand,
  handUp,
}) => {
  return (
    <div className="right">
      <Button
        type="blackboard"
        opened={board}
        condition={true}
        method={openBoard}
      />
      <Button type="book" condition={true} />
      <Button
        type="request"
        condition={true}
        opened={request}
        method={openRequest}
      />
      <Button type="hand" condition={true} opened={hand} method={handUp} />
    </div>
  );
};
