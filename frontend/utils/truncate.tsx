export function truncateText(data: string, truncate?: number) {
  const text = data.replace(/<(.|\n)*?>/g, ' ').replace(/\&nbsp;/g, '');
  const truncateText = truncate ? text.length > truncate ? `${text.substring(0, truncate)} ...` : text : text;
  return truncateText;
};
