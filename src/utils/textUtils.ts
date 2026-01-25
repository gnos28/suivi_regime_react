export const cleanPhotoDescription = (description: string): string => {
  return description.trim().replace(/\.$/, "").trim();
};

export const removeBracketsFromText = (text: string): string =>
  text.replace(/\[\d(\.\d+)?\]/, "").trim();

export const extractQuantityFromText = (text: string): number => {
  const quantityModifierMatch = text.match(/(?<=\[)\d(\.\d+)?(?=\])/);
  const quantityModifier = quantityModifierMatch
    ? parseFloat(quantityModifierMatch[0])
    : 1;

  return quantityModifier;
};
