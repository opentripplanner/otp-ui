export default function callIfValid(fn) {
  if (typeof fn === "function") {
    return fn;
  }
  return () => {};
}
