import axios from 'axios';
import { Business, Category } from '../types';
import { useQuery } from '@tanstack/react-query';

const fetchBusinesses = async (): Promise<Business[]> => {
	console.log('fetching businesses');
	const response = await axios.get(
		`${import.meta.env.VITE_BACKEND_API_URL}/api/businesses/all`,
	);
	console.log('loaded businesses. total count:', response.data.length);
	return response.data;
};

const parseUniqueCategories = (businesses: Business[]): string[] => {
	const categories = [
		...new Set(
			businesses
				.flatMap((business: Business) => business.yelpData?.categories)
				.filter((category): category is Category => category !== undefined)
				.map((category) => category.title)
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
		staleTime: 5 * 60 * 1000, // 5 minutes - prevent unnecessary refetches
	});

	return query;
};

export default useBusinesses;
