export const ensureSentence = (value) => {
  if (!value) {
    return value;
  }
  const text = typeof value === 'string' ? value.trim() : value;
  if (!text) {
    return text;
  }
  if (/[.!?…։»”"]$/.test(text)) {
    return text;
  }
  return `${text}.`;
};
