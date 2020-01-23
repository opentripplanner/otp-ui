/* eslint-disable no-unused-vars */
/* stylelint-disable property-no-vendor-prefix */
/* stylelint-disable CssSyntaxError */

import PropTypes from "prop-types";

import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";

// note: want to make these props of styled, so props.colorSelected
// BTW, 'props.color' works, since that's an established prop of styled
// https://stackoverflow.com/questions/52321539/react-passing-props-with-styled-components
const color = "#000";
const colorSelected = "#00bfff";
const colorHighlight = "#ccee77";

export const VehicleCircle = styled(Circle)`
  color: ${props => props.color || color};
  background-color: ${props => props.color || color};
  border: 1px solid ${props => props.color || color};
  :hover {
    color: ${props => props.colorSelected || colorSelected};
    background-color: ${props => props.colorSelected || colorSelected};
    border: 1px solid ${props => props.colorHighlight || colorHighlight};
  }
  vertical-align: top;
  border-radius: 50%;
  box-shadow: 4px 4px 3px grey;
  -moz-box-shadow: 4px 4px 3px grey;
  -webkit-box-shadow: 4px 4px 3px grey;
`;

export const TrackedVehicleCircle = styled(VehicleCircle)`
  color: ${props => props.colorSelected || colorSelected};
  background-color: ${props => props.colorSelected || colorSelected};
`;

// idea: create a generic marker type with defaults (and default images, etc...)
//       then use this type to pass styles from Vehicles -> VehicleLayer -> VehicleGeometry

const Marker = {};

Marker.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string,
  colorSelected: PropTypes.string,
  colorHighlight: PropTypes.string
};

Marker.defaultProps = {
  color: "#000",
  background: "#000",
  colorSelected: "#00bfff",
  colorHighlight: "#ccee77"
};

VehicleCircle.propTypes = Marker.propTypes;
VehicleCircle.defultProps = Marker.defaultProps;

/*
.vehicle-circle {
}


.vehicle-icon {
  border-radius: 15px!important;
  background-color: #FFF;
  border: 1px solid #FFF;
}
.vehicle-icon-selected {
  background-color: #00bfff;
  border: 1px solid #00bfff;
}

.vehicle-icon:hover, .vehicle-icon-selected:hover, .vehicle-circle:hover {
  background-color: #00bfff;
  border: 1px solid #ccee77;
}

.vehicle-animate {
  -webkit-transition: all 3s ease-out;
  -moz-transition: all 3s ease-out;
  -o-transition: all 3s ease-out;
  transition: all 3s ease-out;
}



    const iconHtml = ReactDOMServer.renderToStaticMarkup(
      <Styled.StackedIconContainer title={location.name}>
        {type === "from" ? (
          // From icon should have white circle background
          <>
            <Styled.StackedCircle size={24} />
            <Styled.StackedLocationIcon size={24} type={type} />
          </>
        ) : (
          <>
            <Styled.StackedToIcon size={24} type="to" />
            <Styled.ToIcon size={20} type={type} />
          </>
        )}
      </Styled.StackedIconContainer>
    );
    icon={divIcon({ html: iconHtml, className: "" })}

                <Styled.Button onClick={this.clearLocation}>
                  <Icon type="times" /> Remove as {type} location
                </Styled.Button>



  path: {
    color: "#00bfff",
    opacity: 1,
    weight: 4
  }


const stacked = css`
  left: 0;
  position: absolute;
  text-align: center;

  :hover {
     color: #F00;
  }
`;


export const Button = styled.button`
  border: none;
  color: navy;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const stacked = css`
  left: 0;
  position: absolute;
  text-align: center;
`;

export const StackedCircle = styled(Circle)`
  color: #fff;
  ${stacked}
`;

export const StackedLocationIcon = styled(LocationIcon)`
  ${stacked}
`;

export const StackedToIcon = styled(StackedLocationIcon)`
  color: #333;
`;

export const StackedIconContainer = styled.span`
  display: inline-block;
  height: 2em;
  line-height: 2em;
  line-height: inherit;
  margin-left: -10px;
  margin-top: -7px;
  opacity: 1;
  position: relative;
  vertical-align: middle;
  width: 2em;
`;

export const ToIcon = styled(LocationIcon)`
  ${stacked}
  line-height: inherit;
  margin-left: 2px;
  margin-top: 2px;
`;


const VehicleCircle = styled.div`
  background: #000000;
  border-radius: 50%;
  box-shadow: 4px 4px 3px grey;
  -moz-box-shadow: 4px 4px 3px grey;
  -webkit-box-shadow: 4px 4px 3px grey;
`;

const VehicleCircleSelected = styled(VehicleCircle)`
  background-color: #00bfff;
`;

const VehicleIcon = styled.div`
  border-radius: 15px !important;
  background-color: #fff;
  border: 1px solid #fff;
`;

const VehicleIconSelected = styled(VehicleIcon)`
  background-color: #00bfff;
  border: 1px solid #00bfff;
`;

const VehicleIconHover = styled(VehicleIconSelected)`
  background-color: #00bfff;
  border: 1px solid #ccee77;
`;



// https://styled-icons.js.org/
// https://fontawesome.com/cheatsheet/pro
// https://styled-icons.js.org/?s=MapMarkerAlt
export const StationMarker = styled(MapMarkerAlt)`
  color: ${props => props.color};
`;


// https://github.com/jacobwgillespie/styled-icons#styled-components
import styled from 'styled-components'
import {Lock} from 'styled-icons/material'

export const RedLock = styled(Lock)`
  color: red;
  font-weight: ${props => (props.important ? 'bold' : 'normal')};
`


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



// BIKETOWN HUB ICONS

const BaseBikeRentalIcon = styled.div`
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin: auto;
  width: 24px;
  height: 24px;
`;

export const hubIcons = [
  // 0% full
  styled(BaseBikeRentalIcon)`
    background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0id2hp....blah
  `,
  // 10% full
  styled(BaseBikeRentalIcon)`
    background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0id2hp
  `,

 */
