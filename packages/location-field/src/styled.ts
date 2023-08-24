import styled, { css, keyframes } from "styled-components";
import { Spinner as FASpinner } from "@styled-icons/fa-solid/Spinner";

const hiddenCss = css`
  clip: rect(0, 0, 0, 0);
  display: inline-block;
  height: 0;
  overflow: hidden;
  width: 0;
`;

export const HiddenContent = styled.span`
  ${hiddenCss}
`;

export const BaseButton = styled.button`
  border: none;
  background: none;
`;

export const ClearButton = styled(BaseButton)`
  color: #888;
  cursor: pointer;
  width: 30px;
`;

export const ClearBoth = styled.div`
  clear: both;
`;

export const DropdownButton = styled(BaseButton)`
  width: 30px;
`;

export const MenuItemList = styled.ul.attrs({
  role: "listbox"
})`
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  float: left;
  font-size: 14px;
  left: 0;
  list-style: none;
  margin: 2px 0 0;
  min-width: 160px;
  padding: 5px 0;
  position: absolute;
  text-align: left;
  top: 100%;
  /* this is an annoyingly high number, but is needed to be on top of some otp-rr components */
  z-index: 1000000;

  /* If the associated input is not in an expanded state, hide the list. */
  input[aria-expanded="false"] ~ & {
    ${hiddenCss}
  }
`;

export const Input = styled.input`
  border: none;
  box-shadow: none;
  font-size: 17px;
  outline: none;
`;

export const InputGroup = styled.div`
  border-bottom: 1px solid #000;
  border-collapse: separate;
  display: table;
  margin-bottom: 15px;
  position: relative;
`;

export const MenuItemA = styled.a<{ active?: boolean }>`
  background-color: ${props => (props.active ? "#337ab7" : "transparent")};
  clear: both;
  color: ${props => (props.active ? "#fff" : "#333")};
  display: block;
  font-weight: 400;
  line-height: 1.42857143;
  padding: 3px 20px;
  text-decoration: none;
  white-space: nowrap;
`;

export const MenuGroupHeader = styled.h2<{
  bgColor?: string;
  fgColor?: string;
}>`
  color: ${props => props.fgColor || "#eee"};
  background-color: ${props => props.bgColor || "#333"};
  font-size: 12px;
  font-weight: normal;
  line-height: 1.42857143;
  margin: 0;
  padding: 0px 10px;
  text-align: center;
  white-space: nowrap;
`;

export const MenuItemLi = styled.li`
  &:hover {
    /* TODO: adjust highlight color based on props.color? */
    background-color: #f5f5f5;
    cursor: pointer;
  }

  /* For disabled (aria-hidden) elements,
     show an arrow pointer (no I-beam) and don't highlight the background. */
  &[aria-hidden="true"]:hover {
    background-color: unset;
    cursor: default;
  }
`;

export const OptionContainer = styled.span`
  display: block;
  padding-top: 5px;
  padding-bottom: 3px;
`;

export const OptionSubTitle = styled.span`
  color: #686868;
  font-size: 12px;
  margin-left: 6px;
`;

export const OptionContent = styled.span`
  margin-left: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OptionIconContainer = styled.span`
  float: left;
`;

export const RouteName = styled.span`
  background-color: gray;
  color: white;
  padding: 2px 3px 0px;
  margin-right: 5px;
`;

export const StaticMenuItemList = styled(MenuItemList)`
  border: none;
  box-shadow: none;
  display: block;
`;

export const StopContentContainer = styled.span`
  margin-left: 30px;
`;

export const StopDistance = styled.span`
  font-size: 8px;
`;

export const StopIconAndDistanceContainer = styled.span`
  float: left;
  padding-top: 3px;
`;

export const StopName = styled.span``;

export const StopRoutes = styled.span`
  font-size: 9px;
`;

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled(FASpinner)`
  animation: ${rotateAnimation} 1.2s linear infinite;
`;
