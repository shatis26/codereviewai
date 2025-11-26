import React from 'react';
import { 
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, 
  PolarAngleAxis, Tooltip
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, Shield, Zap, FileText, 
  Bug, Search, Info 
} from 'lucide-react';
import { ReviewReport, Issue, Severity, IssueCategory } from '../types';

interface ReviewDashboardProps {
  report: ReviewReport;
}

const ScoreCard: React.FC<{ title: string; score: number; icon: any }> = ({ title, score, icon: Icon }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 bg-green-50 ring-green-500/20';
    if (s >= 60) return 'text-yellow-600 bg-yellow-50 ring-yellow-500/20';
    return 'text-red-600 bg-red-50 ring-red-500/20';
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${getColor(score)} ring-1`}>
          <Icon size={20} />
        </div>
        <span className="font-medium text-gray-600">{title}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
          {score}
        </span>
        <span className="text-xs text-gray-400 mb-1">/100</span>
      </div>
    </div>
  );
};

const IssueItem: React.FC<{ issue: Issue }> = ({ issue }) => {
  const getSeverityColor = (s: Severity) => {
    switch(s) {
      case Severity.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case Severity.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Severity.LOW: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (c: IssueCategory) => {
    switch(c) {
      case IssueCategory.BUG: return Bug;
      case IssueCategory.SECURITY: return Shield;
      case IssueCategory.CODE_SMELL: return AlertTriangle;
      default: return Info;
    }
  };

  const Icon = getCategoryIcon(issue.category);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getSeverityColor(issue.severity)}`}>
            {issue.severity}
          </span>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {issue.category.replace('_', ' ')}
          </span>
          {issue.line && (
            <span className="text-xs text-gray-400 font-mono">
              Line {issue.line}
            </span>
          )}
        </div>
        <Icon size={16} className="text-gray-400" />
      </div>
      <h4 className="text-gray-900 font-medium mb-1">{issue.description}</h4>
      <div className="mt-3 bg-blue-50/50 p-3 rounded text-sm text-blue-800 border border-blue-100">
        <span className="font-semibold mr-1">Fix:</span> {issue.suggestion}
      </div>
    </div>
  );
};

const ReviewDashboard: React.FC<ReviewDashboardProps> = ({ report }) => {
  const chartData = [
    { name: 'Readability', value: report.scores.readability, fill: '#3b82f6' },
    { name: 'Maintainability', value: report.scores.maintainability, fill: '#8b5cf6' },
    { name: 'Security', value: report.scores.security, fill: '#ef4444' },
    { name: 'Performance', value: report.scores.performance, fill: '#10b981' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{report.fileName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Analyzed {new Date(report.timestamp).toLocaleString()} • {report.language}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Action buttons could go here */}
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scores & Chart */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="font-semibold text-gray-900 mb-4 w-full">Quality Score</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="40%" 
                innerRadius="15%" 
                outerRadius="100%" 
                barSize={12} 
                data={chartData}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend 
                  iconSize={10} 
                  layout="vertical" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <ScoreCard title="Readability" score={report.scores.readability} icon={FileText} />
          <ScoreCard title="Maintainability" score={report.scores.maintainability} icon={CheckCircle} />
          <ScoreCard title="Security" score={report.scores.security} icon={Shield} />
          <ScoreCard title="Performance" score={report.scores.performance} icon={Zap} />
          
          <div className="sm:col-span-2 bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Search size={18} /> Executive Summary
            </h3>
            <p className="text-blue-800 leading-relaxed text-sm">
              {report.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-orange-500" />
          Issues Found ({report.issues.length})
        </h3>
        
        {report.issues.length === 0 ? (
          <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-green-900">No Issues Detected</h4>
            <p className="text-green-700">Excellent job! Your code looks clean and secure.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {report.issues.map((issue, idx) => (
              <IssueItem key={idx} issue={issue} />
            ))}
          </div>
        )}
      </div>

       {/* Source Code Viewer (Optional/Simple) */}
       <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Source Code</h3>
        <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-slate-300">
            {report.rawCode.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-slate-600 select-none pr-4 text-right w-10">{i + 1}</span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </pre>
        </div>
       </div>
    </div>
  );
};

export default ReviewDashboard;