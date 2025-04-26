import React, { useState } from 'react';
import { markArticleAsComplete } from '../services/api';

function ArticleItem({ articleId, articleName, articleUrl, isCompleted, onComplete, bias, summary }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedLocally, setCompletedLocally] = useState(isCompleted);
  const [showDetails, setShowDetails] = useState(false);

  const handleCompleteClick = async () => {
    if (completedLocally) return;

    setLoading(true);
    setError('');
    try {
      await markArticleAsComplete(articleId);
      setCompletedLocally(true);
      onComplete(articleId);
    } catch (err) {
      setError('Failed to mark as complete.');
      console.error(`Error marking article ${articleId} complete:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Updated color scheme to match the logo
  const getBiasLabel = () => {
    if (!bias) return null;

    const lowerBias = bias.toLowerCase();
    if (lowerBias.includes('left')) {
      return { text: bias, color: 'bg-teal-100 text-teal-800 border-teal-200' };
    } else if (lowerBias.includes('right')) {
      return { text: bias, color: 'bg-blue-100 text-blue-800 border-blue-200' };
    } else if (lowerBias.includes('center')) {
      return { text: bias, color: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    return { text: bias, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const biasLabel = getBiasLabel();

  return (
    <li className="mb-6 overflow-hidden transition-all duration-300 rounded-xl border border-indigo-200 shadow-sm hover:shadow-md">
      <div className="bg-white">
        {/* Card Header */}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Article Info */}
          <div className="flex-grow">
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-lg font-medium text-gray-900 hover:text-indigo-600"
              title={`Open article: ${articleName}`}
            >
              <span className="line-clamp-2 group-hover:underline">
                {articleName || `Article ${articleId}`}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-1.5 text-indigo-500 group-hover:text-indigo-700 transition-colors"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>

            {biasLabel && (
              <span className={`mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${biasLabel.color} border`}>
                {biasLabel.text}
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-expanded={showDetails}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {!completedLocally ? (
              <button
                onClick={handleCompleteClick}
                disabled={loading}
                className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-teal-700 to-blue-500 text-white shadow-lg rounded-lg transition-colors hover:from-teal-600 hover:to-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark as Read</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-teal-700 to-blue-500 text-white shadow-lg rounded-lg cursor-not-allowed hover:from-teal-600 hover:to-blue-400"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Read</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Details Section */}
        {showDetails && (
          <div className="border-t border-indigo-100 bg-indigo-50 p-4 md:p-5">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-800 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {summary ? (
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-gray-800">Summary</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No additional details available for this article.</p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export default ArticleItem;