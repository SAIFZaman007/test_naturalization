import React, { useState, useEffect } from 'react';
import { getAllReflections } from '../../api/reflectionService';
import {
  validateReflectionIntegrity,
  getReflectionStats,
} from '../../utils/reflectionAnalytics';
import { useAuth } from '../../hooks/useAuth';

const ReflectionIntegrityChecker = ({ isVisible = false }) => {
  const [validationResults, setValidationResults] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const runValidation = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await getAllReflections();
      if (response.success && response.data) {
        const validation = validateReflectionIntegrity(response.data);
        const statistics = getReflectionStats(response.data);

        setValidationResults(validation);
        setStats(statistics);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const performValidation = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await getAllReflections();
        if (response.success && response.data) {
          const validation = validateReflectionIntegrity(response.data);
          const statistics = getReflectionStats(response.data);

          setValidationResults(validation);
          setStats(statistics);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible && user) {
      performValidation();
    }
  }, [isVisible, user]);

  if (!isVisible) return null;

  return (
    <div className='w-full mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className="text-white text-lg font-semibold font-['Poppins']">
          Reflection Data Integrity Check
        </h3>
        <button
          onClick={runValidation}
          disabled={isLoading}
          className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm'
        >
          {isLoading ? 'Checking...' : 'Run Check'}
        </button>
      </div>

      {validationResults && (
        <div className='space-y-4'>
          {/* Summary Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-slate-700 p-3 rounded'>
              <div className='text-white text-xl font-bold'>
                {validationResults.total}
              </div>
              <div className='text-slate-300 text-sm'>Total Reflections</div>
            </div>
            <div className='bg-green-700 p-3 rounded'>
              <div className='text-white text-xl font-bold'>
                {validationResults.validQuestionIds}
              </div>
              <div className='text-slate-300 text-sm'>Valid Links</div>
            </div>
            <div className='bg-yellow-600 p-3 rounded'>
              <div className='text-white text-xl font-bold'>
                {validationResults.withoutQuestionId}
              </div>
              <div className='text-slate-300 text-sm'>Missing IDs</div>
            </div>
            <div className='bg-red-600 p-3 rounded'>
              <div className='text-white text-xl font-bold'>
                {validationResults.invalidQuestionIds}
              </div>
              <div className='text-slate-300 text-sm'>Invalid IDs</div>
            </div>
          </div>

          {/* Issues List */}
          {validationResults.issues.length > 0 && (
            <div>
              <h4 className="text-white text-md font-medium font-['Poppins'] mb-2">
                Issues Found ({validationResults.issues.length})
              </h4>
              <div className='max-h-60 overflow-y-auto space-y-2'>
                {validationResults.issues.map((issue, index) => (
                  <div key={index} className='bg-slate-700 p-3 rounded text-sm'>
                    <div className='text-red-400 font-semibold'>
                      {issue.type}
                    </div>
                    <div className='text-slate-300'>{issue.message}</div>
                    {issue.stored && (
                      <div className='text-slate-400 text-xs mt-1'>
                        Stored: "{issue.stored.substring(0, 50)}..."
                      </div>
                    )}
                    {issue.expected && (
                      <div className='text-slate-400 text-xs'>
                        Expected: "{issue.expected.substring(0, 50)}..."
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Overview */}
          {stats && (
            <div>
              <h4 className="text-white text-md font-medium font-['Poppins'] mb-2">
                Question Coverage
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(stats.groupCoverage).map(([group, data]) => (
                  <div key={group} className='bg-slate-700 p-3 rounded'>
                    <div className='text-white font-semibold text-sm'>
                      {group}
                    </div>
                    <div className='text-slate-300 text-xs'>
                      {data.total} reflections, {data.questions.length} unique
                      questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReflectionIntegrityChecker;
