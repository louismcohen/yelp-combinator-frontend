import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { Viewport } from '../store/mapStore';
import axios from 'axios';
import { Business } from '../types';
import { useSearchFilterStore } from '../store/searchFilterStore';

const getAiSearchResults = async (query: string, viewport: Viewport) => {
	console.log('getAiSearchResults', query, viewport);
	const data = {
		query,
		viewport,
	};

	const response = await axios.post(
		`${import.meta.env.VITE_BACKEND_API_URL}search`,
		data,
	);
	console.log('getAiSearchResults response', response);
	return response;
};

interface MutationFnProps {
	query: string;
	viewport: Viewport;
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
			console.log('search success', data);
			updateAiSearch(data.data);
		},
	});

	return mutation;
};
