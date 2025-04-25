import React from 'react';
import { Link } from 'react-router-dom';

// Receives topicId and title as props from DashboardPage
function TopicCard({ topicId, title }) {
  return (
    <Link
      to={`/topic/${topicId}`} // Link to the specific topic details page
      className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-900 mb-2">{title || 'Untitled Topic'}</h3>
      {/* You could add a short description or tags here later if needed */}
      <p className="text-sm text-gray-500">Click to view details and related articles</p>
    </Link>
  );
}

export default TopicCard;