import {
  getPromptById,
  groupNames,
  reflectionPrompts,
} from '../data/reflectionPrompts';

/**
 * Groups reflections by question ID for analytics
 * @param {Array} reflections - Array of reflection objects
 * @returns {Object} - Grouped reflections by question ID
 */
export const groupReflectionsByQuestionId = (reflections) => {
  const grouped = {};

  reflections.forEach((reflection) => {
    const questionId = reflection.questionId || 'unknown';
    if (!grouped[questionId]) {
      grouped[questionId] = {
        questionId,
        questionData: getPromptById(questionId),
        responses: [],
      };
    }
    grouped[questionId].responses.push(reflection);
  });

  return grouped;
};

/**
 * Gets reflection statistics by question
 * @param {Array} reflections - Array of reflection objects
 * @returns {Object} - Statistics object
 */
export const getReflectionStats = (reflections) => {
  const stats = {
    totalReflections: reflections.length,
    questionCoverage: {},
    groupCoverage: {},
    responseFrequency: {},
    recentActivity: [],
  };

  // Group coverage
  groupNames.forEach((groupName) => {
    stats.groupCoverage[groupName] = {
      total: 0,
      questions: [],
    };
  });

  // Process each reflection
  reflections.forEach((reflection) => {
    const questionId = reflection.questionId;
    const group = reflection.group;

    // Question coverage
    if (questionId) {
      if (!stats.questionCoverage[questionId]) {
        stats.questionCoverage[questionId] = {
          questionId,
          questionData: getPromptById(questionId),
          count: 0,
          lastAnswered: null,
        };
      }
      stats.questionCoverage[questionId].count++;
      stats.questionCoverage[questionId].lastAnswered = reflection.date;
    }

    // Group coverage
    if (group && stats.groupCoverage[group]) {
      stats.groupCoverage[group].total++;
      if (
        questionId &&
        !stats.groupCoverage[group].questions.includes(questionId)
      ) {
        stats.groupCoverage[group].questions.push(questionId);
      }
    }

    // Response frequency (by date)
    const dateKey = reflection.date ? reflection.date.split(',')[0] : 'unknown';
    stats.responseFrequency[dateKey] =
      (stats.responseFrequency[dateKey] || 0) + 1;
  });

  // Recent activity (last 10 reflections)
  stats.recentActivity = reflections
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .map((reflection) => ({
      id: reflection.id,
      questionId: reflection.questionId,
      questionText: reflection.prompt,
      group: reflection.group,
      date: reflection.date,
      answerPreview: reflection.answer
        ? reflection.answer.substring(0, 100) + '...'
        : '',
    }));

  return stats;
};

/**
 * Validates question-answer linking integrity
 * @param {Array} reflections - Array of reflection objects
 * @returns {Object} - Validation results
 */
export const validateReflectionIntegrity = (reflections) => {
  const results = {
    total: reflections.length,
    withQuestionId: 0,
    withoutQuestionId: 0,
    validQuestionIds: 0,
    invalidQuestionIds: 0,
    issues: [],
  };

  reflections.forEach((reflection, index) => {
    if (reflection.questionId) {
      results.withQuestionId++;
      const questionData = getPromptById(reflection.questionId);
      if (questionData) {
        results.validQuestionIds++;
        // Check if stored prompt text matches the question ID
        if (reflection.prompt !== questionData.text) {
          results.issues.push({
            reflectionId: reflection.id || index,
            type: 'PROMPT_MISMATCH',
            message: `Stored prompt text doesn't match question ID: ${reflection.questionId}`,
            stored: reflection.prompt,
            expected: questionData.text,
          });
        }
      } else {
        results.invalidQuestionIds++;
        results.issues.push({
          reflectionId: reflection.id || index,
          type: 'INVALID_QUESTION_ID',
          message: `Question ID not found: ${reflection.questionId}`,
        });
      }
    } else {
      results.withoutQuestionId++;
      results.issues.push({
        reflectionId: reflection.id || index,
        type: 'MISSING_QUESTION_ID',
        message: 'Reflection missing question ID for proper linking',
      });
    }
  });

  return results;
};

/**
 * Migrates old reflections to include question IDs (helper for data migration)
 * @param {Array} reflections - Array of reflection objects without question IDs
 * @returns {Array} - Updated reflections with question IDs where possible
 */
export const migrateReflectionsWithQuestionIds = (reflections) => {
  return reflections.map((reflection) => {
    if (reflection.questionId) {
      return reflection; // Already has question ID
    }

    // Try to find matching question ID by prompt text
    for (const groupName of groupNames) {
      const group = reflectionPrompts[groupName];
      const matchingPrompt = group.find((p) => p.text === reflection.prompt);
      if (matchingPrompt) {
        return {
          ...reflection,
          questionId: matchingPrompt.id,
        };
      }
    }

    // No match found, keep original
    return reflection;
  });
};
