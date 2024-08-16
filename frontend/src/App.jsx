import "./App.scss";
import React, { useState } from "react";
import { usePokemonDetails } from "./hook/usePokemonDetails";
import { PokemonDescription } from "./components/PokemonInfo";
import { Helper } from "./components/PokemonInfo";
import DrawPokeball from "./components/DrawPokeball";
import { randomId, capitalize } from "./utils/utils";
import Navigation from "./components/Navigation";
import { pokemonNames } from "./data/pokemonNames.js";
import Dialog from "./components/Dialog";

function App() {
  const [authentified, setAuthentified] = useState(
    sessionStorage.getItem("authentified") || false
  );
  const [pokemonId, setPokemonId] = useState(randomId());
  const [userInput, setUserInput] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isPokemonFound, setIsPokemonFound] = useState(false);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const [showType, setShowType] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  function openModal(type) {
    setIsOpen(true);
    setModalType(type);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

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
    if (descriptionIndex < pokemon.descriptions.length) {
      setDescriptionIndex(descriptionIndex + 1);
    }
  };

  return pokemon.descriptions ? (
    <div className="App">
      <Dialog
        modalIsOpen={modalIsOpen}
        afterOpenModal={afterOpenModal}
        closeModal={closeModal}
        type={modalType}
        authentified={authentified}
        setAuthentified={setAuthentified}
      />
      <Navigation
        openModal={openModal}
        authentified={authentified}
        setAuthentified={setAuthentified}
      />
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
