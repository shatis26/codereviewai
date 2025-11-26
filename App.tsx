import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import FileUpload from './components/FileUpload';
import ReviewDashboard from './components/ReviewDashboard';
import { analyzeCode } from './services/geminiService';
import { saveReport, getHistory, deleteReport, getReportById } from './services/storageService';
import { ReviewReport } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<ReviewReport[]>([]);
  const [currentReport, setCurrentReport] = useState<ReviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalyze = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setCurrentReport(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      try {
        if (!content) throw new Error("File is empty");
        if (content.length > 50000) throw new Error("File is too large for this demo (max 50kb).");

        const report = await analyzeCode(file.name, content);
        
        saveReport(report);
        setHistory(getHistory()); // Refresh list
        setCurrentReport(report);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An unknown error occurred during analysis.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setIsLoading(false);
    };

    // Simple text file reading
    reader.readAsText(file);
  };

  const handleSelectReport = (id: string) => {
    const report = getReportById(id);
    if (report) {
      setCurrentReport(report);
      setError(null);
    }
  };

  const handleDeleteReport = (id: string) => {
    const updated = deleteReport(id);
    setHistory(updated);
    if (currentReport?.id === id) {
      setCurrentReport(null);
    }
  };

  const handleNewReview = () => {
    setCurrentReport(null);
    setError(null);
  };

  return (
    <Layout 
      history={history}
      onSelectReport={handleSelectReport}
      onNewReview={handleNewReview}
      onDeleteReport={handleDeleteReport}
      currentReportId={currentReport?.id}
    >
      {currentReport ? (
        <ReviewDashboard report={currentReport} />
      ) : (
        <FileUpload 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading} 
          error={error} 
        />
      )}
    </Layout>
  );
};

export default App;