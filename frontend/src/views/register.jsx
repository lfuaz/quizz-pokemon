import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register({ setMessageInfo, setState, sendRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2>Inscription</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email.value;
          const password = e.target.password.value;
          const validPassword = e.target["valid-password"].value;
          if (password !== validPassword) {
            setMessageInfo("Les mots de passe ne correspondent pas.");
            setState("error");
          } else {
            try {
              await sendRegister(email, password);
              setMessageInfo("Inscription réussie !");
              setState("success");
            } catch (error) {
              setMessageInfo(error.message);
              setState("error");
            }
          }
        }}
      >
        <input type="email" name="email" id="email" />
        <div className="item-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="field"
            name="password"
            placeholder="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
          <button
            className="hide-button"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="item-field">
          <input
            type={showPassword ? "text" : "password"}
            className="field"
            id="valid-password"
            name="valid-password"
            placeholder="verify password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </>
  );
}
