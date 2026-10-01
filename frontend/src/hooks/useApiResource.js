import { useCallback, useEffect, useRef, useState } from "react";

export function useApiResource(loader, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    if (!mountedRef.current) return undefined;
    setStatus("loading");
    setError(null);

    try {
      const result = await loader();
      if (!mountedRef.current) return result;
      setData(result);
      setStatus("success");
      return result;
    } catch (requestError) {
      if (!mountedRef.current) throw requestError;
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
