import { useEffect, useState } from "react";
import { showProfil } from "../services/auth.js";
import React from "react";

const Profil = React.memo(() => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await showProfil();
      setData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Ensure the dependency array is empty to run only once on mount

  return data ? (
    <div>
      <h2>Profil</h2>
      <p>Email: {data.user.email}</p>
    </div>
  ) : (
    <div>
      <h2>Profil</h2>
      <p>Vous n'êtes pas connecté.</p>
    </div>
  );
});

export default Profil;
