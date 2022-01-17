import React, { useContext } from "react";
import { UserInfoContext } from "../../Context/userInfoContext";

import VideoWrapper from "../core/VideoContainer";
import VoiceWrapper from "../core/Voice";
import style from "./style.module.scss";

const UserVideos = ({ selfId, selfStream, selfScreenStream }) => {
  const { users } = useContext(UserInfoContext);
  const lenght = users?.length;
  let mainClass = "videoContainerStandard";
  if (lenght === 3) {
    mainClass = "videoContainerFor3Users";
  } else if (lenght === 4) {
    mainClass = "videoContainerFor4Users";
  }
  return (
    <div className={style[`${mainClass}`]}>
      {users.map(
        (
          {
            userId,
            stream: smallStream,
            consumerId: smallConsumerId,
            audioConsumerId,
            audioStream,
            screenStream,
            screenConsumerId,
            video,
          },
          index
        ) => {
          let mainStream = screenStream || smallStream;
          let mainConsumerId = screenConsumerId || smallConsumerId;
          if (!screenStream) {
            smallStream = undefined;
            smallConsumerId = undefined;
          }
          if (userId === selfId) {
            if (selfStream && selfScreenStream) {
              mainConsumerId = "myScreen";
              mainStream = selfScreenStream;
              smallStream = selfStream;
              smallConsumerId = "myVideo";
            } else if (selfScreenStream) {
              mainConsumerId = "myScreen";
              mainStream = selfScreenStream;
            } else {
              mainConsumerId = "myVideo";
              mainStream = selfStream;
            }
          }

          return (
            <div key={index}>
              <VideoWrapper
                id={mainConsumerId}
                className={style[`video${lenght === 3 ? index : ""}`]}
                stream={mainStream}
                video={video}
                smallStream={smallStream}
                smallConsumerId={smallConsumerId}
              />
              <VoiceWrapper id={audioConsumerId} audioStream={audioStream} />
            </div>
          );
        }
      )}
    </div>
  );
};
export default UserVideos;
