import { ReviewReport } from '../types';

const STORAGE_KEY = 'codereview_history_v1';

export const saveReport = (report: ReviewReport): void => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const history: ReviewReport[] = existingData ? JSON.parse(existingData) : [];
    // Add new report to the beginning
    const updatedHistory = [report, ...history];
    // Limit to last 50 reports to prevent quota limits
    const trimmedHistory = updatedHistory.slice(0, 50); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save report', error);
  }
};

export const getHistory = (): ReviewReport[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve history', error);
    return [];
  }
};

export const getReportById = (id: string): ReviewReport | undefined => {
  const history = getHistory();
  return history.find(r => r.id === id);
};

export const deleteReport = (id: string): ReviewReport[] => {
  const history = getHistory();
  const updated = history.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};