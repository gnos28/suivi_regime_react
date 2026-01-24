export const cleanPhotoDescription = (description: string): string => {
  return description.trim().replace(/\.$/, "").trim();
};
