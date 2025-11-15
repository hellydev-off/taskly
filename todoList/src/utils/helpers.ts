export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("ru-RU");
};

export const formatFullDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getInitials = (username: string): string => {
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
