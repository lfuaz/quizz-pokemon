export default function Register({ setMessageInfo, setState, sendRegister }) {
  return (
    <div>
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
}
