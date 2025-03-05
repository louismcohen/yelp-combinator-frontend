import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from '@tanstack/react-query';
import { Business } from '../types';
import axios from 'axios';

interface UpdateVisitedParams {
	alias: string;
	visited: boolean;
}

export const useUpdateVisitedBusiness = () => {
	const queryClient = useQueryClient();

	const updateVisited = async ({
		alias,
		visited,
	}: UpdateVisitedParams): Promise<Business> => {
		const params = {
			alias,
		};
		const body = {
			visited,
		};
		const response = await axios.patch(
			`${import.meta.env.VITE_BACKEND_API_URL}/businesses/${alias}/visited`,
			body,
			{ params },
		);

		return response.data;
	};

	const mutation = useMutation({
		mutationFn: ({ alias, visited }: UpdateVisitedParams) =>
			updateVisited({ alias, visited }),
		onMutate: async ({ alias, visited }: UpdateVisitedParams) => {
			await queryClient.cancelQueries({ queryKey: ['businesses'] });
			const previousData = queryClient.getQueryData<Business[]>(['businesses']);
			queryClient.setQueryData(
				['businesses'],
				(previousData: Business[] | undefined) =>
					previousData?.map((business) =>
						business.alias === alias ? { ...business, visited } : business,
					),
			);

			return { previousData };
		},
		onError(error, updatedBusiness, context) {
			queryClient.setQueryData(['businesses'], context?.previousData);
			throw new Error(`Error updating business ${updatedBusiness}: ${error}`);
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: ['businesses'],
				refetchType: 'none',
			}),
	});

	return mutation;
};

const useMutateBusiness = (): UseMutationResult<Business, Error, Business> => {
	const queryClient = useQueryClient();

	const updateBusiness = async (business: Business): Promise<Business> => {
		const params = {
			action: 'updateSaved',
		};
		const response = await axios.put(
			`${import.meta.env.VITE_BACKEND_API_URL}yelp-business`,
			business,
			{ params },
		);
		console.log('updateBusiness response', response);
		return response.data;
	};

	const mutation = useMutation({
		mutationFn: (business: Business) => updateBusiness(business),
		onMutate: async (updateBusiness) => {
			await queryClient.cancelQueries({ queryKey: ['businesses'] });
			const previousData = queryClient.getQueryData<Business[]>(['businesses']);
			queryClient.setQueryData(
				['businesses'],
				(previousData: Business[] | undefined) =>
					previousData?.map((business) =>
						business.alias === updateBusiness.alias ? updateBusiness : business,
					),
			);

			return { previousData };
		},
		onError(error, updatedBusiness, context) {
			queryClient.setQueryData(['businesses'], context?.previousData);
			throw new Error(`Error updating business ${updatedBusiness}: ${error}`);
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: ['businesses'],
				refetchType: 'none',
			}),
	});

	return mutation;
};

export default useMutateBusiness;
