import axiosInstance from "./axiosInstance";
import { endpoints } from "./httpEndpoints";
import { httpMethods } from "./httpMethods";

export const getAllReflections = async () => {
  try {
    const response = await axiosInstance[httpMethods.GET](
      endpoints.reflections.getAll
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReflection = async (reflectionData) => {
  try {
    const response = await axiosInstance[httpMethods.POST](
      endpoints.reflections.create,
      reflectionData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPromptState = async () => {
  try {
    const response = await axiosInstance[httpMethods.GET](
      endpoints.reflections.promptState
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePromptState = async (stateData) => {
  try {
    const response = await axiosInstance[httpMethods.PUT](
      endpoints.reflections.promptState,
      stateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReflection = async (id) => {
  try {
    const response = await axiosInstance[httpMethods.DELETE](
      endpoints.reflections.delete(id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReflection = async (id, updateData) => {
  try {
    const response = await axiosInstance[httpMethods.PUT](
      endpoints.reflections.update(id),
      updateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReflectionsByQuestionId = async (questionId) => {
  try {
    const response = await axiosInstance[httpMethods.GET](
      `${endpoints.reflections.getAll}?questionId=${questionId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReflectionAnalytics = async () => {
  try {
    const response = await axiosInstance[httpMethods.GET](
      `${endpoints.reflections.getAll}/trade-log`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Draft management functions for better user experience
export const saveDraft = (userId, groupIndex, promptIndex, content) => {
  const draftKey = `reflection_draft_${userId}_${groupIndex}_${promptIndex}`;
  if (content.trim()) {
    localStorage.setItem(draftKey, content);
  } else {
    localStorage.removeItem(draftKey);
  }
};

export const getDraft = (userId, groupIndex, promptIndex) => {
  const draftKey = `reflection_draft_${userId}_${groupIndex}_${promptIndex}`;
  return localStorage.getItem(draftKey) || "";
};

export const clearDraft = (userId, groupIndex, promptIndex) => {
  const draftKey = `reflection_draft_${userId}_${groupIndex}_${promptIndex}`;
  localStorage.removeItem(draftKey);
};

export const clearAllUserDrafts = (userId) => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith(`reflection_draft_${userId}_`)) {
      localStorage.removeItem(key);
    }
  });
};
