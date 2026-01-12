// Reflection prompts organized in 4 groups with 5 prompts each
// Each prompt now has a unique ID for proper question-answer linking
export const reflectionPrompts = {
  'Self Awareness & Emotions': [
    {
      id: 'se_emotions_trading',
      text: 'What emotions did you feel most while trading today?',
    },
    {
      id: 'se_patience_impulse',
      text: 'Were you patient or impulsive today?',
    },
    {
      id: 'se_reaction_trigger',
      text: 'What triggered your strongest reaction today?',
    },
    {
      id: 'se_over_under_trade',
      text: 'Did you overtrade or undertrade? Why?',
    },
    {
      id: 'se_fomo',
      text: 'Were you fearful of missing out?',
    },
  ],
  'Discipline & Process': [
    {
      id: 'dp_trading_plan',
      text: 'Did you stick to your trading plan?',
    },
    {
      id: 'dp_stop_loss',
      text: 'Did you respect your stop loss on every trade?',
    },
    {
      id: 'dp_journal_trades',
      text: 'Did you journal every trade without skipping today?',
    },
    {
      id: 'dp_position_sizing',
      text: 'Did you size correctly?',
    },
    {
      id: 'dp_rule_breaking',
      text: 'What rule did you bend or break today?',
    },
  ],
  'Performance & Improvement': [
    {
      id: 'pi_best_trade',
      text: 'What was your best trade today? Why?',
    },
    {
      id: 'pi_worst_trade',
      text: 'What was your worst trade today? Why?',
    },
    {
      id: 'pi_trade_influence',
      text: 'Did you let one trade affect the next?',
    },
    {
      id: 'pi_analysis_accuracy',
      text: 'Was your analysis accurate, regardless of outcome?',
    },
    {
      id: 'pi_setup_identification',
      text: 'Did you identify your setup correctly?',
    },
  ],
  'Mindset & Confidence': [
    {
      id: 'mc_confidence_doubt',
      text: 'Were you confident or doubtful when placing trades?',
    },
    {
      id: 'mc_trust_edge',
      text: 'Did you trust your edge today?',
    },
    {
      id: 'mc_fear_conviction',
      text: 'Did you act out of fear or conviction?',
    },
    {
      id: 'mc_chase_trades',
      text: 'Did you chase any trades?',
    },
    {
      id: 'mc_mental_capital',
      text: 'Did you protect your mental capital as much as your financial capital?',
    },
  ],
};

// Group names in order for rotation
export const groupNames = [
  'Self Awareness & Emotions',
  'Discipline & Process',
  'Performance & Improvement',
  'Mindset & Confidence',
];

// Helper function to get a prompt by its unique ID
export const getPromptById = (promptId) => {
  for (const groupName of groupNames) {
    const group = reflectionPrompts[groupName];
    const prompt = group.find((p) => p.id === promptId);
    if (prompt) {
      return {
        ...prompt,
        group: groupName,
      };
    }
  }
  return null;
};

// Helper function to get prompt by group and index (for backward compatibility)
export const getPromptByGroupAndIndex = (groupName, promptIndex) => {
  const group = reflectionPrompts[groupName];
  if (group && group[promptIndex]) {
    return {
      ...group[promptIndex],
      group: groupName,
    };
  }
  return null;
};
