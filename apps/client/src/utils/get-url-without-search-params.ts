export const getUrlWithoutSearchParams = (urlString: string): string => {
  const url = new URL(urlString);

  return `${url.origin}${url.pathname}`;
};
