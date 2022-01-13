import React, { useContext } from "react";
import { UserInfoContext, DimensionsContext } from "../../Context";
import { CustomButtonWithIcon } from "../core/Button";
import Icon from "../core/Icon";
import Item from "./Item";
import style from "./style.module.scss";

const UserList = ({ className, setIsUserListOpened, selfId, videoPlayer }) => {
  const { height } = useContext(DimensionsContext);
  const { users } = useContext(UserInfoContext);

  return (
    <div className={className}>
      <div className={style.header}>
        <div className={style.headerContent}>
          <CustomButtonWithIcon
            iconName="arrow_left_userlist"
            width={24}
            height={24}
            onClick={() => setIsUserListOpened(false)}
          />
          <div className={style.content}>
            <Icon name="users_userlist" width={32} height={32} />
            <span>Members</span>
          </div>
        </div>
      </div>
      <div className={style.userListContainer} style={{ height: height - 96 }}>
        {users.map(({ stream, userId }, key) => {
          const isVideoOn = userId === selfId ? videoPlayer : stream;
          return <Item {...{ isVideoOn }} key={key} />;
        })}
      </div>
    </div>
  );
};

export default UserList;
