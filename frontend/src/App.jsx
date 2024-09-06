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
import { useEffect } from "react";
import { catchPokemon, checkHealthToken } from "./services/auth";
import pokeballSvg from "./assets/pokeball.svg";
import Countdown from "react-countdown";
import FunnyBackground from "./components/FunnyBackground";
import Notif from "./components/Notif";

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
  const [statusPokemon, setStatusPokemon] = useState("idle");
  const [catchingprocess, setcatchingprocess] = useState("idle");
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("warning");
  const [notConnected, setNotConnected] = useState(false);

  const checking = async () => {
    try {
      await checkHealthToken();
      setNotConnected(false);
    } catch (error) {
      setNotConnected(true);
      setTypeMessage("warning");
      setMessage("Vous n'êtes pas connecté !");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checking();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("notConnected", notConnected);
  }, [notConnected]);

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
    setStatusPokemon("idle");
    setcatchingprocess("idle");
  };

  const handleSubmit = () => {
    if (userInput === "") return;
    if (userInput.toLowerCase() === pokemon.name) {
      setResultMessage(
        "Bravo ! Vous avez trouvé le Pokémon ! Essaie de l'attraper !"
      );
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

  let isTryingToCatch = false;

  const tryCatchPokemon = () => {
    if (isTryingToCatch) return; // Prevent spamming

    isTryingToCatch = true; // Set the flag to true

    // Give random whole number between 1 and 10
    const random = Math.floor(Math.random() * 10) + 1;
    //give pokeball animation
    setcatchingprocess("catching");
    setTimeout(() => {
      if (random > 5) {
        if (isPokemonFound) {
          try {
            catchPokemon(pokemonId);
          } catch (error) {
            setResultMessage("Vous l'avez déjà attrapé !");
          }
        }
        setStatusPokemon("caught");
        setcatchingprocess("caught");
      } else {
        setStatusPokemon("escaped");
        setcatchingprocess("failed");
        setResultMessage("Le Pokémon s'est échappé !");
      }
      isTryingToCatch = false; // Reset the flag
    }, 5000);
  };

  return (
    <div className="App">
      <FunnyBackground />
      <div
        id="real-app"
        style={{
          zIndex: 2,
          backdropFilter: "blur(10px)",
          width: "100%",
          height: "100%",
          padding: "1.3rem",
        }}
      >
        {notConnected ? (
          <Notif setMessage={setMessage} message={message} type={typeMessage} />
        ) : null}
        <Dialog
          modalIsOpen={modalIsOpen}
          afterOpenModal={afterOpenModal}
          closeModal={closeModal}
          type={modalType}
          authentified={authentified}
          setAuthentified={setAuthentified}
          setMessage={setMessage}
          setTypeMessage={setTypeMessage}
        />
        <Navigation
          openModal={openModal}
          authentified={authentified}
          setAuthentified={setAuthentified}
        />
        <h1>
          Devinez <span>le Pokémon !</span>
        </h1>
        {pokemon.descriptions ? (
          <>
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
                name="pokemon search"
              />
              <datalist id="pokemon-list">
                {pokemonNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
              <div className="action" onClick={handleSubmit}>
                Valider
              </div>
            </div>
            <p>{resultMessage}</p>
            {isPokemonFound && catchingprocess === "caught" ? (
              <DrawPokeball />
            ) : null}
            {isPokemonFound ? (
              <button
                className={
                  statusPokemon != "escaped"
                    ? "action catch"
                    : "action catch failed"
                }
                onClick={tryCatchPokemon}
              >
                <img
                  className={catchingprocess}
                  src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20id%3D%22Pokeball%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20595.3%20594.1%22%20style%3D%22enable-background%3Anew%200%200%20595.3%20594.1%3B%22%20xml%3Aspace%3D%22preserve%22%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E.st0%7Bfill%3A%23FFFFFF%3B%7D.st1%7Bfill%3A%23DFDFDF%3B%7D.st2%7Bfill%3A%23FF1C1C%3B%7D.st3%7Bfill%3A%23DF1818%3B%7D%3C%2Fstyle%3E%3Cg%20id%3D%22Pokeball_1_%22%3E%3Cg%20id%3D%22Colours%22%3E%3Cpath%20id%3D%22Down%22%20class%3D%22st0%22%20d%3D%22M297.6%2C380.9c-40.4%2C0-74.1-28.6-82.1-66.6H81.1c9.5%2C110.5%2C102.2%2C197.2%2C215.1%2C197.2%20%20%20%20s205.7-86.7%2C215.1-197.2H379.7C371.7%2C352.4%2C338%2C380.9%2C297.6%2C380.9z%22%2F%3E%3Cpath%20id%3D%22Shadow_Down%22%20class%3D%22st1%22%20d%3D%22M345.6%2C505.9c89.6-21%2C157.7-97.7%2C165.7-191.6h-53C453%2C399.5%2C408.3%2C471.7%2C345.6%2C505.9z%22%2F%3E%3Cpath%20id%3D%22Center%22%20class%3D%22st0%22%20d%3D%22M347.1%2C297L347.1%2C297C347%2C297%2C347%2C297%2C347.1%2C297c-0.1-6.1-1.2-11.9-3.2-17.3%20%20%20%20c-7-18.8-25.1-32.1-46.3-32.1s-39.3%2C13.4-46.3%2C32.1c-2%2C5.4-3.1%2C11.2-3.1%2C17.3c0%2C0%2C0%2C0%2C0%2C0h0.1c0%2C0%2C0%2C0%2C0%2C0%20%20%20%20c0%2C6.1%2C1.1%2C11.9%2C3.1%2C17.3c7%2C18.8%2C25.1%2C32.1%2C46.3%2C32.1c21.2%2C0%2C39.3-13.4%2C46.3-32.1C346%2C309%2C347.1%2C303.1%2C347.1%2C297%20%20%20%20C347.1%2C297%2C347.1%2C297%2C347.1%2C297z%22%2F%3E%3Cpath%20id%3D%22Up%22%20class%3D%22st2%22%20d%3D%22M297.7%2C213.2c40.4%2C0%2C74.1%2C28.6%2C82.1%2C66.6h134.4C504.7%2C169.2%2C412%2C82.5%2C299%2C82.5S93.4%2C169.2%2C83.9%2C279.7%20%20%20%20h131.7C223.6%2C241.7%2C257.3%2C213.2%2C297.7%2C213.2z%22%2F%3E%3Cpath%20id%3D%22Shadow_Up%22%20class%3D%22st3%22%20d%3D%22M458.3%2C279.7h55.8c-8.2-95.5-78.6-173.3-170.5-192.6C407.4%2C120.8%2C452.9%2C193.7%2C458.3%2C279.7z%22%2F%3E%3C%2Fg%3E%3Cpath%20id%3D%22Line%22%20d%3D%22M299%2C82.5c113%2C0%2C205.7%2C86.7%2C215.1%2C197.2H379.7c-8-38-41.7-66.6-82.1-66.6c-40.4%2C0-74.1%2C28.6-82.1%2C66.6H83.9%20%20%20C93.4%2C169.2%2C186.1%2C82.5%2C299%2C82.5z%20M343.9%2C279.7c2%2C5.4%2C3.1%2C11.2%2C3.1%2C17.3c0%2C0%2C0%2C0%2C0%2C0h0.1c0%2C0%2C0%2C0%2C0%2C0c0%2C6.1-1.1%2C11.9-3.1%2C17.3%20%20%20c-7%2C18.8-25.1%2C32.1-46.3%2C32.1c-21.2%2C0-39.3-13.4-46.3-32.1c-2-5.4-3.1-11.2-3.1-17.3c0%2C0%2C0%2C0%2C0%2C0h-0.1c0%2C0%2C0%2C0%2C0%2C0%20%20%20c0-6.1%2C1.1-11.9%2C3.1-17.3c7-18.8%2C25.1-32.1%2C46.3-32.1S336.9%2C261%2C343.9%2C279.7z%20M296.2%2C511.6c-113%2C0-205.7-86.7-215.1-197.2h134.4%20%20%20c8%2C38%2C41.7%2C66.6%2C82.1%2C66.6s74.1-28.6%2C82.1-66.6h131.7C501.9%2C424.8%2C409.2%2C511.6%2C296.2%2C511.6z%20M297.6%2C41.3%20%20%20C156.4%2C41.3%2C41.9%2C155.8%2C41.9%2C297s114.5%2C255.7%2C255.7%2C255.7S553.4%2C438.3%2C553.4%2C297S438.9%2C41.3%2C297.6%2C41.3z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E
    "
                />
                {resultMessage && (
                  <>
                    {resultMessage}
                    {statusPokemon === "caught" ? (
                      <Countdown
                        date={Date.now() + 8000}
                        renderer={(countdownProps) =>
                          renderer({
                            ...countdownProps,
                            next: handlePokemonChange,
                          })
                        }
                      />
                    ) : null}
                    {statusPokemon === "escaped" ? (
                      <p>
                        <Countdown
                          date={Date.now() + 5000}
                          renderer={(countdownProps) =>
                            renderer({
                              ...countdownProps,
                              next: handlePokemonChange,
                            })
                          }
                        />
                      </p>
                    ) : null}
                  </>
                )}
              </button>
            ) : (
              <div className="action" onClick={handlePokemonChange}>
                Passer à un autre Pokémon
              </div>
            )}
          </>
        ) : (
          <div className="loading">
            <img src={pokeballSvg} alt="pokeball" />
            <p>Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}

const renderer = ({ hours, minutes, seconds, completed, next }) => {
  if (completed) {
    // Render a completed state
    next();
  } else {
    // Render a countdown
    return <span>({seconds}'s)</span>;
  }
};

export default App;
