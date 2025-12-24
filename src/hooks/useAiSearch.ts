import { UseMutationResult, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { Viewport } from '../store/mapStore';
import { useSearchFilterStore } from '../store/searchFilterStore';
import { Business } from '../types';

const getAiSearchResults = async (query: string, viewport?: Viewport) => {
	const data = {
		query,
		viewport,
	};

	const response = await axios.post(
		`${import.meta.env.VITE_BACKEND_API_URL}/search`,
		data,
	);
	return response;
};

interface MutationFnProps {
	query: string;
	viewport?: Viewport;
}

export const useAiSearch = () => {
	const updateAiSearch = useSearchFilterStore((state) => state.updateAiSearch);
	const mutation = useMutation({
		mutationFn: ({ query, viewport }: MutationFnProps) =>
			getAiSearchResults(query, viewport),
		onError(error, variables) {
			throw new Error(
				`Error searching for businesses from query ${variables}: ${error}`,
			);
		},
		onSuccess(data, variables, context) {
			updateAiSearch({ ...data.data, query: variables.query });
		},
	});

	return mutation;
};
