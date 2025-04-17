import axios from 'axios';
import type { Business, Category } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface Collection {
	_id: string;
	yelpCollectionId: string;
	title: string;
	lastUpdated: string;
	businesses: string[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface CollectionUpdateSummary {
	collectionId: string;
	status: 'success' | 'error';
	collection: Collection;
	businessesProcessed: number;
	businessesUpdated: number;
	updatedBusinesses: Business[];
	totalItems: number;
}

type UpdateResponse = CollectionUpdateSummary[];

const checkAndSyncBusinesses = async () => {
	const response = await axios.post(
		`${
			import.meta.env.VITE_BACKEND_API_URL
		}/collections/check-and-sync-updates`,
	);
	return response.data;
};

const fetchBusinesses = async (): Promise<Business[]> => {
	console.log('fetching businesses');
	const response = await axios.get(
		`${import.meta.env.VITE_BACKEND_API_URL}/businesses/all`,
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
	const queryClient = useQueryClient();
	const businessesQuery = useQuery<Business[]>({
		queryKey: ['businesses'],
		queryFn: fetchBusinesses,
		placeholderData: [],
		staleTime: 3 * 60 * 60 * 1000, // 3 hours - align with service worker cache
	});

	const updatesQuery = useQuery<UpdateResponse, Error>({
		queryKey: ['updatedBusinesses'],
		queryFn: checkAndSyncBusinesses,
		refetchOnWindowFocus: false,
		enabled: !(
			businessesQuery.isFetching || businessesQuery.data?.length === 0
		),
	});

	useEffect(() => {
		if (
			updatesQuery.data &&
			!businessesQuery.isFetching &&
			businessesQuery.status === 'success'
		) {
			console.log('updating businesses');
			const collections = updatesQuery.data;
			console.log('collections', collections);
			const updatedBusinesses = collections.reduce(
				(acc: Business[], collection) => {
					if (
						collection.status === 'success' &&
						collection.updatedBusinesses.length > 0
					) {
						acc.push(...collection.updatedBusinesses);
						return acc;
					}

					return acc;
				},
				[],
			);

			console.log('updated businesses', updatedBusinesses);

			if (updatedBusinesses.length > 0) {
				// Get current businesses data
				queryClient.setQueryData(
					['businesses'],
					(oldBusinesses: Business[] = []) => {
						// Create a map of existing businesses by alias for quick lookup
						const businessMap = new Map(
							oldBusinesses.map((business) => [business.alias, business]),
						);

						// Update existing businesses or add new ones
						for (const updatedBusiness of updatedBusinesses) {
							businessMap.set(updatedBusiness.alias, updatedBusiness);
						}

						// Convert map back to array
						return Array.from(businessMap.values());
					},
				);
			} else {
				console.log('No updated businesses');
			}
		}
	}, [
		updatesQuery.data,
		queryClient,
		businessesQuery.isFetching,
		businessesQuery.status,
	]);

	return businessesQuery;
};

export default useBusinesses;
