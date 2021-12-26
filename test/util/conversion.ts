const DEFAULT_DECIMAL_POSITIONS = 18;

const produceStringOfZeros = (length: number) =>
  Array(length)
    .fill('0')
    .reduce((m, i) => `${m}${i}`, '');

/**
 * Given a float amount of token, returns a string with an integer adding 18 decimals
 * This is necessary because 18 digit integers overflows JavaScript's number type
 * Learn more here: https://gwei.io/
 * @example Given 1.5, returns 1500000000000000000
 */
export const toWei = (amount: number, decimalPositions = DEFAULT_DECIMAL_POSITIONS) => {
  const integer = Math.floor(amount);
  const decimals = amount - integer;
  const decimalsString = `${decimals}`.replace('0.', '');
  return `${integer}${decimalsString}${produceStringOfZeros(decimalPositions - decimalsString.length)}`;
};
