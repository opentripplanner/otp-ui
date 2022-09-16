// Generates readable text color based on background color
// from https://stackoverflow.com/a/36904232
const getContrastYIQ = (color: string): string => {
  const hex = "#";
  let r: number;
  let g: number;
  let b: number;
  if (color?.indexOf(hex) > -1) {
    r = parseInt(color.substr(1, 2), 16);
    g = parseInt(color.substr(3, 2), 16);
    b = parseInt(color.substr(5, 2), 16);
  } else if (color) {
    const colorComponents = color.match(/\d+/g);
    r = parseInt(colorComponents[0], 10);
    g = parseInt(colorComponents[1], 10);
    b = parseInt(colorComponents[2], 10);
  }

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

export default getContrastYIQ;
