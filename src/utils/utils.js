const randomId = () => Math.floor(Math.random() * 151) + 1;

const capitalize = (str = "") => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export { randomId, capitalize };
