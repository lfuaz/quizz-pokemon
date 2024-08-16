import Modal from "react-modal";
import { useEffect, useState } from "react";

export default function Dialog({
  modalIsOpen,
  afterOpenModal,
  closeModal,
  type,
}) {
  const [messageInfo, setMessageInfo] = useState("");
  const [state, setState] = useState("info");
  useEffect(() => {
    Modal.setAppElement(".App");
  }, []);

  const rendering = (type) => {
    switch (type) {
      case "inscription":
        return (
          <div>
            <h2>Inscription</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                const validPassword = e.target["valid-password"].value;
                if (password !== validPassword) {
                  setMessageInfo("Les mots de passe ne correspondent pas.");
                  setState("error");
                } else {
                  setMessageInfo("");
                }
              }}
            >
              <input
                type="email"
                className="field"
                name="email"
                placeholder="email"
              />
              <input
                type="password"
                className="field"
                name="password"
                placeholder="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
              <input
                type="password"
                className="field"
                name="valid-password"
                placeholder="verify password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
              <button type="submit">S'inscrire</button>
            </form>
          </div>
        );
      case "connexion":
        return (
          <div>
            <h2>Connexion</h2>
            <form>
              <input
                type="text"
                className="field"
                name="username"
                placeholder="username"
              />
              <input
                type="password"
                className="field"
                name="password"
                placeholder="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              />
              <button type="submit">Se connecter</button>
            </form>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <div>
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
          },
        }}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        {rendering(type)}
        <div className={`message-info--${state}`}>{messageInfo}</div>
      </Modal>
    </div>
  );
}
