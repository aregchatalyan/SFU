import React, { useState, useEffect } from "react";
import {
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import classes from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAlt,
  faPlus,
  faArrowLeft,
  faClipboardList,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "../Video/Chart";

const QuestionModal = (props) => {
  const [id] = useState(props.currentUser.id);
  const [requset, setRequest] = useState(false);
  const [test, setTest] = useState(false);
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [error, setError] = useState("");
  const [successefuily, setSuccessefuily] = useState("");
  const [requestCount, setRequestConut] = useState(0);

  useEffect(() => {
    console.log(props.sendedQuestions, "hello");
    let count = 0;
    for (let i = 0; i < props.sendedQuestions.length; i++) {
      if (!props.sendedQuestions[i]?.status) {
        count++;
      }
    }
    setRequestConut(count);
  }, [props.sendedQuestions]);

  // useEffect(() => {
  //   props.socket.on('votesCountSend', data => {
  //   console.log('votesCountSend', data);
  //   props.percentageCalc(data);
  //   })
  // }, []);

  const changeChoice = (value, index) => {
    let newChoice = [...choices];
    newChoice[index] = value;
    setChoices(newChoice);
    if (error || successefuily) {
      setError("");
      setSuccessefuily("");
    }
  };

  const addChoiceLine = () => {
    let newChoice = [...choices];
    newChoice.push("");
    if (newChoice.length > 4) {
      alert("Առավելագույնը 4 տարբերակ");
      return;
    }
    setChoices(newChoice);
  };

  const delChoiceLine = (index) => {
    let newChoice = [...choices];
    newChoice.splice(index, 1);
    if (newChoice.length < 2) {
      alert("Նվազագույնը 2 տարբերակ");
      return;
    }
    setChoices(newChoice);
  };

  const changeStatus = (value, data) => {
    console.log("change", value, data);
    props.clearQuestion(data);
    if (!value) {
      props.socket.emit("rejectSurvey", data);
    } else {
      props.socket.emit("createSurvey", data);
    }
  };

  const checkChoice = (questionId, id) => {
    console.log("checkChoice----", questionId, id);
    props.socket.emit("votesCount", { questionId, id });
    props.questionChecked(questionId);
  };

  const submitQuestion = () => {
    if (question.trim() === "") {
      setError("Լրացրեք բոլոր դաշտերը");
      return;
    }
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].trim() === "") {
        setError("Լրացրեք բոլոր դաշտերը");
        return;
      }
    }
    props.socket.emit("createSurvey", { userId: id, question, choices });
    setSuccessefuily("Հարցը ուղարկվեց հաստատման");
    setQuestion("");
    setChoices(["", ""]);
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
      onHide={props.onCancel}
      className="d-flex justify-content-center"
    >
      <Modal.Header closeButton className="d-flex align-items-center">
        <Modal.Body className="p-0">
          {!requset && !test ? (
            "Դիմումներ և նոր հարցում"
          ) : requset ? (
            <>
              <FontAwesomeIcon
                icon={faArrowLeft}
                role="button"
                onClick={() => setRequest(false)}
              />
              <span className="ml-5">Դիմումներ ({requestCount})</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faArrowLeft}
                role="button"
                onClick={() => {
                  setTest(false);
                  if (error || successefuily) {
                    setError("");
                    setSuccessefuily("");
                  }
                }}
              />
              <span className="ml-5">Կազմել հարց</span>
            </>
          )}
        </Modal.Body>
      </Modal.Header>
      {!requset && !test ? (
        <div className="mx-auto my-3 d-flex justify-content-center">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                <strong>Տեսնել հարցումները</strong>
              </Tooltip>
            }
          >
            <div
              className={`${classes.userRequest}`}
              onClick={() => {
                setRequest(true);
                props.seeQuestion();
              }}
            >
              <FontAwesomeIcon icon={faUserAlt} />
              {props.notification || requestCount > 0 ? (
                <div className={classes.testNotification}></div>
              ) : null}
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>
                <strong>Ստեղծել հարցում</strong>
              </Tooltip>
            }
          >
            <div
              className={`${classes.userRequest}`}
              onClick={() => setTest(true)}
            >
              <FontAwesomeIcon icon={faClipboardList} />
              <div className={`${classes.addTest}`}>
                <FontAwesomeIcon icon={faPlus} />
              </div>
            </div>
          </OverlayTrigger>
        </div>
      ) : requset ? (
        <div
          style={{ overflowY: "auto", height: "416px" }}
          className="testcontent"
        >
          {props.sendedQuestions.map((sendedQuestion, index) => {
            return (
              <div className={`pl-3 mb-3 ${classes.testInfo}`} key={index}>
                <Container>
                  <Row className="py-3">
                    <Col md={1} className="d-flex">
                      <div className={`${classes.userImg}`}>
                        <div className="userImg"></div>
                      </div>
                    </Col>
                    <Col md={11} className="pl-2 mt-2">
                      <h6 className="mb-3">
                        {" "}
                        {sendedQuestion.userId} Vardanyan
                      </h6>
                      <h5 className="mr-2"> {sendedQuestion.question} </h5>
                      <div className="mt-4 mb-4">
                        {sendedQuestion.choices.map((choice, index) => {
                          return (
                            <h6 key={index} className={classes.choiceContent}>
                              <div
                                className="d-flex align-items-center justify-content-between"
                                style={{
                                  width: `${
                                    !sendedQuestion?.checked ? "30px" : "8px"
                                  }`,
                                }}
                              >
                                {sendedQuestion?.questionId &&
                                !sendedQuestion.checked ? (
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      checkChoice(
                                        sendedQuestion.questionId,
                                        choice.id
                                      )
                                    }
                                    name=""
                                    id=""
                                  />
                                ) : null}
                                <span className="">{index + 1}. </span>
                              </div>
                              <span className={`ml-2 mr-3 ${classes.choice}`}>
                                {choice?.name ? choice.name : choice}
                              </span>
                            </h6>
                          );
                        })}
                      </div>
                      {sendedQuestion?.chartData && sendedQuestion.checked ? (
                        <Chart
                          chartData={sendedQuestion.chartData}
                          location="Massachusetts"
                          legendPosition="bottom"
                        />
                      ) : null}
                    </Col>
                  </Row>
                  {!sendedQuestion?.questionId ? (
                    <div className="d-flex justify-content-center pb-3">
                      <Button
                        variant="success"
                        className={`mr-2 ${classes.success}`}
                        onClick={() => changeStatus(true, sendedQuestion)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </Button>
                      <Button
                        variant="danger"
                        className={classes.reject}
                        onClick={() => changeStatus(false, sendedQuestion)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  ) : null}
                </Container>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mx-3 mt-3">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Հարցի ձևակերպում..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Group>
          {choices.map((choice, index) => {
            return (
              <div key={index} className="d-flex align-items-center">
                <Form.Group className="w-100">
                  <Form.Control
                    type="text"
                    placeholder="Պատասխանի տարբերակ"
                    value={choice}
                    onChange={(e) => changeChoice(e.target.value, index)}
                  />
                </Form.Group>
                <FontAwesomeIcon
                  icon={faTimes}
                  role="button"
                  className="mb-3 ml-3 text-danger"
                  onClick={() => delChoiceLine(index)}
                />
              </div>
            );
          })}
          {error ? <span className="text-danger"> {error} </span> : null}
          {successefuily && +id !== 100 ? (
            <span className="text-success"> {successefuily} </span>
          ) : null}
          <div className="d-flex justify-content-between mt-3">
            <div className="mb-3">
              <Button
                className={classes.addChoiceLine}
                onClick={() => addChoiceLine()}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <div className=" mb-3">
              <Button
                className={classes.sendQuestion}
                onClick={() => submitQuestion()}
              >
                Հրապարակել հարցը
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default QuestionModal;
