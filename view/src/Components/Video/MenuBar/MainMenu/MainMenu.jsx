import { Button } from "../../../Button";
import "./mainMenu.scss";
export const MainMenu = ({
  microphone,
  microphoneClick,
  video,
  videoClick,
  shareScreen,
  notification,
  leaveMeeting,
  openChat,
}) => {
  return (
    <div className="main">
      <Button type="voice" condition={microphone} method={microphoneClick} />
      <Button type="video" condition={video} method={videoClick} />
      <Button type="screenShare" condition={true} method={shareScreen} />
      <Button type="message" condition={notification} method={openChat} />
      <Button type="hangUp" condition={true} method={leaveMeeting} />
    </div>
  );
};
