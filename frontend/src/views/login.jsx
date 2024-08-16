import { disconnect } from "../services/auth";

export default function Login({
  closeModal,
  setAuthentified,
  authentified,
  setMessageInfo,
  setState,
  sendConnexion,
}) {
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
        <input
          type="password"
          className="field"
          name="password"
          placeholder="password"
        />
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
