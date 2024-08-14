import { useEffect, useState,useRef } from 'react'
import './App.scss'
import { pokemonNames } from './pokemonList.js'
import Confetti from 'react-confetti'

const randomId = () => Math.floor(Math.random() * 151) + 1

const capitalize = (str = "") => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export const ShowSolution = ({ correctAnswer }) => {

  const c = capitalize(correctAnswer);
  // State to manage the visibility of the solution
  const [showSolution, setShowSolution] = useState(false);

  // Function to toggle the solution visibility
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  return (
    <div>
      {/* Button to show/hide the solution */}
      <button onClick={toggleSolution}>
        {showSolution ? "Cacher la Solution" : "Afficher la solution"}
      </button>
      {/* Conditionally render the correct answer */}
      {showSolution && <p>La bonne réponse est : {c}</p>}
    </div>
  );
};

function App() {


  const drawPokeball = (ctx) => {
    const paths = [
      { path: "M297.6,380.9c-40.4,0-74.1-28.6-82.1-66.6H81.1c9.5,110.5,102.2,197.2,215.1,197.2s205.7-86.7,215.1-197.2H379.7C371.7,352.4,338,380.9,297.6,380.9z", color: "#FFFFFF" },
      { path: "M345.6,505.9c89.6-21,157.7-97.7,165.7-191.6h-53C453,399.5,408.3,471.7,345.6,505.9z", color: "#FFFFFF" },
      { path: "M347.1,297L347.1,297C347,297,347,297,347.1,297c-0.1-6.1-1.2-11.9-3.2-17.3c-7-18.8-25.1-32.1-46.3-32.1s-39.3,13.4-46.3,32.1c-2,5.4-3.1,11.2-3.1,17.3c0,0,0,0,0,0h0.1c0,0,0,0,0,0c0,6.1,1.1,11.9,3.1,17.3c7,18.8,25.1,32.1,46.3,32.1c21.2,0,39.3-13.4,46.3-32.1C346,309,347.1,303.1,347.1,297C347.1,297,347.1,297,347.1,297z", color: "#000000" },
      { path: "M297.7,213.2c40.4,0,74.1,28.6,82.1,66.6h134.4C504.7,169.2,412,82.5,299,82.5S93.4,169.2,83.9,279.7h131.7C223.6,241.7,257.3,213.2,297.7,213.2z", color: "#FF0000" },
      { path: "M458.3,279.7h55.8c-8.2-95.5-78.6-173.3-170.5-192.6C407.4,120.8,452.9,193.7,458.3,279.7z", color: "#FF0000" },
      { path: "M299,82.5c113,0,205.7,86.7,215.1,197.2H379.7c-8-38-41.7-66.6-82.1-66.6c-40.4,0-74.1,28.6-82.1,66.6H83.9C93.4,169.2,186.1,82.5,299,82.5z M343.9,279.7c2,5.4,3.1,11.2,3.1,17.3c0,0,0,0,0,0h0.1c0,0,0,0,0,0c0,6.1-1.1,11.9-3.1,17.3c-7,18.8-25.1,32.1-46.3,32.1c-21.2,0-39.3-13.4-46.3-32.1c-2-5.4-3.1-11.2-3.1-17.3c0,0,0,0,0,0h-0.1c0,0,0,0,0,0c0-6.1,1.1-11.9,3.1-17.3c7-18.8,25.1-32.1,46.3-32.1S336.9,261,343.9,279.7z M296.2,511.6c-113,0-205.7-86.7-215.1-197.2h134.4c8,38,41.7,66.6,82.1,66.6s74.1-28.6,82.1-66.6h131.7C501.9,424.8,409.2,511.6,296.2,511.6z M297.6,41.3C156.4,41.3,41.9,155.8,41.9,297s114.5,255.7,255.7,255.7S553.4,438.3,553.4,297S438.9,41.3,297.6,41.3z", color: "#000000" }
    ];
  
    ctx.save();
    ctx.scale(0.1, 0.1); // Scale down to 10% of the original size
    paths.forEach(({ path, color }) => {
      const p = new Path2D(path);
      ctx.fillStyle = color;
      ctx.fill(p);
    });
    ctx.restore();
  };
  
  const [pokemonId, setPokemonId] = useState(randomId())
  const [currentUrl, setCurrentUrl] = useState("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId)

  const [userInput, setUserInput] = useState("")
  const [resultMessage, setResultMessage] = useState("")
  const [isPokemonFound, setIsPokemonFound] = useState(false)
  const [descriptionIndex, setDescriptionIndex] = useState(0)
  const [showType, setShowType] = useState(false)
  const [type, setType] = useState([]);
  const [pokemon, setPokemon] = useState({});


  useEffect(() => {
    console.log(type);
    
  }, [type])


  useEffect(() => {
    setCurrentUrl("https://pokeapi.co/api/v2/pokemon-species/" + pokemonId)
  }, [pokemonId])

  const handlePokemonChange = () => {
    setPokemonId(randomId())
    setResultMessage("") // Reset message
    setUserInput("") // Reset user input
    setIsPokemonFound(false) // Reset the found state
    setDescriptionIndex(0) // Reset the description index
  }

  const removeAllUtf8 = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  const getPokemonDetail = async (url) => {
    const cachedData = sessionStorage.getItem(url)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
    const response = await fetch(url)
    const data = await response.json()

    const name = removeAllUtf8(data.names.filter((name) => name.language.name === "fr")[0].name).toLowerCase()

    const descriptions = data.flavor_text_entries.filter((entry) => {
      return entry.language.name === "fr" && !entry.flavor_text.toLowerCase().includes(removeAllUtf8(name).toLowerCase())
    }).map((entry) => {
      return {
        flavor_text: capitalize(removeAllUtf8(entry.flavor_text).toLowerCase())
      }
    })

    const uniqueDescriptions = [...new Set(descriptions.map(item => item.flavor_text))]

    const result = {
      name: name,
      descriptions: uniqueDescriptions
    }

    sessionStorage.setItem(url, JSON.stringify(result))
    return result
  }

  const getTypeOfPokemon = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    const type = data.types.map((type) => type.type.name);
    setType(type);
  };


  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonDetail(currentUrl);
      await getTypeOfPokemon("https://pokeapi.co/api/v2/pokemon/" + pokemonId);

      setPokemon({
        descriptions: data.descriptions,
        name: data.name,
        photo: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
      });
    };
    fetchData();
  }, [currentUrl, pokemonId]); // Add pokemonId to the dependency array

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const handleSubmit = () => {
    if (userInput.toLowerCase() === pokemon.name) {
      setResultMessage("Bravo ! Vous avez trouvé le Pokémon !")
      setIsPokemonFound(true)
    } else {
      setResultMessage("Incorrect ! Essayez encore ou demandez une autre description.")
    }
  }

  const handleNextDescription = () => {
    if (descriptionIndex < pokemon.descriptions.length - 1) {
      setDescriptionIndex(descriptionIndex + 1)
    }
  }

  return pokemon.descriptions ? (
    <div className="App">
      <h1>Devinez le Pokémon !</h1>
      {isPokemonFound && (
        <img src={pokemon.photo} alt={pokemon.name} />
      )}
        <p className="description">{pokemon.descriptions[descriptionIndex]}</p>
     <div className='indice-wrapper'>
        <button className='w-50' onClick={handleNextDescription} disabled={descriptionIndex >= pokemon.descriptions.length - 1}>
          Une autre descriptions
        </button> 
        <button className={showType ? "bi-color w-50" : "w-50"} style={{
          "--type_1": `var(--${type[0]})`,
          "--type_2": `var(--${type[1] || type[0]})`,
        }} onClick={() => setShowType(!showType)}>
          <p className='type'>{!showType ? "Type ? " : type.map(
            (type, index) => (
              <span key={index} className="type">{type}</span>
            )
          )}</p>
        </button> 
      </div>
      <br />
      <div className="answer-container">
        
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Le nom du Pokémon"
        list="pokemon-list"
      />
      <datalist id="pokemon-list">
        {pokemonNames.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>
      <button onClick={handleSubmit}>Valider</button>
      </div>
      <p>{resultMessage}</p>
      {resultMessage === "Bravo ! Vous avez trouvé le Pokémon !" ? (
        <>
       <Confetti
          width={innerWidth}
          height={innerHeight}
          numberOfPieces={80}
          friction={1}
          initialVelocityY={0}
          initialVelocityX={0}
          tweenDuration={10000}
          drawShape={ctx => drawPokeball(ctx)}
        />
        <button onClick={handlePokemonChange}>Passer au suivant</button>
        </>
      ) : (
        <button onClick={handlePokemonChange}>Passer à un autre Pokémon</button>
      )}
            <ShowSolution correctAnswer={pokemon.name} />

    </div>
  ) : null
}

export default App
