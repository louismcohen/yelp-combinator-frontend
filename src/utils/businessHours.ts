import tz_lookup from '@photostructure/tz-lookup';
import { DateTime } from 'luxon';
import type { Business, OpeningHours } from '../types';

interface BusinessStatus {
	isOpen: boolean;
	status: string;
	auxStatus: string | null;
}

interface ClosingTime {
	minutesFromToday: number;
	time: string;
	tomorrow: boolean;
}

const MINUTES_PER_DAY = 24 * 60;

// Yelp numbers days Monday = 0 through Sunday = 6
const WEEKDAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

const formatTime = (timeStr: string): string => {
	const hour = Number.parseInt(timeStr.slice(0, 2));
	const minute = Number.parseInt(timeStr.slice(2));
	const period = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

const toMinutes = (timeStr: string): number =>
	Number.parseInt(timeStr.slice(0, 2)) * 60 +
	Number.parseInt(timeStr.slice(2));

// An end of "0000" means midnight, so it crosses into the next day even when is_overnight is false
const crossesMidnight = (interval: OpeningHours): boolean =>
	interval.is_overnight || toMinutes(interval.end) <= toMinutes(interval.start);

// const getTimeZone = async (latitude: number, longitude: number) => await GeoTZ.find(latitude, longitude);

export const getBusinessHoursStatus = (business: Business): BusinessStatus => {
	if (!business.yelpData) return { isOpen: true, status: '', auxStatus: '' };

	if (!business.yelpData.hours || business.yelpData.hours.length === 0) {
		return {
			isOpen: true,
			status: '',
			auxStatus: '',
		};
	}
	const timeZone = tz_lookup(
		business.yelpData.coordinates.latitude,
		business.yelpData.coordinates.longitude,
	);
	const intervals = business.yelpData.hours[0].open;

	const now = DateTime.now().setZone(timeZone);
	const currentDay = now.weekday - 1;
	const previousDay = (currentDay + 6) % 7;
	const currentMinutes = now.hour * 60 + now.minute;

	let closingTime: ClosingTime | null = null;

	for (const interval of intervals) {
		const start = toMinutes(interval.start);
		const end = toMinutes(interval.end);
		const overnight = crossesMidnight(interval);
		let minutesFromToday: number | null = null;

		if (interval.day === previousDay && overnight && currentMinutes < end) {
			minutesFromToday = end;
		} else if (
			interval.day === currentDay &&
			currentMinutes >= start &&
			(overnight || currentMinutes < end)
		) {
			minutesFromToday = overnight ? MINUTES_PER_DAY + end : end;
		}

		if (
			minutesFromToday !== null &&
			(!closingTime || minutesFromToday < closingTime.minutesFromToday)
		) {
			closingTime = {
				minutesFromToday,
				time: interval.end,
				tomorrow: minutesFromToday >= MINUTES_PER_DAY,
			};
		}
	}

	if (closingTime) {
		return {
			isOpen: true,
			status: 'Open ',
			auxStatus: `until ${formatTime(closingTime.time)}${
				closingTime.tomorrow ? ' tomorrow' : ''
			}`,
		};
	}

	for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
		const day = (currentDay + daysAhead) % 7;
		const nextOpening = intervals
			.filter(
				(interval) =>
					interval.day === day &&
					(daysAhead > 0 || toMinutes(interval.start) > currentMinutes),
			)
			.sort((a, b) => toMinutes(a.start) - toMinutes(b.start))[0];

		if (!nextOpening) continue;

		const timeString = formatTime(nextOpening.start);
		let auxStatus = ` | Opens ${WEEKDAYS[day]} at ${timeString}`;
		if (daysAhead === 0) auxStatus = ` | Opens at ${timeString}`;
		if (daysAhead === 1) auxStatus = ` | Opens tomorrow at ${timeString}`;

		return {
			isOpen: false,
			status: 'Closed',
			auxStatus,
		};
	}

	return {
		isOpen: false,
		status: 'Closed',
		auxStatus: '',
	};
};
