import React, { useState, useEffect } from 'react';
import FeedbackButton from '../../components/common/FeedbackButton';
import { reflectionPrompts, groupNames } from '../../data/reflectionPrompts';
import {
  getAllReflections,
  createReflection,
  getPromptState,
  updatePromptState,
  getDraft,
  saveDraft,
  clearDraft,
} from '../../api/reflectionService';
import { useAuth } from '../../hooks/useAuth';

const Reflections = () => {
  const [reflection, setReflection] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentGroup, setCurrentGroup] = useState('');
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftKey, setDraftKey] = useState(''); // Key for current draft
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const { user } = useAuth();

  // Load reflections from API
  const [pastReflections, setPastReflections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [rotationState, setRotationState] = useState({
    currentGroupIndex: 0,
    promptIndexes: [0, 0, 0, 0], // Track which prompt we're on in each group
    lastRefreshedGroup: null, // Track if user refreshed current group
  });

  // Load rotation state from server (NO localStorage fallback for account sync)
  useEffect(() => {
    const loadRotationState = async () => {
      try {
        if (user) {
          const response = await getPromptState();
          if (response.success && response.data) {
            setRotationState(response.data);
          }
          // If no server data, keep default state (starts fresh for user)
        }
      } catch (error) {
        // NO localStorage fallback - ensures all data is tied to user account
      }
    };

    loadRotationState();
  }, [user]);

  // Get current prompt based on rotation state and load draft
  useEffect(() => {
    const groupIndex = rotationState.currentGroupIndex;
    const groupName = groupNames[groupIndex];
    const promptIndex = rotationState.promptIndexes[groupIndex];
    const promptData = reflectionPrompts[groupName][promptIndex];

    setCurrentPrompt(promptData);
    setCurrentGroup(groupName);

    // Generate unique draft key for this user and prompt combination
    if (user && promptData) {
      const newDraftKey = `reflection_draft_${user.id}_${groupIndex}_${promptIndex}`;
      setDraftKey(newDraftKey);

      // Load saved draft for this specific prompt
      const savedDraft = getDraft(user.id, groupIndex, promptIndex);
      setReflection(savedDraft);
    }
  }, [rotationState, user]);

  // Save rotation state to server (account-tied, no localStorage)
  const saveRotationState = async (newState) => {
    try {
      if (user) {
        await updatePromptState(newState);
      }
    } catch (error) {
      // NO localStorage fallback - ensures data stays tied to account
    }
  };

  // Auto-save draft reflections
  useEffect(() => {
    if (!draftKey || !user) return;

    const groupIndex = rotationState.currentGroupIndex;
    const promptIndex = rotationState.promptIndexes[groupIndex];

    if (
      groupIndex === undefined ||
      promptIndex === undefined ||
      Number.isNaN(promptIndex)
    ) {
      return;
    }

    if (!reflection.trim()) {
      clearDraft(user.id, groupIndex, promptIndex);
      return;
    }

    const autoSaveTimer = setTimeout(() => {
      setIsAutoSaving(true);
      saveDraft(user.id, groupIndex, promptIndex, reflection);

      // Show auto-save indicator briefly
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 2000); // Auto-save after 2 seconds of no typing

    return () => clearTimeout(autoSaveTimer);
  }, [
    reflection,
    draftKey,
    rotationState.currentGroupIndex,
    rotationState.promptIndexes,
    user,
  ]);

  // Fetch reflections from API on component mount
  useEffect(() => {
    const fetchReflections = async () => {
      try {
        setIsLoading(true);
        const response = await getAllReflections();

        if (response.success) {
          setPastReflections(response.data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if user exists
    if (user) {
      fetchReflections();
    }
  }, [user]);

  // Cleanup effect - save current draft before unmounting
  useEffect(() => {
    return () => {
      if (user && reflection.trim()) {
        const groupIndex = rotationState.currentGroupIndex;
        const promptIndex = rotationState.promptIndexes[groupIndex];
        saveDraft(user.id, groupIndex, promptIndex, reflection);
      }
    };
  }, [
    user,
    reflection,
    rotationState.currentGroupIndex,
    rotationState.promptIndexes,
  ]);

  const handleRefreshPrompt = async () => {
    // Save current draft before switching prompts
    if (user && reflection.trim()) {
      const groupIndex = rotationState.currentGroupIndex;
      const promptIndex = rotationState.promptIndexes[groupIndex];
      saveDraft(user.id, groupIndex, promptIndex, reflection);
    }

    const currentGroupIndex = rotationState.currentGroupIndex;
    const currentPromptIndex = rotationState.promptIndexes[currentGroupIndex];
    const totalPromptsInGroup =
      reflectionPrompts[groupNames[currentGroupIndex]].length;

    // For refresh: try to get a different prompt from the same group first
    // If no more prompts in current group available, move to next group
    const nextPromptInGroup = (currentPromptIndex + 1) % totalPromptsInGroup;

    let newState;
    if (nextPromptInGroup !== 0 && nextPromptInGroup !== currentPromptIndex) {
      // There are more unused prompts in current group, show next prompt in same group
      const newPromptIndexes = [...rotationState.promptIndexes];
      newPromptIndexes[currentGroupIndex] = nextPromptInGroup;

      newState = {
        ...rotationState,
        promptIndexes: newPromptIndexes,
        lastRefreshedGroup: currentGroupIndex,
      };
    } else {
      // No more unused prompts in current group, move to next group
      const nextGroupIndex = (currentGroupIndex + 1) % groupNames.length;

      newState = {
        ...rotationState,
        currentGroupIndex: nextGroupIndex,
        lastRefreshedGroup: null,
      };
    }

    setRotationState(newState);
    await saveRotationState(newState);
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      // Create new reflection data with proper question ID linking
      const now = new Date();
      const reflectionData = {
        // Human-friendly date for display (kept for backward compatibility)
        date: now.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        // ISO timestamp used for reliable sorting / analytics
        createdAt: now.toISOString(),
        questionId: currentPrompt.id, // Store unique question ID for proper linking
        prompt: currentPrompt.text, // Store the question text for display
        group: currentGroup,
        answer: reflection,
      };

      // Save to API
      const response = await createReflection(reflectionData);

      if (response.success) {
        // Add to local state immediately for better UX
        setPastReflections([response.data, ...pastReflections]);

        // CORRECT ROTATION LOGIC:
        // After saving, move to the NEXT GROUP (not next prompt in same group)
        // The prompt index in current group advances only when all groups complete a cycle

        const currentGroupIndex = rotationState.currentGroupIndex;
        const nextGroupIndex = (currentGroupIndex + 1) % groupNames.length;

        // If we've completed all 4 groups (back to group 0), advance all prompt indexes
        let newPromptIndexes = [...rotationState.promptIndexes];
        if (nextGroupIndex === 0) {
          // Completed full cycle, advance to next prompt in each group
          newPromptIndexes = newPromptIndexes.map((promptIndex, groupIndex) => {
            const totalPromptsInGroup =
              reflectionPrompts[groupNames[groupIndex]].length;
            return (promptIndex + 1) % totalPromptsInGroup;
          });
        }

        const newState = {
          currentGroupIndex: nextGroupIndex,
          promptIndexes: newPromptIndexes,
          lastRefreshedGroup: null, // Reset refresh state
        };

        setRotationState(newState);
        await saveRotationState(newState);

        // Clear reflection input and remove draft
        setReflection('');
        const groupIndex = rotationState.currentGroupIndex;
        const promptIndex = rotationState.promptIndexes[groupIndex];
        clearDraft(user.id, groupIndex, promptIndex);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedReflection(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReflection(null);
  };

  return (
    <div className='flex flex-col xl:flex-row gap-6 w-full lg:py-2.5 py-2'>
      {/* Left Section - Reflection Input */}
      <div
        className='xl:w-[75%] xl:h-[680px] w-full h-auto rounded-2xl flex flex-col justify-start lg:items-start gap-2.5 relative backdrop-blur-xl'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          boxShadow:
            '0px 8px 32px 0px rgba(0, 0, 0, 0.6), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Inner Bottom and Left Border */}
        <div
          className='absolute inset-0 rounded-2xl pointer-events-none'
          style={{
            background: `
              linear-gradient(to right, rgba(158, 79, 199, 0.15), transparent 50%),
              linear-gradient(to top, rgba(92, 46, 212, 0.15), transparent 50%)
            `,
            backgroundPosition: 'left, bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '2px 100%, 100% 2px',
          }}
        />
        <div className='relative z-10 w-full h-full px-6 pt-6 pb-6 flex flex-col justify-start items-start gap-2.5'>
          <div className='self-stretch flex flex-col justify-start items-start gap-5'>
            {/* Header */}
            <div className='w-full flex flex-col justify-start items-start gap-4'>
              <div className="justify-start text-white text-2xl font-semibold font-['Poppins'] leading-loose">
                Reflections
              </div>
              <div className="self-stretch justify-start text-white text-base font-normal font-['Poppins'] leading-relaxed">
                Reflect on the mind behind the market.
              </div>
            </div>

            {/* Content */}
            <div className='self-stretch flex flex-col justify-start items-start gap-5'>
              {/* Category Badge and Progress */}
              <div className='flex flex-col gap-3 w-full'>
                <div className='flex items-center gap-3'>
                  <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full border border-purple-400/30'>
                    <div className="text-purple-200 text-xs font-semibold font-['Poppins'] uppercase tracking-wider">
                      {currentGroup}
                    </div>
                  </div>
                  <div className="text-zinc-500 text-xs font-normal font-['Poppins']">
                    Round {Math.max(...rotationState.promptIndexes) + 1} • Group{' '}
                    {rotationState.currentGroupIndex + 1}/4
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='w-full bg-zinc-800 rounded-full h-1.5'>
                  <div
                    className='bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500'
                    style={{
                      width: `${
                        ((rotationState.currentGroupIndex + 1) / 4) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                  <div className="justify-start text-zinc-400 text-base font-medium font-['Poppins'] leading-normal">
                    Daily Prompt
                  </div>
                  {reflection && (
                    <div className='flex items-center gap-1 px-2 py-1 bg-blue-600/20 rounded-full border border-blue-400/30'>
                      <div className='w-1.5 h-1.5 bg-blue-400 rounded-full'></div>
                      <span className="text-blue-400 text-xs font-medium font-['Poppins']">
                        Draft saved
                      </span>
                    </div>
                  )}
                </div>
                <div className="justify-start text-zinc-600 text-sm font-normal font-['Poppins'] leading-relaxed">
                  Each reflection moves you through 4 focus areas. Complete all
                  groups to advance to the next round of prompts.
                </div>
              </div>

              {/* Prompt Display */}
              <div className='self-stretch min-h-[60px] p-4 bg-zinc-800 rounded border border-white/10 flex justify-start items-center'>
                <div className="justify-start text-white text-sm font-normal font-['Poppins'] leading-relaxed">
                  {currentPrompt?.text || currentPrompt}
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefreshPrompt}
                className='h-10 px-4 py-2.5 bg-neutral-600 rounded border border-white/10 flex justify-start items-center gap-2 hover:bg-neutral-500 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C9.17841 14 10.2784 13.6515 11.2 13.05M14 8L11.5 5.5M14 8L11.5 10.5'
                    stroke='#d1d5db'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <div className="justify-start text-stone-300 text-sm font-normal font-['Poppins'] leading-tight tracking-tight">
                  {(() => {
                    const currentPromptIndex =
                      rotationState.promptIndexes[
                        rotationState.currentGroupIndex
                      ];
                    const totalPromptsInGroup =
                      reflectionPrompts[
                        groupNames[rotationState.currentGroupIndex]
                      ]?.length || 0;
                    const hasMoreInGroup =
                      (currentPromptIndex + 1) % totalPromptsInGroup !== 0;

                    return hasMoreInGroup
                      ? 'Next Prompt in Group'
                      : 'Next Group';
                  })()}
                </div>
              </button>

              {/* Reflection Input and Save Button */}
              <div className='self-stretch flex flex-col justify-start items-start gap-6'>
                {/* Text Area with Auto-save indicator */}
                <div className='self-stretch flex flex-col gap-2'>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder='Write your reflection here...'
                    className="self-stretch min-h-[140px] p-4 bg-stone-900 rounded border border-white/10 text-white text-sm font-normal font-['Poppins'] leading-relaxed placeholder:text-zinc-500 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />

                  {/* Auto-save indicator */}
                  {reflection.trim() && (
                    <div className='flex items-center gap-2 text-xs'>
                      {isAutoSaving ? (
                        <>
                          <div className='w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin'></div>
                          <span className="text-purple-400 font-['Poppins']">
                            Saving draft...
                          </span>
                        </>
                      ) : (
                        <>
                          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                          <span className="text-green-400 font-['Poppins']">
                            Draft saved
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Improvement Prompt Text and Save Button - Responsive Layout */}
                <div className='self-stretch flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
                  <div className="flex-1 text-purple-300 text-sm sm:text-base font-medium font-['Poppins'] leading-relaxed tracking-wide">
                    For your improvement, please write your reflections in
                    extensive detail
                  </div>

                  <button
                    onClick={handleSaveReflection}
                    disabled={!reflection.trim() || isLoading}
                    className={`px-6 py-3 rounded-lg flex justify-center items-center gap-2 transition-opacity cursor-pointer w-full sm:w-auto sm:flex-shrink-0 ${
                      !reflection.trim() || isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                    style={{
                      background:
                        'linear-gradient(89deg, #A33076 -2.62%, #353689 103.6%)',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                        <div className="text-center text-white text-base font-semibold font-['Poppins'] leading-normal whitespace-nowrap">
                          Saving...
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-white text-base font-semibold font-['Poppins'] leading-normal whitespace-nowrap">
                        Save Reflection
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Past Reflections */}
      <div
        className='xl:w-[40%] xl:h-[680px] h-[680px] rounded-2xl flex flex-col justify-start items-start gap-2.5 relative  backdrop-blur-xl'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
          boxShadow:
            '0px 8px 32px 0px rgba(0, 0, 0, 0.6), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Inner Bottom and Left Border */}
        <div
          className='absolute inset-0 rounded-2xl pointer-events-none'
          style={{
            background: `
              linear-gradient(to right, rgba(158, 79, 199, 0.15), transparent 50%),
              linear-gradient(to top, rgba(92, 46, 212, 0.15), transparent 50%)
            `,
            backgroundPosition: 'left, bottom',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '2px 100%, 100% 2px',
          }}
        />
        <div className='relative z-10 w-full h-full px-6 pt-6 pb-10 flex flex-col justify-start items-start gap-2.5'>
          <div className='w-full flex flex-col justify-start items-start gap-6'>
            <div className="self-stretch justify-start text-white text-base font-medium font-['Poppins'] leading-relaxed">
              Review Past Reflections
            </div>

            <div className='self-stretch flex justify-end items-start gap-1 relative'>
              {/* Scrollable Reflections List */}
              <div className='flex-1 max-h-[560px] flex flex-col justify-start items-start gap-4 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 '>
                {pastReflections.length === 0 ? (
                  <div className='w-full py-8 flex items-center justify-center'>
                    <div className="text-zinc-500 text-sm text-center font-['Poppins']">
                      No reflections yet.
                      <br />
                      Start journaling your thoughts!
                    </div>
                  </div>
                ) : (
                  pastReflections.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenModal(item)}
                      className='self-stretch w-full p-3 bg-neutral-700/50 backdrop-blur-sm rounded-lg flex flex-col justify-start items-start gap-2 cursor-pointer hover:bg-neutral-600/60 transition-all duration-300 flex-shrink-0 border border-white/5 hover:border-white/10 hover:shadow-lg'
                    >
                      <div className='flex items-center gap-2 mb-1'>
                        <div className='px-2 py-0.5 bg-purple-600/30 rounded text-purple-300 text-[10px] font-semibold font-["Poppins"] uppercase tracking-wide'>
                          {item.group}
                        </div>
                      </div>
                      <div className="self-stretch justify-start text-zinc-300 text-xs font-normal font-['Poppins']">
                        {item.date}
                      </div>
                      <div className="self-stretch justify-start text-zinc-400 text-xs font-normal font-['Poppins'] leading-tight tracking-tight italic break-words overflow-wrap-anywhere">
                        "{item.prompt}"
                      </div>
                      <div className="self-stretch justify-start text-white text-sm font-normal font-['Poppins'] leading-relaxed mt-1 break-words overflow-wrap-anywhere line-clamp-3">
                        {item.answer}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <FeedbackButton />

      {/* Modal for viewing full reflection */}
      {isModalOpen && selectedReflection && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'
          onClick={handleCloseModal}
        >
          <div
            className='relative w-full max-w-2xl mx-4 rounded-2xl backdrop-blur-xl'
            style={{
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              boxShadow:
                '0px 8px 32px 0px rgba(0, 0, 0, 0.8), inset 0px 1px 1px 0px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-white/10'>
              <div className='flex items-center gap-3'>
                <div className='px-3 py-1 bg-purple-600/30 rounded-full text-purple-300 text-xs font-semibold font-["Poppins"] uppercase tracking-wide'>
                  {selectedReflection.group}
                </div>
                <div className="text-zinc-300 text-sm font-normal font-['Poppins']">
                  {selectedReflection.date}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors'
              >
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className='p-6 max-h-[70vh] overflow-y-auto custom-scrollbar'>
              <div className='flex flex-col gap-4'>
                {/* Prompt */}
                <div>
                  <div className="text-zinc-400 text-sm font-medium font-['Poppins'] mb-2">
                    Prompt
                  </div>
                  <div className="text-zinc-300 text-base font-normal font-['Poppins'] leading-relaxed italic break-words">
                    "{selectedReflection.prompt}"
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <div className="text-zinc-400 text-sm font-medium font-['Poppins'] mb-2">
                    Your Reflection
                  </div>
                  <div className="text-white text-base font-normal font-['Poppins'] leading-relaxed break-words whitespace-pre-wrap">
                    {selectedReflection.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Reflections;
