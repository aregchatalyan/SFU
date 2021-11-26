import React from "react";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophoneAltSlash,
  faShareSquare,
  faVideo,
  faHandPaper,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { UserInfoContext } from "../../Context/userInfoContext";
import Audio from "./audio";
import AudioAnalyser from "../AudioAnalyser";

export default class Users extends React.PureComponent {
  static contextType = UserInfoContext;

  state = {
    id: this.props.currentUser.id,
    socket: this.props.socket,
    roomId: this.props.roomId,
    stream: this.props.stream,
    screenStream: this.props.screenStream,
    type: this.props.type,
  };

  // componentDidMount(){
  //     this.state.socket.on('hand-up-get', (data) => {
  //         const users = [...this.users];
  //         console.log('dzer barcracrec', data, users);
  //         const index = users.findIndex((user) => user.id == data.userId);
  //         console.log(index);
  //         users[index].handUp = data.value;
  //         this.setUsers(users);
  //     });
  // };

  render() {
    this.users = this.context.users;
    this.setUsers = this.context.setUsers;
    return (
      <div
        className={classes.userList}
        // style={{ height: `${this.props.fullScreen ? '100vh' : '100vh'}` }}
      >
        {this.users.map((user, index) => {
          return (
            <div className={`${classes.userData} user`} key={index}>
              <div className="d-flex align-items-center">
                <div className={`${classes.userImg}`}>
                  <div
                    className="userImg"
                    style={{
                      height: "40px",
                      width: "40px",
                      backgroundImage: `url(${user.info.image})`,
                    }}
                  ></div>
                </div>
                <p className="userName ml-1">
                  {user.info.first_name} {user.info.last_name}
                </p>
              </div>
              <div className={`${classes.statuses}`}>
                {!user.handUp ? (
                  <FontAwesomeIcon
                    className={
                      user.videoStatus
                        ? "text-success mr-1"
                        : "text-danger mr-1"
                    }
                    icon={user.videoStatus ? faVideo : faVideoSlash}
                    style={{ display: `${user.screen ? "none" : "block"}` }}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faHandPaper}
                    className="text-success mr-2"
                  />
                )}
                {user.screen ? (
                  <>
                    <FontAwesomeIcon
                      className="text-success"
                      icon={faShareSquare}
                    />
                    <Audio stream={user.videoStream} muted={user.muted} />
                  </>
                ) : null}
                {user.videoStream && user.audio ? (
                  <AudioAnalyser audio={user.videoStream} />
                ) : (
                  <FontAwesomeIcon
                    className="text-danger ml-2"
                    icon={faMicrophoneAltSlash}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
