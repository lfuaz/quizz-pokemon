import { disconnect } from "../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function Login({
  closeModal,
  setAuthentified,
  authentified,
  setMessageInfo,
  setState,
  sendConnexion,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return !authentified ? (
    <div>
      <h2>Connexion</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;

          try {
            await sendConnexion(email, password);
            closeModal();
            setAuthentified(true);
          } catch (error) {
            setMessageInfo(error.message);
            setState("error");
          }
        }}
      >
        <input
          type="email"
          className="field"
          name="email"
          placeholder="email"
        />
        <div className="item-field">
          <input
            type={showPassword ? "text" : "password"}
            className="field"
            name="password"
            placeholder="password"
          />
          <button
            className="hide-button"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {<button type="submit">Se connecter</button>}
      </form>
    </div>
  ) : (
    <div>
      <h2>Connexion</h2>
      <p className="message-info--info">Vous êtes connecté.</p>
      <button
        onClick={() => {
          setAuthentified(false);
          disconnect();
          closeModal();
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}
