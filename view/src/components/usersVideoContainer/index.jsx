import React, { useContext } from "react";
import { UserInfoContext } from "../../Context/userInfoContext";

import VideoWrapper from "../core/VideoContainer";
import "./style.scss";

const UserVideos = ({
  selfId,
  selfStream,
  selfScreenStream,
  selfAudioStream,
}) => {
  const { users } = useContext(UserInfoContext);
  const lenght = users?.length;
  let mainClass = "videoContainerStandard";
  if (lenght === 3) {
    mainClass = "videoContainerFor3Users";
  } else if (lenght === 4) {
    mainClass = "videoContainerFor4Users";
  }
  return (
    <div className={mainClass}>
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
            // audioStream = selfAudioStream;
          }

          return (
            <VideoWrapper
              id={mainConsumerId}
              className={`video${lenght === 3 ? index : ""}`}
              stream={mainStream}
              video={video}
              key={index}
              {...{ audioConsumerId, audioStream, showMicState: true }}
            />
          );
        }
      )}
    </div>
  );
};
export default UserVideos;
