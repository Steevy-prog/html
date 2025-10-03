import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import type { Comment } from '../types';

interface CommentsSectionProps {
  cerId: number;
}

function CommentsSection({ cerId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadComments();
  }, [cerId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(cerId);
      if (response.success && response.data) {
        setComments(response.data as Comment[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiService.addComment(cerId, newComment);
      if (response.success) {
        setNewComment('');
        await loadComments();
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Supprimer ce commentaire ?')) return;

    try {
      await apiService.deleteComment(commentId);
      await loadComments();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">
        Commentaires ({comments.length})
      </h2>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={4}
            disabled={submitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-[#e6930a] text-white rounded-lg font-semibold hover:bg-[#d98307] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Vous devez être connecté pour commenter.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Chargement des commentaires...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#e6930a] flex items-center justify-center text-white font-bold">
                    {comment.first_name?.[0]}{comment.last_name?.[0]}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-[#2c3e50]">
                        {comment.first_name} {comment.last_name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {user && user.user_id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.comment_id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Aucun commentaire pour le moment.</p>
          <p className="text-sm text-gray-500 mt-2">Soyez le premier à commenter !</p>
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
