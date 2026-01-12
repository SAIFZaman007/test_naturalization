import React, { createContext, useContext } from 'react';

const TradeContext = createContext();

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider = ({ children }) => {
  const value = {};

  return (
    <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
  );
};
