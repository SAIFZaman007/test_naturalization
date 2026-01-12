import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../../../../api/axiosInstance';

export default function Details({ isOpen, onClose, lessonData, }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch lesson details when modal opens
  useEffect(() => {
    if (!isOpen || !lessonData?.id) {
      setLesson(null);
      return;
    }

    const fetchLessonDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/lessons/${lessonData.id}`);
        setLesson(response.data);
      } catch (err) {
        console.error('Failed to fetch lesson details:', err);
        setError('Failed to load lesson details');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetails();
  }, [isOpen, lessonData?.id]);

  if (!isOpen) return null;

  return (
    // 1. Overlay (Backdrop)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 id="lesson-title" className="text-red-700 text-xl font-extrabold tracking-tight">
            Lesson Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-300 focus:outline-none focus:ring-2 rounded-full p-1"
            aria-label="Close lesson details"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-gray-600">Loading lesson details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && lesson && (
            <>
              {/* Image */}
              {lesson.image_url && (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={lesson.image_url}
                    alt={lesson.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Lesson Name */}
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{lesson.name}</h1>
              
              {/* Description */}
              {lesson.description && (
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{lesson.description}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{lesson.total_questions || 0}</p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{lesson.total_right_answers || 0}</p>
                  <p className="text-sm text-gray-600">Right Answers</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{lesson.my_progress || 0}%</p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Questions */}
              {lesson.questions && lesson.questions.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Questions ({lesson.questions.length})</h3>
                  <div className="space-y-4">
                    {lesson.questions.map((question, idx) => (
                      <div key={question.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-800 flex-1">
                            {idx + 1}. {question.name}
                          </h4>
                          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                            question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {question.difficulty}
                          </span>
                        </div>
                        
                        {/* Options */}
                        <div className="space-y-2 mb-3">
                          {question.options?.map((option, optIdx) => (
                            <div 
                              key={optIdx} 
                              className={`p-3 rounded-md border ${
                                option === question.correct_answer 
                                  ? 'bg-green-50 border-green-300 font-medium text-green-800'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              <span className="mr-2 font-semibold">{String.fromCharCode(65 + optIdx)}.</span>
                              {option}
                              {option === question.correct_answer && (
                                <span className="ml-2 text-green-600">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}