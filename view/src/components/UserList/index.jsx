import React, { useContext } from "react";
import { DimensionsContext } from "../../App";
import { UserInfoContext } from "../../Context/userInfoContext";
import { ArrowLeft, TreeUsers } from "../theme/Icons";
import Item from "./Item";
import style from "./style.module.scss";

const UserList = ({ className, showUser, selfId, videoPlayer }) => {
  const { height } = useContext(DimensionsContext);
  const { users } = useContext(UserInfoContext);

  return (
    <div className={className}>
      <div className={style.header}>
        <div className={style.headerContent}>
          <button onClick={showUser}>
            <ArrowLeft />
          </button>
          <div className={style.content}>
            <TreeUsers />
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
