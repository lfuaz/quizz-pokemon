import { useEffect, useState } from "react";
import { showProfil } from "../services/auth.js";
import React from "react";
import { FaQuestion, FaStar } from "react-icons/fa";

import ily from "../assets/ily.png";
("react-icons/fa");

const Profil = React.memo(() => {
  const [data, setData] = useState(null);
  const [showShiny, setShowShiny] = useState(false);

  const pokemons = new Array(151).fill(false);

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

  useEffect(() => {
    if (data) {
      console.log(data.achievements);
    }
  }, [data]);

  return data ? (
    <>
      <h2>Profil</h2>
      <span
        onClick={() => {
          setShowShiny(!showShiny);
        }}
        style={{
          position: "absolute",
          right: "20px",
          top: "20px",
        }}
      >
        <FaStar />
      </span>
      <div className="pokemon-list">
        {!showShiny
          ? pokemons.map((pokemon, index) =>
              JSON.parse(data.user.achievements).indexOf(index + 1) == -1 ? (
                <div key={index} className="pokemon">
                  <FaQuestion
                    style={{
                      color: "grey",
                      fontSize: "40px",
                      position: "absolute",
                      opacity: 0.1,
                    }}
                  />
                  <span>#{index + 1}</span>
                </div>
              ) : (
                <div key={index} className="pokemon">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                      index + 1
                    }.png`}
                  />
                </div>
              )
            )
          : pokemons.map((pokemon, index) =>
              JSON.parse(data.user.achievements).indexOf(index + 1) == -1 ? (
                <div key={index} className="pokemon">
                  <FaQuestion
                    style={{
                      color: "grey",
                      fontSize: "40px",
                      position: "absolute",
                      opacity: 0.1,
                    }}
                  />
                  <span>#{index + 1}</span>
                </div>
              ) : (
                <div key={index} className="pokemon">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${
                      index + 1
                    }.png`}
                  />
                </div>
              )
            )}
      </div>
    </>
  ) : (
    <>
      <h2>Profil</h2>
      <p>
        Session expiré
        <br />
        Veuillez vous reconnecter
      </p>
    </>
  );
});

export default Profil;
