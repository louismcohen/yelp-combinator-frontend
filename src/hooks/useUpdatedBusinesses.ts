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

			queryClient.setQueryData(['businesses'], (businesses: Business[]) => [
				businesses,
				...updatedBusinesses,
			]);
			queryClient.invalidateQueries({
				queryKey: ['businesses'],
				refetchType: 'none',
			});
		}
	}, [query.data, query.isFetching, queryClient]);

	return query;
};

export default useUpdatedBusinesses;
