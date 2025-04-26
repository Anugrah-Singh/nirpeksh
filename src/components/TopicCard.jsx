import React from 'react';
import { Link } from 'react-router-dom';

function TopicCard({ topicId, title }) {
  return (
    <Link
      to={`/get_topic/${topicId}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-teal-500 hover:-translate-y-1"
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight leading-tight max-w-[80%] line-clamp-2">
            {title || 'Untitled Topic'}
          </h3>
          
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full hidden sm:block">
            Topic
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-teal-50 to-white p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center bg-teal-600 text-white shadow-sm group-hover:bg-teal-700 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700 group-hover:text-teal-700 transition-colors duration-300">
                Compare viewpoints
              </p>
            </div>
            
            <div className="hidden sm:flex items-center text-gray-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Recently updated
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-teal-600 via-blue-500 to-teal-400"></div>
    </Link>
  );
}

export default TopicCard;