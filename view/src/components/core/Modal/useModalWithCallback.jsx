import React, { useState } from "react";
import style from "./style.module.scss";

export const useModalWithCallback = () => {
  const [prevComment, setprevComment] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [submitModal, setSubmitModal] = useState({
    cb: () => {},
  });
  const callback = (setString, string = "") => {
    setIsModalOpened(true);
    setprevComment(string);
    setInputValue(string);
    setSubmitModal({
      cb: setString,
    });
  };
  const addComment = () => {
    if (prevComment !== inputValue && inputValue.length > 0) {
      submitModal.cb(inputValue);
      setIsModalOpened(false);
    }
  };

  const modal = (
    <div
      className={isModalOpened ? style.modalWrapper : style.modalWrapperHide}
    >
      <div className={style.commentModal}>
        <span className={style.title}>Add Comment</span>
        <div className={style.textAreaWrapper}>
          <textarea
            placeholder="Leave your comment here ..."
            maxLength={160}
            value={inputValue}
            onChange={({ target: { value } }) => setInputValue(value)}
          />
        </div>
        <div className={style.actionBar}>
          <button
            className={style.cancel}
            onClick={() => setIsModalOpened(false)}
          >
            Cancel
          </button>
          <button
            className={
              prevComment !== inputValue && inputValue.length > 0
                ? style.submit
                : style.submitDisabled
            }
            onClick={addComment}
          >
            {prevComment.length > 0 ? "Save" : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );

  return [modal, callback];
};
