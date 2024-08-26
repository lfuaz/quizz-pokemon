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
  setMessage,
  setTypeMessage,
}) {
  const [messageInfo, setMessageInfo] = useState("");
  const [state, setState] = useState("");

  const parentSelector = () => document.getElementById("real-app");

  useEffect(() => {
    Modal.setAppElement("#real-app");
  }, []);

  useEffect(() => {
    if (modalIsOpen) {
      setMessageInfo("");
      setState("");
      document
        .querySelectorAll("body > *:not(#real-app)")
        .forEach((el) => el.setAttribute("aria-hidden", "true"));
    } else {
      document
        .querySelectorAll("[aria-hidden]")
        .forEach((el) => el.removeAttribute("aria-hidden"));
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
              setMessage={setMessage}
              setTypeMessage={setTypeMessage}
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
      appElement={document.getElementById("real-app")}
      parentSelector={parentSelector}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999, // Ensure overlay is above all other elements
        },
        content: {
          color: "#fff",
          backgroundColor: "#292626",
          margin: "auto",
          padding: "20px",
          borderRadius: "5px",
          height: "fit-content",
          animation: "slideIn 0.5s",
          zIndex: 10000, // Ensure modal content is above the overlay
        },
      }}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal} // This will close the modal when clicking on the backdrop
      shouldCloseOnOverlayClick={true} // Ensure modal closes on overlay click
    >
      {rendering(type)}
      <div className={`message-info--${state}`}>{messageInfo}</div>
    </Modal>
  );
}
