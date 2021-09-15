import { CheckCircle } from "@styled-icons/boxicons-solid/CheckCircle";
import { PlusCircle } from "@styled-icons/boxicons-regular/PlusCircle";
import ScrollContainer from "react-indiana-drag-scroll";
import styled, { css } from "styled-components";
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

export const TripOptionsContainer = styled.div`
  background-color: #0d5eac;
  color: white;
  font-weight: 40;
  max-width: 992px; /* Maximum mobile width */
  min-height: 400px;
  overflow-y: scroll;
`;
export const TripOptionsSubContainer = styled.div`
  max-width: 700px;
  padding: 12px;
`;

export const TransitOptionsContainer = styled.div`
  display: flex;
  gap: 20px;
  > button {
    flex: 1;
  }
`;

export const Image = styled.img`
  cursor: pointer;
  max-width: 100%;
`;

export const FeaturedOptionImageWrapper = styled.div`
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Image} {
    max-height: 200px;
  }
`;


export const MaxHeightImage = styled(Image)`
  max-height: 200px;
`;

export const buttonIconCss = css`
  height: 3em;
  margin-bottom: 10px;
  width: 3em;
`;

export const GreenCheck = styled(CheckCircle)`
  ${buttonIconCss}
  background-color: white;
  border-radius: 50%;
  clip-path: circle(40% at 50% 50%); /* Hides white stroke */
  color: rgb(84, 174, 88);
`;

export const UncheckedIcon = styled(PlusCircle)`
  ${buttonIconCss}
`;

export const OptionButton = styled.button`
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border-color: ${(props: ButtonProps) =>
    props.selected ? "white" : "lightgrey"};
  border-radius: 7px;
  border: solid 1px;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  min-width: 100%;
  opacity: ${(props: ButtonProps) => (props.selected ? "1" : "0.5")};
  padding: 7px 5px;
  svg {
    @media (max-width: 768px) {
      max-width: 20px;
      max-height: 20px;
    }
  }
`;

export const OptionLabel = styled.div``;

export const OptionIcon = styled.div`
  > svg {
    margin-bottom: 0px;
  }
`;

export const QuestionButton = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  color: white;
  cursor: pointer;
  float: right;
  opacity: 0.5;
  > svg {
    height: 1em;
    width: 1em;
  }
  :hover {
    opacity: 1;
  }
`;

export const Checkbox = styled.button.attrs({
  role: "checkbox",
  tabIndex: 0,
})`
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: ${(props: ButtonProps) => (
    props.mode === "WALK" || props.mode === "BICYCLE"
      ? "50px"
      : "77px"
  )};
  opacity: ${(props: ButtonProps) => (props.selected ? "1" : "0.5")};
  padding: 20px 0px;
  white-space: pre-wrap;

  ${(props: ButtonProps) => (props.inset ? `
    margin: 20px 0;
    position: relative;

    ${UncheckedIcon} {
      background: #0d5eac;
      clip-path: circle(40% at 50% 50%); /* hide outer border */
      border-radius: 50%; /* fallback for when clip-path is unsupported */
    }
    svg {
      position: absolute;
      right: 5.5%;
      top: 11%;
      @media (max-width: 768px) {
        max-width: 20px;
        max-height: 20px;
      }
    }
  ` : "")}
`;

export const FeaturedOptionContainer = styled.div`
  display: flex;
  > div {
    flex: 1;
  }
`;

export const OverlayContainer = styled.div`
  padding: 15px;
`

export const OverlayHeader = styled.h3`
  text-align: center;
`

export const OverlayOptions = styled.ul`
  list-style: none;
  margin-left: 0;
  padding-left: 0;
  li > a {
    align-items: center;
    background-color: #fff;
    border-radius: 7px;
    color: #000;
    display: flex;
    height: 40px;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    padding-bottom: 5px;
    text-decoration: none;
    img {
      height: 40px;
    }
    .open-link {
      color: #777;
    }
  }
`

export const ModeIconWrapper = styled.span`
/* Adjust the checkmark/plus if it is next to a custom icon */
  ~ ${/* sc-selector */ GreenCheck},
  ~ ${/* sc-selector */ UncheckedIcon} {
    position: relative;
    right: -30px;
    height: 1.5em;
    width: 1.5em;
    top: -50px;
    margin-bottom: -1em;
  }

  /* Custom icon for the item, should it be present */
  & svg {
    position: relative;
    height: 3em;
    width: 3em;
    fill: white;
  }
`;

// The ScrollContainer doesn't work in the jsdom/server environment, so replace it with a div
const isServerEnv = navigator?.userAgent?.includes("jsdom");
export const ScrollableRow = styled(isServerEnv ? "div" : ScrollContainer)`
  background-color: #0a4c8d;
  display: flex;
  overflow-x: scroll;
  padding: 0 12px;

  /* Individual item in the row*/
  > button {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 24px;
  }
  
  /* hover effects */
  &:hover > button {
    opacity: 0.5;
  }
  &:hover > button svg {
    opacity: 0.5;
  }

  &:hover > button:hover {
    opacity: 1;
  }
  &:hover > button:hover svg {
    opacity: 1;
  }
`;
