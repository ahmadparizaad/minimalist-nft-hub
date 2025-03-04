
// This file would contain actual Web3 implementation in a production app
// For now, we'll use mock implementations

export const formatAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatPrice = (price: number, currency = 'USDC'): string => {
  return `${price.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${currency}`;
};

export const checkSufficientBalance = (
  balance: number,
  price: number
): boolean => {
  return balance >= price;
};

export const checkSufficientSFuel = (
  sFuelBalance: number,
  minimumRequired = 0.001
): boolean => {
  return sFuelBalance >= minimumRequired;
};
