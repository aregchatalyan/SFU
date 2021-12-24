import { Button } from "../../../Button";
import style from "./style.module.scss";

const RightSideMenu = ({
  request,
  openRequest,
  hand,
  handUp,
  isBoardOpened,
  openBoard,
  isLogOpened,
  openLog,
}) => {
  return (
    <div className={style.right}>
      <Button
        type="blackboard"
        opened={isBoardOpened}
        condition={true}
        method={openBoard}
      />
      <Button
        type="book"
        opened={isLogOpened}
        condition={true}
        method={openLog}
      />
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
export default RightSideMenu;
