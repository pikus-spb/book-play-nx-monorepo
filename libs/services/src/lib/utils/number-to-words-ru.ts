import convertNumberToWords from 'number-to-words-ru';

/**
 * Converts a number to its Russian word representation.
 * @param num - The number to convert
 * @returns The Russian word representation of the number
 */
export function numberToRussianWords(num: number): string {
  return convertNumberToWords.convert(num, {
    showNumberParts: {
      fractional: false
    },
    showCurrency: {
      integer: false
    }
  });
}

/**
 * Converts text containing numbers to their Russian word representations.
 * @param text - The input text that may contain numbers
 * @returns The text with all numbers converted to Russian words
 */
export function convertNumbersToRussianWords(text: string): string {
  return text.replace(/(\d+\.?)+/g, (match) => {
    // Split on dots and process each numeric segment separately
    const parts = match.split('.').filter(p => p !== '');
    if (parts.length > 1) {
      // Convert each part separately and join with spaces
      return parts.map(part => numberToRussianWords(parseInt(part))).join(' ');
    }
    return numberToRussianWords(parseInt(match));
  });
}
