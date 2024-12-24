import { Business } from '../types';
import tz_lookup from '@photostructure/tz-lookup';
import { DateTime } from 'luxon';

interface BusinessStatus {
	isOpen: boolean;
	status: string;
	auxStatus: string | null;
}

const formatTime = (timeStr: string): string => {
	const hour = parseInt(timeStr.slice(0, 2));
	const minute = parseInt(timeStr.slice(2));
	const period = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

// const getTimeZone = async (latitude: number, longitude: number) => await GeoTZ.find(latitude, longitude);

export const getBusinessHoursStatus = (
	business: Business
): BusinessStatus => {
	if (!business.hours || business.hours.length === 0) {
		return {
			isOpen: true,
			status: '',
			auxStatus: '',
		};
	}
	const timeZone = tz_lookup(business.coordinates.latitude, business.coordinates.longitude);
	const hoursData = business.hours;

	const now = DateTime.now().setZone(timeZone);
	const currentDay = now.weekday - 1;
	const currentTime = now.hour * 100 + now.minute;
	console.log(now, currentDay, now.hour, currentTime, hoursData);


	// Check if open from previous day's overnight hours
	const previousDay = (currentDay - 1 + 7) % 7;
	const previousDayHours = hoursData[0].open.find((h) => h.day === previousDay);

	if (previousDayHours?.is_overnight) {
		const endTime = parseInt(previousDayHours.end);
		if (currentTime < endTime) {
			return {
				isOpen: true,
				status: 'Open ',
				auxStatus: `until ${formatTime(previousDayHours.end)}`,
			};
		}
	}

	// Get the current day's hours
	const todayHours = hoursData[0].open.find((h) => h.day === currentDay);

	if (todayHours) {
		const startTime = parseInt(todayHours.start);
		const endTime = parseInt(todayHours.end);

		// Check if currently open
		if (todayHours.is_overnight) {
			// For overnight hours, we're open if:
			// 1. We're past the start time on the current day (before midnight)
			// 2. We're before the end time on the next day (after midnight)
			if (currentTime >= startTime || currentTime < endTime) {
				const nextDay = currentTime >= startTime ? 'tomorrow' : 'today';
				return {
					isOpen: true,
					status: 'Open ',
					auxStatus: `until ${formatTime(todayHours.end)} ${nextDay}`,
				};
			}
		} else {
			if (currentTime >= startTime && currentTime < endTime) {
				return {
					isOpen: true,
					status: 'Open ',
					auxStatus: `until ${formatTime(todayHours.end)}`,
				};
			}
		}

		// If we're before today's opening time
		if (currentTime < startTime) {
			const timeString = formatTime(todayHours.start);
			return {
				isOpen: false,
				status: 'Closed',
				auxStatus: ` | Opens at ${timeString}`,
			};
		}
	}

	// Find next opening time
	let daysToCheck = 7; // Prevent infinite loop
	let nextDay = currentDay;
	let daysAhead = 0;

	while (daysToCheck > 0) {
		nextDay = (nextDay + 1) % 7;
		daysAhead++;
		const nextDayHours = hoursData[0].open.find((h) => h.day === nextDay);

		if (nextDayHours) {
			const timeString = formatTime(nextDayHours.start);

			if (daysAhead === 1) {
				return {
					isOpen: false,
					status: 'Closed',
					auxStatus: ` | Opens tomorrow at ${timeString}`,
				};
			} else {
				const days = [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
				];
				return {
					isOpen: false,
					status: 'Closed',
					auxStatus: ` | Opens ${days[nextDay]} at ${timeString}`,
				};
			}
		}

		daysToCheck--;
	}

	return {
		isOpen: true,
		status: '',
		auxStatus: null,
	};
};
