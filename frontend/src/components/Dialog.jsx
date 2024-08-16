import Modal from "react-modal";
import { useEffect, useState, useCallback } from "react";
import { sendRegister, sendConnexion } from "../services/auth.js";
import Register from "../views/register.jsx";
import Login from "../views/login.jsx";
import Profil from "../views/profil.jsx";

export default function Dialog({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  type,
  authentified,
  setAuthentified,
}) {
  const [messageInfo, setMessageInfo] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    Modal.setAppElement(".App");
  }, []);

  useEffect(() => {
    if (modalIsOpen) {
      setMessageInfo("");
      setState("");
    }
  }, [modalIsOpen]);

  const rendering = useCallback(
    (type) => {
      switch (type) {
        case "inscription":
          return (
            <Register
              setMessageInfo={setMessageInfo}
              setState={setState}
              sendRegister={sendRegister}
            />
          );
        case "connexion":
          return (
            <Login
              setMessageInfo={setMessageInfo}
              setState={setState}
              sendConnexion={sendConnexion}
              closeModal={closeModal}
              setAuthentified={setAuthentified}
              authentified={authentified}
            />
          );

        case "profil":
          return <Profil />;
        default:
          break;
      }
    },
    [
      setMessageInfo,
      setState,
      sendRegister,
      sendConnexion,
      closeModal,
      setAuthentified,
      authentified,
    ]
  );

  return (
    <Modal
      isOpen={modalIsOpen}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          color: "#fff",
          backgroundColor: "#292626",
          margin: "auto",
          padding: "20px",
          borderRadius: "5px",
          height: "fit-content",
          animation: "slideIn 0.5s",
        },
      }}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
    >
      {rendering(type)}
      <div className={`message-info--${state}`}>{messageInfo}</div>
    </Modal>
  );
}
