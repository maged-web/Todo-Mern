import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL; 

export const validateDates = (from: string, to: string): string | null => {
    const currentDate = new Date().getTime();
    if (new Date(from).getTime() < currentDate || new Date(to).getTime() < currentDate) {
        return 'The "from" or "to" date cannot be in the past.';
    }
    if (new Date(from).getTime() > new Date(to).getTime()) {
        return 'The "from" date cannot be later than the "to" date.';
    }
    return null;
};

export const calculateDuration = (from: string, to: string): number => {
    return (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60);
};

export const fetchTotalHours = async (employeeId: string, date: string) => {
    const summaryResponse = await axios.get(`${API_URL}/daily-summary/${employeeId}/${new Date(date).toISOString()}`);
    return summaryResponse.data.totalHours;
};
