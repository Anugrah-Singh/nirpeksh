import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicDetails } from '../services/api';
import ArticleItem from '../components/ArticleItem';
import ChatBot from '../components/ChatBot';
import ReactMarkdown from 'react-markdown';

function TopicDetailsPage() {
  const { topicId } = useParams();
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedArticles, setCompletedArticles] = useState(new Set());

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTopicDetails(topicId);
        console.log('Fetched topic details:', data);
        
        const topicInfo = data[0];
        
        let relatedArticles = [];
        if (data[1] && typeof data[1] === 'string') {
          try {
            relatedArticles = JSON.parse(data[1]);
          } catch (parseErr) {
            console.error('Failed to parse related articles:', parseErr);
          }
        }
        
        const processedData = {
          ...topicInfo,
          related_articles: relatedArticles
        };
        
        setTopicDetails(processedData);
        
        if (relatedArticles && relatedArticles.length > 0) {
          const initialCompleted = new Set();
          relatedArticles.forEach(article => {
            if (article.is_read) {
              initialCompleted.add(article.article_id);
            }
          });
          setCompletedArticles(initialCompleted);
        }
      } catch (err) {
        setError(`Failed to fetch details for topic ${topicId}. Please try again later.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [topicId]);

  const handleArticleCompleted = (articleId) => {
    setCompletedArticles(prev => new Set(prev).add(articleId));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-10 bg-indigo-300 rounded-full w-1/2"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 bg-indigo-200 rounded-full w-3/4 mx-auto"></div>
              <div className="h-4 bg-indigo-200 rounded-full w-1/2 mx-auto"></div>
              <div className="h-4 bg-indigo-200 rounded-full w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm border border-red-200 rounded-xl p-8 text-center shadow-lg">
          <svg className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
  
  if (!topicDetails) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm border border-yellow-200 rounded-xl p-8 text-center shadow-lg">
          <svg className="h-16 w-16 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-600 text-lg mb-4">Topic details not found.</p>
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Back Button and Topic ID */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm md:text-base">Topic ID:</span>
            <span className="text-sm md:text-base bg-indigo-100 px-3 py-1 rounded-full font-mono">{topicId}</span>
          </div>
        </div>
        
        {/* Topic Title */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-indigo-200"></div>
          </div>
          <div className="relative flex justify-start">
            <h1 className="pr-3 text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-900 bg-gradient-to-br from-indigo-50 to-purple-100">
              {topicDetails.topic_name || `Topic ${topicId}`}
            </h1>
          </div>
        </div>

        {/* Brief Section */}
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-indigo-800">Brief Overview</h3>
          </div>
          <div className="p-6">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p {...props} className="text-gray-700 whitespace-pre-wrap leading-relaxed" />,
              }}
            >
              {topicDetails.brief || 'No brief available for this topic.'}
            </ReactMarkdown>
          </div>
        </section>

        {/* Perspective Section */}
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h3 className="text-xl font-semibold text-indigo-800">Balanced Perspective</h3>
          </div>
          <div className="p-6">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p {...props} className="text-gray-700 whitespace-pre-wrap leading-relaxed" />,
              }}
            >
              {topicDetails.perspective || 'No perspective available for this topic.'}
            </ReactMarkdown>
          </div>
        </section>

        {/* Related Articles Section */}
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-semibold text-indigo-800">Related Articles</h3>
          </div>
          <div className="p-6">
            {topicDetails.related_articles && topicDetails.related_articles.length > 0 ? (
              <ul className="space-y-4">
                {topicDetails.related_articles.map((article) => (
                  <ArticleItem
                    key={article.article_id}
                    articleId={article.article_id}
                    articleName={article.article_name}
                    articleUrl={article.url}
                    isCompleted={completedArticles.has(article.article_id)} 
                    onComplete={handleArticleCompleted}
                    bias={article.bias}
                    summary={article.summary}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500">No related articles found for this topic.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Topic Chatbot Section */}
        <section className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-xl font-semibold text-indigo-800">Topic Assistant</h3>
          </div>
          <div className="p-6">
            <ChatBot />
          </div>
        </section>
      </div>
    </div>
  );
}

export default TopicDetailsPage;