import axios from 'axios';
import { Business, Category } from '../types';
import { useQuery } from '@tanstack/react-query';

const fetchBusinesses = async (): Promise<Business[]> => {
	console.log('fetching businesses');
	const response = await axios.get(import.meta.env.VITE_BACKEND_API_URL);
	console.log('loaded businesses. total count:', response.data.length);
	return response.data;
};

const parseUniqueCategories = (businesses: Business[]): string[] => {
	const categories = [
		...new Set(
			businesses
				.flatMap((business: Business) => business.categories)
				.map((category: Category) => category.title)
				.sort(),
		),
	];
	return categories;
};

const useBusinesses = () => {
	const query = useQuery<Business[]>({
		queryKey: ['businesses'],
		queryFn: fetchBusinesses,
		placeholderData: [],
	});

	return query;
};

export default useBusinesses;
