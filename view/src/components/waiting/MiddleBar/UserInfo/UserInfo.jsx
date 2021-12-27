import Spinner from "../../../core/Spinner";
import { Button } from "../../../Button";
import { User } from "../../../theme/Icons";
import { firstPage } from "../../../../constant";
import "./style.scss";

export default function UserInfo({
  videoPlayer,
  stopVideoOnly,
  error,
  loading,
  userVideo,
  microphone,
  stopAudioOnly,
  handleConfirm,
  stream,
}) {
  return (
    <div className="userInfo">
      <div
        className="videoScreen"
        style={{
          background: !videoPlayer ? "#343434" : "none",
        }}
      >
        {error === null ? (
          <Spinner loading={true} />
        ) : videoPlayer ? (
          loading ? (
            <Spinner videoLoading={true} />
          ) : (
            <video ref={userVideo} muted={true} autoPlay />
          )
        ) : (
          <div className="placeHolder">
            <User />
            <h5>Armen</h5>
          </div>
        )}

        <div className="toolBar">
          <Button type="voice" condition={microphone} method={stopAudioOnly} />
          <Button type="video" condition={videoPlayer} method={stopVideoOnly} />
        </div>
      </div>
      <div className="navbar">
        <span className="title">{firstPage.title}</span>
        <span className="text">{firstPage.description}</span>
        <div className="btns">
          <Button type={"return"} />
          <Button type={"join"} method={() => handleConfirm(stream)} />
        </div>
      </div>
    </div>
  );
}
