import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);
  // Ref is created which will not change when the component is re-rendered again. It can store the values like state. We will use it to store the abort controls for the request.

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController(); //use to abort a fetch request if page is changed while fetching... It is a built in browser functionality. We never continue with the request that is on it's way out when we switch the component that triggered the request.

      activeHttpRequests.current.push(httpAbortCtrl); // adding the abort controller to the ref.

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const resData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl //remove the current abort request if request completes
        );
        if (!resData.status === "success") {
          throw new Error(resData.message);
        }

        setIsLoading(false);
        return resData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    }; // It is a CLEANUP function which will run before useEffect is run again or when a component that uses useEffect unmounts.
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
