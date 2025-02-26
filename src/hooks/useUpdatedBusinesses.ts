import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Business } from '../types';
import axios from 'axios';

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
		}/api/collections/check-and-sync-updates`,
	);
	return response.data;
};

const useUpdatedBusinesses = () => {
	const queryClient = useQueryClient();

	const query = useQuery<UpdateResponse, Error>({
		queryKey: ['updatedBusinesses'],
		queryFn: checkAndSyncBusinesses,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		const businessesQueryState = queryClient.getQueryState(['businesses']);

		if (
			query.data &&
			!query.isFetching &&
			businessesQueryState?.status === 'success'
		) {
			console.log('updating businesses');
			const collections = query.data;
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
				queryClient.setQueryData(['businesses'], (oldBusinesses: Business[] = []) => {
					// Create a map of existing businesses by alias for quick lookup
					const businessMap = new Map(
						oldBusinesses.map(business => [business.alias, business])
					);
					
					// Update existing businesses or add new ones
					updatedBusinesses.forEach(updatedBusiness => {
						businessMap.set(updatedBusiness.alias, updatedBusiness);
					});
					
					// Convert map back to array
					return Array.from(businessMap.values());
				});
			}
		}
	}, [query.data, query.isFetching, queryClient]);

	return query;
};

export default useUpdatedBusinesses;
