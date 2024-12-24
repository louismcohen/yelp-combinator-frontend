import axios, { AxiosResponse } from "axios";
import { Business } from "../types";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

const useBusinesses = () => {
  const queryClient = useQueryClient();

  const fetchBusinesses = async (): Promise<Business[]> => {
    const response = await axios.get(import.meta.env.VITE_BACKEND_API_URL);
    return response.data;
  }

  const query = useQuery<Business[]>({
    queryKey: ['businesses'],
    queryFn: fetchBusinesses,
    placeholderData: [],
  });

  const updateBusiness = async (business: Business): Promise<Business> => {
    const params = {
      action: 'updateSaved',
    }
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}yelp-business`, business, { params });
    console.log('updateBusiness response', response);
    return response.data;
  }

  const mutation = useMutation({
    mutationFn: (business: Business) => updateBusiness(business),
    onMutate: async (updateBusiness) => {
      await queryClient.cancelQueries({queryKey: ['businesses']});
      const previousData = queryClient.getQueryData<Business[]>(['businesses']);
      queryClient.setQueryData(['businesses'], (previousData: Business[] | undefined) => previousData?.map((business) => business.alias === updateBusiness.alias ? updateBusiness : business));

      return { previousData }
    },
    onError(error, updatedBusiness, context) {
      queryClient.setQueryData(['businsesses'], context?.previousData);
      throw new Error(`Error updating business ${updatedBusiness}: ${error}`);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['businesses'] }),
  })

  return { query, mutation };
};

export default useBusinesses;