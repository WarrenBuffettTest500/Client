const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getSuggestions = (value, symbols) => {
  const escapedValue = escapeRegexCharacters(value);

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return symbols.filter(name => regex.test(name));
};

export const getSuggestionValue = suggestion => suggestion;
export const renderSuggestion = suggestion => suggestion;
