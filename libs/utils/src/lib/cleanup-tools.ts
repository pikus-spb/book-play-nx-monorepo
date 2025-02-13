export function cleanHTMLTags(text: string): string {
  try {
    const document = new DOMParser().parseFromString(text, 'text/html');
    return (document.body.textContent || '').trim();
  } catch (error) {
    console.error('Error parsing HTML string:', error);
    return '';
  }
}

export function cleanSpaces(text: string): string {
  return text
    .trim()
    .replace(/&nbsp;/gi, ' ')
    .replace(/[ ]{2,}/gi, ' ');
}

export function cleanHTML(text: string): string {
  return cleanHTMLTags(cleanSpaces(text));
}

export function cleanHTMLAndCopyrights(text: string): string {
  text = cleanHTML(text).trim();
  if (
    text.startsWith('©') ||
    text.match(/авторские права/gi) ||
    text.match(/создание fb2/gi) ||
    text.match(/Издательство [а-я]+®/gi) ||
    text.match(/Royallib/gi) ||
    text.match(/Все книги автора/gi) ||
    text.match(/Эта же книга в других форматах/gi) ||
    text.match(/Приятного чтения!/gi) ||
    text.match(/Copyright ©/gi) ||
    text.match(/All rights reserved/gi) ||
    text.match(/Все права защищены/gi) ||
    text.match(/litres|литрес/gi)
  ) {
    return '';
  }

  return text;
}
