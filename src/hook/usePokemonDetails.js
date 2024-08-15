import { useState, useEffect } from "react";
import { removeAllUtf8, capitalize } from "../utils/utils";

export const usePokemonDetails = (pokemonId) => {
  const [pokemon, setPokemon] = useState({});
  const [type, setType] = useState([]);

  const getPokemonDetail = async (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const cachedData = sessionStorage.getItem(url);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(url);
    const data = await response.json();

    const name = removeAllUtf8(
      data.names.filter((name) => name.language.name === "fr")[0].name
    ).toLowerCase();

    const descriptions = data.flavor_text_entries
      .filter(
        (entry) =>
          entry.language.name === "fr" &&
          !entry.flavor_text
            .toLowerCase()
            .includes(removeAllUtf8(name).toLowerCase())
      )
      .map((entry) => ({
        flavor_text: capitalize(removeAllUtf8(entry.flavor_text).toLowerCase()),
      }));

    const uniqueDescriptions = [
      ...new Set(descriptions.map((item) => item.flavor_text)),
    ];

    const result = {
      name: name,
      descriptions: uniqueDescriptions,
    };

    sessionStorage.setItem(url, JSON.stringify(result));
    return result;
  };

  const getTypeOfPokemon = async (pokemonId) => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data = await response.json();
    const type = data.types.map((type) => type.type.name);
    setType(type);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonDetail(pokemonId);
      await getTypeOfPokemon(pokemonId);

      setPokemon({
        descriptions: data.descriptions,
        name: data.name,
        photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
      });
    };

    fetchData();
  }, [pokemonId]);

  return { pokemon, type };
};
