import React, { useState, useRef, useEffect } from "react";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip } from "@fortawesome/free-solid-svg-icons";

const Chat = (props) => {
  const activeMessageRef = useRef();
  const textareaRef = useRef();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [height, setHeight] = useState("36px");
  const [scroll, setScroll] = useState(false);
  const [pattern] = useState(
    new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    )
  );
  const [id] = useState(props.currentUser.id);
  const { socket } = props;

  useEffect(() => {
    console.log("props.showChat", props.showChat);
    if (props.showChat && textareaRef.current) {
      textareaRef.current.focus();
      if (activeMessageRef.current) {
        activeMessageRef.current.scrollTop =
          activeMessageRef.current.scrollHeight;
      }
    }
  }, [props.showChat]);

  useEffect(() => {
    socket.on("messagesInRoom", (data) => {
      console.log("messagesInRoom", data);
      getMessages(data);
    });
  }, []);

  useEffect(() => {
    socket.on("messageRecevied", (data) => {
      console.log("messageRecevied", data);
      handleMessageResives(data);
    });
  }, []);

  useEffect(() => {
    if (activeMessageRef.current) {
      activeMessageRef.current.scrollTop =
        activeMessageRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    let messageArray = newMessage.slice(0, -1).split(" ");
    let links = [];
    let textLength = messageArray.length;
    messageArray.map((mess) => {
      if (!!pattern.test(mess)) {
        links.push(mess);
      }
    });

    const data = {
      message: newMessage,
      links,
      textLength,
      userId: id,
      roomId: 1,
      data: new Date(),
    };

    socket.emit("sendMessage", data);

    setNewMessage("");
    setHeight(36 + "px");
    setMessages([...messages, data]);
  };

  const handleMessageResives = (data) => {
    let messageArray = data.message.slice(0, -1).split(" ");
    let links = [];
    let textLength = messageArray.length;
    messageArray.map((mess) => {
      if (!!pattern.test(mess)) {
        links.push(mess);
      }
    });

    const messageInfo = {
      message: data.message,
      links,
      textLength,
      userId: data.userId,
      roomId: 1,
      data: data.data,
    };
    console.log("handleMessageResives", messageInfo);
    setMessages((prevValue) => {
      return [...prevValue, messageInfo];
    });
    props.messageNotification();
  };

  const getMessages = (allMessages) => {
    let mes = [];

    allMessages.map((data) => {
      let messageArray = data.message.slice(0, -1).split(" ");
      let links = [];
      let textLength = messageArray.length;
      messageArray.map((mess) => {
        if (!!pattern.test(mess)) {
          links.push(mess);
        }
      });

      let messageInfo = {
        message: data.message,
        links,
        textLength,
        userId: data.userId,
        roomId: 1,
        data: data.data,
      };
      return mes.push(messageInfo);
    });
    setMessages(mes);
  };

  const autoSize = () => {
    if (
      textareaRef.current &&
      textareaRef.current.scrollHeight > 36 &&
      textareaRef.current.scrollHeight <= 100
    ) {
      setHeight(textareaRef.current.scrollHeight + "px");
      if (scroll) {
        setScroll(false);
      }
    } else {
      setScroll(true);
    }
  };

  return (
    <div
      className={classes.chatPosition}
      style={{
        left: props.mobile ? "0" : "",
        bottom: props.mobile ? "8.5vh" : "",
        width: props.mobile ? "100%" : "260px",
      }}
    >
      <div className={classes.message}>
        <div className={classes.liveChat} ref={activeMessageRef}>
          <div className={classes.chatContainer}>
            {messages.map((message, index) => {
              return message.userId === id ? (
                <div
                  className={`${classes.myMessage} ${
                    index > 0 &&
                    messages[index].userId !== messages[index - 1].userId
                      ? "mt-3"
                      : ""
                  }`}
                  key={index}
                >
                  <div
                    className={
                      message.message.length >= 33 ? classes.messages : ""
                    }
                    title={new Date(message.data).toLocaleTimeString()}
                  >
                    <p>
                      {message.textLength == 1 && message.links.length > 0
                        ? null
                        : message.message}
                      {message.links.length > 0
                        ? message.links.map((link, index) => {
                            return (
                              <span key={index}>
                                {message.textLength > 1 ? <br /> : null}
                                <a
                                  href={`${
                                    link.search("http") !== -1
                                      ? `${link}`
                                      : `http://${link}`
                                  }`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {" "}
                                  {link}{" "}
                                </a>
                              </span>
                            );
                          })
                        : null}
                    </p>
                  </div>
                  {/* <div className={`${classes.userImg}`}>
                                        <div className='userImg' />
                                    </div> */}
                </div>
              ) : (
                <div
                  className={`${classes.messageResived} ${
                    index > 0 &&
                    messages[index].userId !== messages[index - 1].userId
                      ? "mt-3"
                      : ""
                  }`}
                  key={index}
                >
                  <div className={`${classes.userImg}`}>
                    <div className="userImg" />
                  </div>
                  <div
                    className={
                      message.message.length >= 33 ? classes.messages : ""
                    }
                    title={new Date(message.data).toLocaleTimeString()}
                  >
                    <p>
                      {message.textLength == 1 && message.links.length > 0
                        ? null
                        : message.message}
                      {message.links.length > 0
                        ? message.links.map((link, index) => {
                            return (
                              <span key={index}>
                                {message.textLength > 1 ? <br /> : null}
                                <a
                                  href={`${
                                    link.search("http") !== -1
                                      ? `${link}`
                                      : `http://${link}`
                                  }`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {" "}
                                  {link}{" "}
                                </a>
                              </span>
                            );
                          })
                        : null}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={classes.controls}>
          <textarea
            placeholder="Ուղարկել նամակ..."
            className={classes.messageInput}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.keyCode === 13 && newMessage.trim().length > 0) {
                sendMessage();
              } else if (e.keyCode === 13) {
                setNewMessage("");
              }
            }}
            onKeyDown={autoSize}
            style={{ height, overflowY: scroll ? "auto" : "hidden" }}
            ref={textareaRef}
          />
          <FontAwesomeIcon className={classes.sendFile} icon={faPaperclip} />
          <FontAwesomeIcon
            className={classes.sendMessage}
            icon={faPaperPlane}
            onClick={() => {
              if (newMessage.trim().length > 0) {
                sendMessage();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
