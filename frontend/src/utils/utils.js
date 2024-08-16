const randomId = () => Math.floor(Math.random() * 151) + 1;

const capitalize = (str = "") => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const removeAllUtf8 = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export { randomId, capitalize, removeAllUtf8 };
