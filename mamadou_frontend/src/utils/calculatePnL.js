const POINT_VALUES = {
  NQ: 20,
  YM: 5,
  ES: 50,
  MNQ: 2,
  MYM: 0.5,
  MES: 5,
  GC: 10, // Gold futures: $10 per point
  MGC: 1, // Micro Gold futures: $1 per point
};

// Utility function to format numbers with commas
const formatNumberWithCommas = (number, decimalPlaces = 2) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0.00';
  }

  const num = Number(number);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

// Utility function to format input values with commas for display
const formatInputWithCommas = (value) => {
  if (!value || value === '') return '';

  // Remove any existing commas and non-numeric characters except decimal point
  const cleanValue = value.toString().replace(/[^0-9.]/g, '');

  // Handle empty or invalid input
  if (!cleanValue || cleanValue === '.') return cleanValue;

  // Split by decimal point
  const parts = cleanValue.split('.');

  // Handle case where we just have a decimal point
  if (parts[0] === '') return cleanValue;

  const integerPart = parseInt(parts[0]);
  if (isNaN(integerPart)) return cleanValue;

  // Format integer part with commas
  const formattedInteger = integerPart.toLocaleString('en-US');

  // If there's a decimal part, append it
  if (parts.length > 1) {
    return `${formattedInteger}.${parts[1]}`;
  }

  return formattedInteger;
};

// Utility function to clean formatted input back to number
const cleanFormattedInput = (value) => {
  if (!value) return '';
  return value.toString().replace(/[^0-9.]/g, '');
};

const calculatePnL = (entryPrice, exitPrice, quantity, direction, ticker) => {
  const entry = Number(entryPrice);
  const exit = Number(exitPrice);
  const qty = Number(quantity);

  const pointValue = POINT_VALUES[ticker?.toUpperCase()] || 20;

  let pointDifference = 0;
  let pnl = 0;

  if (direction === 'Long') {
    pointDifference = exit - entry;
  } else {
    pointDifference = entry - exit;
  }

  pnl = pointDifference * qty * pointValue;

  return {
    pnl: pnl,
    isProfitable: pnl >= 0,
  };
};

export {
  calculatePnL,
  POINT_VALUES,
  formatNumberWithCommas,
  formatInputWithCommas,
  cleanFormattedInput,
};
export default calculatePnL;
