import React from 'react';
import { Code2, Github, History, Plus } from 'lucide-react';
import { ReviewReport } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  history: ReviewReport[];
  onSelectReport: (id: string) => void;
  onNewReview: () => void;
  onDeleteReport: (id: string) => void;
  currentReportId?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  history, 
  onSelectReport, 
  onNewReview,
  onDeleteReport,
  currentReportId 
}) => {
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
            <Code2 className="text-blue-500" />
            <span>CodeReviewAI</span>
          </div>
          
          <button 
            onClick={onNewReview}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            <Plus size={18} />
            New Review
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-2">History</h3>
          {history.length === 0 ? (
            <p className="text-sm text-slate-600 px-2 italic">No previous reviews.</p>
          ) : (
            history.map((report) => (
              <div 
                key={report.id}
                className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                  currentReportId === report.id 
                    ? 'bg-slate-800 text-white' 
                    : 'hover:bg-slate-800/50'
                }`}
                onClick={() => onSelectReport(report.id)}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate text-sm">{report.fileName}</span>
                  <span className="text-xs text-slate-500">{formatDate(report.timestamp)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteReport(report.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                  title="Delete"
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>v1.0.0</span>
          <a href="#" className="hover:text-slate-300 flex items-center gap-1">
            <Github size={12} /> Source
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;