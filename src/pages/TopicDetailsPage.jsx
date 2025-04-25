import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopicDetails } from '../services/api';
import ArticleItem from '../components/ArticleItem'; // Import the ArticleItem component

function TopicDetailsPage() {
  const { topicId } = useParams(); // Get topicId from URL parameter
  const [topicDetails, setTopicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedArticles, setCompletedArticles] = useState(new Set()); // Track completed articles locally for immediate UI update

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTopicDetails(topicId);
        // Assuming data structure: { topic_id, topic_name, brief, perspective, related_articles: [{ article_id, article_name, URL, is_read (optional) }, ...] }
        setTopicDetails(data);
         // Optional: Initialize completedArticles based on is_read status from backend if available
         if (data?.related_articles) {
            const initialCompleted = new Set();
            data.related_articles.forEach(article => {
                if (article.is_read) { // Assuming backend provides 'is_read' boolean
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
  }, [topicId]); // Re-run effect if topicId changes

  // Function to be passed down to ArticleItem to update local state
  const handleArticleCompleted = (articleId) => {
      setCompletedArticles(prev => new Set(prev).add(articleId));
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading topic details...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!topicDetails) return <p className="text-center text-gray-500 mt-10">Topic details not found.</p>;

  return (
    <div className="space-y-8">
       <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>

      <h2 className="text-3xl font-bold text-gray-800">{topicDetails.topic_name || `Topic ${topicId}`}</h2>

      {/* Brief Section */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Brief</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{topicDetails.brief || 'No brief available.'}</p>
      </section>

      {/* Perspective Section */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Perspective</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{topicDetails.perspective || 'No perspective available.'}</p>
      </section>

      {/* Related Articles Section */}
      <section className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Related Articles</h3>
        {topicDetails.related_articles && topicDetails.related_articles.length > 0 ? (
          <ul className="space-y-3">
            {topicDetails.related_articles.map((article) => (
              <ArticleItem
                key={article.article_id}
                articleId={article.article_id}
                articleName={article.article_name}
                articleUrl={article.URL}
                isCompleted={completedArticles.has(article.article_id)} // Pass completion status
                onComplete={handleArticleCompleted} // Pass handler function
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No related articles found for this topic.</p>
        )}
      </section>
    </div>
  );
}

export default TopicDetailsPage;