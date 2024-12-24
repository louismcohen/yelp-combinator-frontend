import axios, { AxiosResponse } from "axios";
import { Business } from "../types";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

const useBusinesses = () => {
  const fetchBusinesses = async (): Promise<Business[]> => {
    console.log('fetching businesses');
    const response = await axios.get(import.meta.env.VITE_BACKEND_API_URL);
    return response.data;
  }

  const query = useQuery<Business[]>({
    queryKey: ['businesses'],
    queryFn: fetchBusinesses,
    placeholderData: [],
  });

  return query;
};

export default useBusinesses;