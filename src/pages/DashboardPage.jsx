import React, { useState, useEffect } from 'react';
import { getTopics } from '../services/api';
import TopicCard from '../components/TopicCard';

function DashboardPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTopics();
        setTopics(data || []);
      } catch (err) {
        setError('Failed to fetch topics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Filter and sort topics
  const filteredTopics = topics.filter(topic => 
    topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortOrder === 'az') return a.topic_name.localeCompare(b.topic_name);
    if (sortOrder === 'za') return b.topic_name.localeCompare(a.topic_name);
    return 0; // Default order
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 py-6 px-4 md:py-10 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-3">
            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Explore</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Topics
            </span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base">
            Discover diverse perspectives on current topics with balanced viewpoints from multiple sources and experts
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto opacity-75"></div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md mb-8 p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 w-full rounded-lg border-gray-200 border py-2 px-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 text-sm"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              className="rounded-lg border-gray-200 border py-2 px-3 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Sort by: Default</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex space-x-2">
              <div className="h-3 w-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-3 w-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="h-3 w-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mx-auto max-w-md shadow flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredTopics.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mx-auto max-w-md text-center">
            <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No topics found</h3>
            {searchTerm ? (
              <p className="text-gray-600 text-sm">No results match your search. Try different keywords.</p>
            ) : (
              <p className="text-gray-600 text-sm">No topics available at the moment. Please check back later.</p>
            )}
            {searchTerm && (
              <button 
                className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-800 focus:outline-none"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
            )}
          </div>
        )}
        
        {/* Topics Grid */}
        {!loading && !error && sortedTopics.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{sortedTopics.length}</span> {sortedTopics.length === 1 ? 'topic' : 'topics'}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedTopics.map((topic, index) => (
                <div 
                  key={topic.topic_id || `topic-${index}`} 
                  className="transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                  style={{ 
                    animation: 'fadeInUp 0.5s ease-out forwards', 
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <TopicCard 
                    topicId={topic.topic_id} 
                    title={topic.topic_name} 
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="mt-16 text-center text-xs text-gray-500">
        <p>Updated regularly with trending topics and balanced perspectives</p>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;