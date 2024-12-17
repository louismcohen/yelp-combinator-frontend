import axios from "axios";
import { useEffect, useState } from "react";
import { Business } from "../types";
import { useQuery } from "@tanstack/react-query";

const useMarkers = () => {
  const fetchBusinesses = async () => {
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

export default useMarkers;