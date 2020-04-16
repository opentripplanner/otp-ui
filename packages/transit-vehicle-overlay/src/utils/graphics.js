import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import cloneDeep from "lodash.clonedeep";

export function renderAsImage(
  icon,
  size = [22, 22],
  pop = [0, 0],
  tt = [0, 0],
  cls = ""
) {
  //
  if (pop === null) {
    const px = size[0] / 2;
    pop = [px, 0];
  }

  if (tt === null) {
    const py = (size[1] / 2) * -1;
    tt = [0, py];
  }

  const retVal = L.divIcon({
    html: ReactDOMServer.renderToString(icon),
    className: cls,
    iconSize: size,
    popupAnchor: pop,
    tooltipAnchor: tt
  });
  return retVal;
}

/**
 * will take an input object (e.g., probably a defaultProp representing a leaflet style),
 * deep copy that object, and return back a new obj with the .color set
 *
 * @param color
 * @return deep copied object with color set
 */
export function setColor(color, obj) {
  const retVal = cloneDeep(obj);
  retVal.color = color;
  return retVal;
}
