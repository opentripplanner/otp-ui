import ScrollContainer from "react-indiana-drag-scroll";
import styled, { css } from "styled-components";
import { Check } from "@styled-icons/bootstrap/Check";
import { PlusCircle } from "@styled-icons/boxicons-regular/PlusCircle";
import { isServerEnv } from "./util";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

// todo: move this string to localization file (and possibly add more exact info on each particular mode)
const modeButtonAriaLabel = "Opens a dialog that describes this mode, with optional links to third party services.";

export const TripOptionsContainer = styled.div`
  background-color: #0d5eac;
  color: white;
  font-weight: 40;
  max-width: 992px; /* Maximum mobile width */
  min-height: 400px;
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

export const buttonIconCss = css`
  border-radius: 50%;
  height: 3em;
  margin-bottom: 10px;
  width: 3em;
  z-index: 10;
`;

export const GreenCheck = styled(Check)`
  ${buttonIconCss}
  background-color: rgb(84, 174, 88);
  color: white;
`;

export const UncheckedIcon = styled(PlusCircle)`
  ${buttonIconCss}
`;

export const Image = styled.img`
  max-width: 100%;
`;

export const FeaturedOptionImageWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 1em;

  * {
    max-height: 200px;
    width: 100%; /* safari requires explicit width to render svg */
  }
`;

export const ModeIconWrapper = styled.span`
/* Adjust the checkmark/plus if it is next to a custom icon */
  ~ ${/* sc-selector */ GreenCheck},
  ~ ${/* sc-selector */ UncheckedIcon} {
    height: 1.5em;
    margin-bottom: -1em;
    position: relative;
    right: -30px;
    top: -50px;
    width: 1.5em;
  }

  /* Custom icon for the item, should it be present */
  & svg {
    fill: white;
    height: 3em;
    position: relative;
    width: 3em;
  }
`;

export const QuestionButton = styled.button.attrs({
  "aria-label": modeButtonAriaLabel
})`
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

export const FeaturedOptionQuestionContainer = styled.div.attrs({
  "aria-label": modeButtonAriaLabel
})`
  cursor: pointer;

  &:hover ${QuestionButton} {
    opacity: 1;
  }
`;

export const MaxHeightImage = styled(Image)`
  max-height: 200px;
`;


export const OptionButton = styled.button.attrs(( props: ButtonProps ) => ( {
  "aria-checked": props.ariaChecked || props.selected,
  "aria-label": props.ariaLabel,
  role: "checkbox",
  tabIndex: 0
} ))`
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border-color: ${(props: ButtonProps) => props.selected ? "white" : "lightgrey"};
  border-radius: 7px;
  border: solid 1px;
  color: white;
  cursor: ${(props: ButtonProps) => props.disabled ? "not-allowed" : "pointer"};
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
  min-width: 100%;
  opacity: ${(props: ButtonProps) => (props.selected ? "1" : "0.65")};
  padding: 7px 5px;
  svg {
    @media (max-width: 768px) {
      max-height: 20px;
      max-width: 20px;
    }
  }

  &:hover {
    opacity: 1;
  }
`;

export const OptionLabel = styled.div`
  flex: 2;
  text-align: left;
`;

export const OptionIcon = styled.div`
  > svg {
    margin-bottom: 0px;
  }
`;

export const OptionImage = styled.img`
  max-height: 20px;
  width: 50px;
`;


export const Checkbox = styled.button.attrs(( props: ButtonProps ) => ( {
  "aria-checked": props.ariaChecked || props.selected,
  "aria-label": props.ariaLabel,
  role: "checkbox",
  tabIndex: 0,
} ))`
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  color: white;
  cursor: ${(props:ButtonProps) => props.disabled ? "not-allowed" : "pointer"};
  display: flex;
  flex-direction: column;
  min-width: ${(props: ButtonProps) => (
    props.mode === "WALK" || props.mode === "BICYCLE"
      ? "50px"
      : "77px"
  )};
  opacity: ${(props: ButtonProps) => (props.selected ? "1" : "0.65")};
  padding: 20px 0px;
  white-space: pre-wrap;

  ${(props: ButtonProps) => (props.inset ? `
    margin: 20px 0;
    position: relative;

    ${UncheckedIcon} {
      background: #0d5eac;
    }

    ${GreenCheck}, ${UncheckedIcon} {
      position: absolute;
      right: 5.5%;
      top: 11%;
      @media (max-width: 768px) {
        max-height: 20px;
        max-width: 20px;
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
`;

export const OverlayHeader = styled.h3`
  text-align: center;
`;

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
    .label, .label * {
      height: 40px;
    }
    .open-link {
      color: #777;
    }
  }
`;


// The ScrollContainer doesn't work in the jsdom/server environment, so replace it with a div
export const ScrollableRow = styled(isServerEnv ? "div" : ScrollContainer)<{ hideScrollbars: boolean }>`
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
  &:hover > button:hover {
    opacity: 1;
  }
  &:hover > button:hover svg {
    opacity: 1;
  }

  -ms-overflow-style: none;  /* Trident */
  scrollbar-width: none;  /* Gecko */

  &::-webkit-scrollbar {
    display: none; /* Webkit */
  }
`;
