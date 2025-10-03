import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import type { Rating } from '../types';

interface RatingSectionProps {
  cerId: number;
}

function RatingSection({ cerId }: RatingSectionProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadRatings();
  }, [cerId]);

  const loadRatings = async () => {
    try {
      const response = await apiService.getRatings(cerId);
      if (response.success && response.data) {
        const data = response.data as any;
        setRatings(data.ratings || []);
        setAverage(data.average || 0);
        setCount(data.count || 0);

        // Trouver l'évaluation de l'utilisateur actuel
        if (user) {
          const myRating = data.ratings?.find((r: Rating) => r.user_id === user.user_id);
          if (myRating) {
            setUserRating(myRating.rating);
            setUserReview(myRating.review || '');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error);
    }
  };

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      alert('Veuillez sélectionner une note');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.addRating(cerId, userRating, userReview || undefined);
      setShowReviewForm(false);
      await loadRatings();
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'ajout de l\'évaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onSelect?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onSelect && onSelect(star)}
            disabled={!interactive}
            className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
            style={{ color: star <= rating ? '#FFD700' : '#D1D5DB' }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Évaluations</h2>

      {/* Average Rating Display */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-[#2c3e50] mb-2">
            {average.toFixed(1)}
          </div>
          <div className="mb-2">
            {renderStars(Math.round(average))}
          </div>
          <div className="text-sm text-gray-600">
            {count} évaluation{count > 1 ? 's' : ''}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const starCount = ratings.filter(r => r.rating === star).length;
            const percentage = count > 0 ? (starCount / count) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-sm w-8">{star}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFD700]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{starCount}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Rating Form */}
      {isAuthenticated ? (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-[#2c3e50] mb-3">
            {userRating > 0 ? 'Votre évaluation' : 'Évaluer ce CER'}
          </h3>
          
          <div className="mb-4">
            {renderStars(userRating, true, setUserRating)}
          </div>

          {showReviewForm || userReview ? (
            <div>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Ajouter un avis (optionnel)..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRatingSubmit}
                  disabled={submitting || userRating === 0}
                  className="px-4 py-2 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition disabled:opacity-50"
                >
                  {submitting ? 'Envoi...' : userRating > 0 && ratings.find(r => r.user_id === user?.user_id) ? 'Mettre à jour' : 'Publier'}
                </button>
                {!userReview && (
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter un avis
            </button>
          )}
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Connectez-vous pour évaluer ce CER
          </p>
        </div>
      )}

      {/* Reviews List */}
      {ratings.filter(r => r.review).length > 0 && (
        <div>
          <h3 className="font-semibold text-[#2c3e50] mb-4">Avis des utilisateurs</h3>
          <div className="space-y-4">
            {ratings.filter(r => r.review).map((rating) => (
              <div key={rating.rating_id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#e6930a] flex items-center justify-center text-white font-bold">
                      {rating.first_name?.[0]}{rating.last_name?.[0]}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#2c3e50]">
                        {rating.first_name} {rating.last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(rating.created_at)}
                      </span>
                    </div>
                    <div className="mb-2">
                      {renderStars(rating.rating)}
                    </div>
                    {rating.review && (
                      <p className="text-gray-700">{rating.review}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RatingSection;
