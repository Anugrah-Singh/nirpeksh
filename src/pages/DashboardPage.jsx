import React, { useState, useEffect } from 'react';
import { getTopics } from '../services/api';
import TopicCard from '../components/TopicCard'; // Import the TopicCard component

function DashboardPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTopics();
        // Assuming data is an array like [{ topic_id: 1, topic_name: 'Politics Today', ... }, ...]
        setTopics(data || []); // Handle case where API might return null/undefined
      } catch (err) {
        setError('Failed to fetch topics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Topics Dashboard</h2>
      {loading && <p className="text-center text-gray-500">Loading topics...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && topics.length === 0 && (
        <p className="text-center text-gray-500">No topics available at the moment.</p>
      )}
      {!loading && !error && topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            // Pass the necessary topic data to TopicCard
            <TopicCard key={topic.topic_id} topicId={topic.topic_id} title={topic.topic_name} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;