import { CheckCircle } from "@styled-icons/boxicons-solid/CheckCircle";
import { PlusCircle } from "@styled-icons/boxicons-regular/PlusCircle";
import ScrollContainer from "react-indiana-drag-scroll";
import styled, { css } from "styled-components";

export const TripOptionsContainer = styled.div`
  background-color: #0d5eac;
  color: white;
  min-height: 400px;
  overflow-y: scroll;
`;

export const ScrollableRow = styled(ScrollContainer)`
  display: flex;
  overflow-x: scroll;
  background-color: #0a4c8d;
  > button {
    min-width: 100px;
  }
`;

export const TransitOptionsContainer = styled.div`
  display: flex;
  > button {
    flex: 1;
  }
`;

interface ButtonProps {
  onClick(): void;
  selected: boolean;
}

export const Image = styled.img`
  max-width: 100%;
`;

export const MaxHeightImage = styled(Image)`
  max-height: 200px;
`;

export const Checkbox = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: none;
  color: ${(props: ButtonProps) => (props.selected ? "white" : "lightgrey")};
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  align-items: center;
`;

export const buttonIconCss = css`
  height: 2em;
  width: 2em;
  margin-bottom: 10px;
`;

export const GreenCheck = styled(CheckCircle)`
  ${buttonIconCss}
  background-color: white;
  border-radius: 50%;
  color: green;
`;

export const UncheckedIcon = styled(PlusCircle)`
  ${buttonIconCss}
`;

export const OptionButton = styled.button`
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  color: ${(props: ButtonProps) => (props.selected ? "white" : "lightgrey")};
  border: solid 1px;
  border-color: ${(props: ButtonProps) =>
    props.selected ? "white" : "lightgrey"};
  border-radius: 7px;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  min-width: 100%;
  padding: 5px;
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
  float: right;
  > svg {
    height: 1em;
    width: 1em;
  }
`;

export const FeaturedOptionContainer = styled.div`
  display: flex;
  > div {
    flex: 1;
  }
`;
