import React, { useState } from 'react';
import { markArticleAsComplete } from '../services/api';

// Receives article details and completion status/handler from TopicDetailsPage
function ArticleItem({ articleId, articleName, articleUrl, isCompleted, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedLocally, setCompletedLocally] = useState(isCompleted); // Use local state derived from prop

  const handleCompleteClick = async () => {
    if (completedLocally) return; // Already marked or being marked

    setLoading(true);
    setError('');
    try {
      await markArticleAsComplete(articleId);
      setCompletedLocally(true); // Mark as completed in local state
      onComplete(articleId); // Notify parent component
    } catch (err) {
      setError('Failed to mark as complete.');
      console.error(`Error marking article ${articleId} complete:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <a
        href={articleUrl}
        target="_blank" // Open in new tab
        rel="noopener noreferrer" // Security best practice
        className="text-blue-600 hover:underline hover:text-blue-800 flex-grow mr-4"
        title={`Open article: ${articleName}`} // Tooltip
      >
        {articleName || `Article ${articleId}`}
      </a>
      <div>
        {!completedLocally ? (
          <button
            onClick={handleCompleteClick}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Marking...' : 'Mark as Read'}
          </button>
        ) : (
          <span className="text-sm text-gray-500 italic font-semibold">Read</span>
        )}
        {error && <p className="text-red-500 text-xs italic ml-2">{error}</p>}
      </div>
    </li>
  );
}

export default ArticleItem;