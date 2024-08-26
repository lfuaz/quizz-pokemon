const PokemonDescription = ({ descriptions, descriptionIndex }) => {
  return <p className="description">{descriptions[descriptionIndex]}</p>;
};

const Helper = ({
  type,
  showType,
  setShowType,
  handleNextDescription,
  descriptionIndex,
  descriptions,
}) => {
  const size = type.length > 1 ? "w-50" : "w-100";

  return (
    <>
      <button
        className={"bkg-color w-50"}
        onClick={() => setShowType(!showType)}
      >
        <p className="types">
          {!showType ? (
            <span className="type">Type ?</span>
          ) : (
            type.map((type, index) => (
              <span key={index} className={`type type--${type} ${size}`}>
                {type}
              </span>
            ))
          )}
        </p>
      </button>
      <button
        className="action w-50"
        onClick={handleNextDescription}
        disabled={descriptionIndex >= descriptions.length - 1}
      >
        Une autre descriptions
      </button>
    </>
  );
};

export { PokemonDescription, Helper };
