import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode, AlertCircle, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAnalyze(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAnalyze(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Code Reviewer</h1>
        <p className="text-lg text-gray-600">
          Upload your source code to get an instant, detailed analysis powered by Gemini 2.5.
          Detect bugs, code smells, and security issues in seconds.
        </p>
      </div>

      <div
        onClick={!isLoading ? handleClick : undefined}
        onDragOver={!isLoading ? handleDragOver : undefined}
        onDragLeave={!isLoading ? handleDragLeave : undefined}
        onDrop={!isLoading ? handleDrop : undefined}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out
          ${isLoading ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-300' : 'cursor-pointer'}
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <>
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Analyzing Code...</h3>
                <p className="text-gray-500 mt-1">This may take a few seconds depending on file size.</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <UploadCloud size={48} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Click to upload or drag and drop</h3>
                <p className="text-gray-500 mt-1">Supports JS, TS, Python, Go, Rust, Java, and more.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FileCode, title: "Deep Analysis", desc: "Checks for modularity, readability, and patterns." },
          { icon: AlertCircle, title: "Bug Detection", desc: "Identifies potential runtime errors and edge cases." },
          { icon: UploadCloud, title: "Instant Results", desc: "Get a structured report in seconds, not hours." },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <item.icon className="w-8 h-8 text-blue-500 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;