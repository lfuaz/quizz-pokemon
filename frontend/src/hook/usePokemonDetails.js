import { useState, useEffect } from "react";
import { removeAllUtf8, capitalize } from "../utils/utils";

export const usePokemonDetails = (pokemonId) => {
  const [pokemon, setPokemon] = useState({});
  const [type, setType] = useState([]);

  const getPokemonDetail = async (pokemonId) => {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const cachedResponse = sessionStorage.getItem(apiUrl);

    if (cachedResponse) return JSON.parse(cachedResponse);

    const apiResponse = await fetch(apiUrl);
    const pokemonData = await apiResponse.json();

    const pokemonName = removeAllUtf8(
      pokemonData.names.find((nameObj) => nameObj.language.name === "fr")
        ?.name || ""
    ).toLowerCase();

    const frenchDescriptions = [
      ...new Set(
        pokemonData.flavor_text_entries
          .filter((entry) => entry.language.name === "fr")
          .map((entry) => removeAllUtf8(entry.flavor_text).toLowerCase())
          .filter(
            (description) => !description.includes(removeAllUtf8(pokemonName))
          )
          .map(capitalize)
      ),
    ];

    console.log(frenchDescriptions);

    const result = { name: pokemonName, descriptions: frenchDescriptions };

    sessionStorage.setItem(apiUrl, JSON.stringify(result));
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
