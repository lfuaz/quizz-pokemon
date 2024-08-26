import { capitalize } from "../utils/utils.js";
import { useState } from "react";

export default function Solution({ correctAnswer }) {
  const c = capitalize(correctAnswer);
  const [showSolution, setShowSolution] = useState(false);

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <>
      <div className="action" onClick={toggleSolution}>
        {showSolution ? "Cacher la Solution" : "Afficher la solution"}
      </div>
      {showSolution && <p>La bonne réponse est : {c}</p>}
    </>
  );
}
