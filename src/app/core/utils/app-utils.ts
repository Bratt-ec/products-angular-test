export const toAwait = (ms?: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}