import Spinner from "../../../core/Spinner";
import { firstPage } from "../../../../constant";
import CustomButton, {
  CustomButtonWithIcon,
  ButtonWithTextAndIcon,
} from "../../../core/Button";
import Icon from "../../../core/Icon";
import style from "./style.module.scss";

const UserInfo = ({
  videoPlayer,
  stopVideoOnly,
  error,
  loading,
  userVideo,
  microphone,
  stopAudioOnly,
  handleConfirm,
}) => (
  <div className={style.userInfo}>
    <div
      className={style.videoScreen}
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
        <div className={style.placeHolder}>
          <Icon name="waiting_user" width={144} height={144} />
          <h5>Armen</h5>
        </div>
      )}

      <div className={style.toolBar}>
        <CustomButtonWithIcon
          iconName={videoPlayer ? "waiting_video_on" : "waiting_video_off"}
          width={24}
          height={24}
        />
        <CustomButtonWithIcon
          iconName={false ? "waiting_voice_on" : "waiting_voice_off"}
          width={24}
          height={24}
        />
      </div>
    </div>
    <div className={style.navbar}>
      <span className={style.title}>{firstPage.title}</span>
      <span className={style.text}>{firstPage.description}</span>
      <div className={style.btns}>
        <ButtonWithTextAndIcon
          className={style.goHome}
          iconName="waiting_go_home"
          width={20}
          height={20}
          text="Return"
        />
        <CustomButton
          text="Join Lesson"
          className={style.joinBtn}
          onClick={handleConfirm}
        />
      </div>
    </div>
  </div>
);

export default UserInfo;
