import styled from "styled-components";

const VehicleCircle = styled.div`
  background: #000000; /* color of the circle */
  border-radius: 50%; /* make the div a circular shape */
  box-shadow: 4px 4px 3px grey; /* see http://www.w3schools.com/css/css3_shadows.asp */
  -moz-box-shadow: 4px 4px 3px grey;
  -webkit-box-shadow: 4px 4px 3px grey;
`;

const VehicleCircleSelected = styled(VehicleCircle)`
  background-color: #00bfff;
`;

const VehicleIcon = styled.div`
  border-radius: 15px!important;
  background-color: #FFF;
  border: 1px solid #FFF;
`;

const VehicleIconSelected = styled(VehicleIcon)`
  background-color: #00bfff;
  border: 1px solid #00bfff;
`;

const VehicleIconHover = styled(VehicleIconSelected)`
  background-color: #00bfff;
  border: 1px solid #ccee77;
`;



/**
const getStationMarkerByColor = memoize(color =>
  divIcon({
    className: "",
    iconSize: [11, 16],
    popupAnchor: [0, -6],
    html: ReactDOMServer.renderToStaticMarkup(
      <Styled.StationMarker color={color} />
    )
  })
);

 export const hubIcons = Styled.hubIcons.map(StyledIcon =>
  divIcon({
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -12],
    html: ReactDOMServer.renderToStaticMarkup(<StyledIcon />),
    className: ""
  });

export const floatingBikeIcon = divIcon({
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -12],
  html: ReactDOMServer.renderToStaticMarkup(<Styled.OutOfHubBikeIcon />),
  className: ""
});

 */