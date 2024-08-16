//create a auth service using fetch api

const api = async (endpoint, options) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, options);
  return response;
};

const auth = {
  signup: async (email, password) => {
    try {
      const response = await api("/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  login: async (email, password) => {
    try {
      const response = await api("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response;
    } catch (error) {
      throw new Error(`Erreur lors de la connexion`);
    }
  },

  logout: async () => {
    try {
      const response = await api("/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  whoami: async () => {
    try {
      const response = await api("/auth/whoami", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

const sendRegister = async (email, password) => {
  try {
    await auth.signup(email, password);
  } catch (error) {
    throw error;
  }
};

const sendConnexion = async (email, password) => {
  try {
    await auth.login(email, password);
    sessionStorage.setItem("authentified", true);
  } catch (error) {
    throw error;
  }
};

const showProfil = async () => {
  try {
    const response = await auth.whoami();
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

const disconnect = async () => {
  try {
    await auth.logout();
    sessionStorage.removeItem("authentified");
  } catch (error) {
    throw error;
  }
};

export { sendRegister, sendConnexion, showProfil, disconnect };
