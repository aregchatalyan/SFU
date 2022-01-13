import React, { useState, useEffect } from "react";
import SubmitButton from "../core/Button/SubmitButton";
import CustomButton from "../core/Button/index";
import AnswerInput from "../core/Input/AnswerInput";
import SwitchCheckBox from "../core/Input/SwitchCheckBox";
import TextArea from "../core/Input/TextArea";
import useModalWithButton from "../core/Modal";
import Icon from "../core/Icon";
import style from "./style.module.scss";

const initialValues = {
  question: "",
  versions: [{ text: "" }, { text: "" }],
  anonymus: false,
};

const Children = ({ socket, closeModal }) => {
  const [formContext, setFormContext] = useState({ ...initialValues });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (formContext.question.length > 0) {
      setIsValid(true);
      formContext.versions.forEach(({ text }) => {
        setIsValid((state) => {
          if (state) {
            return text.length > 0;
          } else {
            return state;
          }
        });
      });
    } else {
      setIsValid(false);
    }
  }, [formContext]);

  const addVersion = () => {
    const version = { text: "" };
    setFormContext((state) => {
      const versions = [...state.versions];
      versions.push(version);
      return { ...state, versions };
    });
  };

  return (
    <div className={style.pollContainer}>
      <div className={style.header}>
        <span>Create a Poll</span>
        <button
          onClick={closeModal}
          className={style.closeBtn}
          style={{ cursor: "pointer" }}
        >
          <Icon name="close_poll_modal" width={24} height={24} />
        </button>
      </div>
      <div className={style.createQuestion}>
        <span className={style.questionLabel}>Label</span>
        <TextArea
          name="question"
          className={style.questionInput}
          context={formContext}
          changeContext={setFormContext}
        />
        <div className={style.versionHeader}>
          <span className={style.versionLabel}>Versions</span>
          <button
            className={style.addVersionBtn}
            onClick={addVersion}
            style={{ cursor: "pointer" }}
          >
            Add Version
          </button>
        </div>
        <div className={style.versionsContainer}>
          {formContext.versions.map(({ text: value }, index) => (
            <AnswerInput
              {...{
                name: "versions",
                value,
                index,
                canBeDelete: formContext.versions.length > 2,
                changeContext: setFormContext,
              }}
              key={index}
            />
          ))}
        </div>
        <SwitchCheckBox
          {...{
            name: "anonymus",
            context: formContext,
            setContext: setFormContext,
            label: "Anonymus Poll",
          }}
        />
        <div className={style.actionBar}>
          <CustomButton
            text={"Cancel"}
            onClick={() => {
              closeModal();
              setFormContext({
                question: "",
                versions: [{ text: "" }, { text: "" }],
                anonymus: false,
              });
            }}
            className={style.cancelButton}
          />
          <SubmitButton
            text="Publish Survey"
            disabled={!isValid}
            onClick={() => {
              socket.emit("createPoll", {
                userId: "123456",
                ...formContext,
              });
              setFormContext({
                question: "",
                versions: [{ text: "" }, { text: "" }],
                anonymus: false,
              });
              closeModal();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const useCreatePollModal = ({ socket }) =>
  useModalWithButton({
    child: ({ closeModal }) => <Children {...{ socket, closeModal }} />,
    modalProps: {
      className: style.pollModalContainer,
    },
    buttonProps: {
      children: (
        <>
          <Icon name="create_poll" width={21} height={20} />
          <span>Create</span>
        </>
      ),
      className: style.buttonStyle,
    },
  });
