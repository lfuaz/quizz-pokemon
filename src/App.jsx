import "./App.scss";
import React, { useState } from "react";
import { usePokemonDetails } from "./hook/usePokemonDetails";
import { PokemonDescription } from "./components/PokemonInfo";
import { Helper } from "./components/PokemonInfo";
import DrawPokeball from "./components/DrawPokeball";
import { randomId, capitalize } from "./utils/utils";
import { pokemonNames } from "./data/pokemonNames.js";

function App() {
  const [pokemonId, setPokemonId] = useState(35);
  const [userInput, setUserInput] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isPokemonFound, setIsPokemonFound] = useState(false);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const [showType, setShowType] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { pokemon, type } = usePokemonDetails(pokemonId);

  const handlePokemonChange = () => {
    setPokemonId(randomId());
    setResultMessage("");
    setUserInput("");
    setIsPokemonFound(false);
    setDescriptionIndex(0);
  };

  const handleSubmit = () => {
    if (userInput.toLowerCase() === pokemon.name) {
      setResultMessage("Bravo ! Vous avez trouvé le Pokémon !");
      setIsPokemonFound(true);
    } else {
      setResultMessage(
        "Incorrect ! Essayez encore ou demandez une autre description."
      );
    }
  };

  const handleNextDescription = () => {
    console.log(pokemon.descriptions);

    console.log(descriptionIndex, pokemon.descriptions.length);

    if (descriptionIndex < pokemon.descriptions.length) {
      setDescriptionIndex(descriptionIndex + 1);
    }
  };

  return pokemon.descriptions ? (
    <div className="App">
      <h1>Devinez le Pokémon !</h1>
      {isPokemonFound && <img src={pokemon.photo} alt={pokemon.name} />}
      <PokemonDescription
        descriptions={pokemon.descriptions}
        descriptionIndex={descriptionIndex}
      />
      <div className="indice-wrapper">
        <Helper
          handleNextDescription={handleNextDescription}
          descriptionIndex={descriptionIndex}
          type={type}
          showType={showType}
          setShowType={setShowType}
          descriptions={pokemon.descriptions}
        />
      </div>
      <div className="answer-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Pokémon"
          list="pokemon-list"
        />
        <datalist id="pokemon-list">
          {pokemonNames.map((name, index) => (
            <option key={index} value={name} />
          ))}
        </datalist>
        <button className="action" onClick={handleSubmit}>
          Valider
        </button>
      </div>
      {resultMessage && <p>{resultMessage}</p>}
      {resultMessage === "Bravo ! Vous avez trouvé le Pokémon !" && (
        <DrawPokeball />
      )}
      <button className="action" onClick={handlePokemonChange}>
        Passer à un autre Pokémon
      </button>
      <button className="action" onClick={() => setShowSolution(!showSolution)}>
        {!showSolution ? "Voir la solution" : "Cacher la solution"}
      </button>
      {showSolution && (
        <div>
          <p>Le Pokémon : {capitalize(pokemon.name)}</p>
        </div>
      )}
    </div>
  ) : null;
}

export default App;
