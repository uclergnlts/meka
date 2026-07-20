import { useCallback, useEffect, useState } from "react";

export function useApiResource(loader, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setStatus("loading");
      setError(null);

      try {
        const result = await loader();

        if (!isMounted) {
          return;
        }

        setData(result);
        setStatus("success");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(requestError);
        setStatus("error");
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [loader]);

  const reload = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const result = await loader();
      setData(result);
      setStatus("success");
      return result;
    } catch (requestError) {
      setError(requestError);
      setStatus("error");
      throw requestError;
    }
  }, [loader]);

  return {
    data,
    setData,
    reload,
    error,
    isLoading: status === "loading",
    isError: status === "error",
  };
}
