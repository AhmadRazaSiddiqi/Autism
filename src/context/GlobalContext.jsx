import { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setLoading = (loading) => setIsLoading(loading);
  const setError = (error, message = "") => {
    setIsError(error);
    setErrorMessage(message);
  };

  useEffect(() => {
    const requestInterceptor = (config) => {
      setLoading(true);
      setError(false, "");
      return config;
    };

    const responseInterceptor = (response) => {
      setLoading(false);
      return response;
    };

    const errorInterceptor = (error) => {
      setLoading(false);

      if (error.config?.skipGlobalError) {
        return Promise.reject(error);
      }

      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      setError(true, message);

      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          icon: "error",
          title: "Error",
          text: message,
        });
      });

      return Promise.reject(error);
    };

    ApiService.bindInterceptors(
      requestInterceptor,
      responseInterceptor,
      errorInterceptor
    );
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoading, isError, errorMessage, setLoading, setError }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
