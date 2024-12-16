import axios from "axios";
import { useEffect, useState } from "react";
import { Business } from "../types";

const useMarkers = () => {
  const [markers, setMarkers] = useState<Business[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_API_URL);
        setMarkers(response.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarkers();
  }, [])

  return { markers, error, isLoading}
  
};

export default useMarkers;