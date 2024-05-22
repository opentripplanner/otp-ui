import React, { ReactChild, useState } from "react";
import styled from "styled-components";
import AnimateHeight from "react-animate-height";
import { ChevronUp } from "@styled-icons/bootstrap/ChevronUp";
import { Bell } from "@styled-icons/bootstrap/Bell";
import blue from "./colors/blue";

interface Props {
  alertHeader: string;
  alertSubheader?: string;
  backgroundColor?: string;
  collapsable?: boolean;
  children?: ReactChild;
  Icon?: any;
}

const AlertContainer = styled.div<{
  backgroundColor: string;
  collapsable: boolean;
  expandAlert: boolean;
}>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : blue[50]};
  display: grid;
  grid-template-columns: 50px auto auto;
  grid-template-rows: minmax(25px, auto) auto;
  max-width: 715px;
  padding: 1.5em 2em;

  svg {
    align-self: center;
    grid-column: 1;
    grid-row: 1 / span 2;
    justify-self: start;
  }

  button {
    background: transparent;
    border: none;
    width: 40px;

    svg {
      transform: ${props => !props.expandAlert && "rotate(180deg)"};
      transition: all 0.2s ease-in;
    }
  }

  @media (max-width: 550px) {
    grid-template-columns: 40px auto auto;
    padding: 1.25em 1.25em;
  }
`;

const ButtonContainer = styled.span`
  align-items: center;
  display: flex;
  justify-content: center;
  justify-self: right;
`;

const AlertHeader = styled.span`
  align-self: center;
  font-weight: 700;
  grid-column: 2;
`;

const AlertSubheader = styled(AlertHeader)`
  font-weight: 400;
  margin-top: 0.3em;
`;

const AlertContent = styled.div`
  grid-column: 2;
  grid-row: 3;
`;

const ContentPadding = styled.div<{
  collapsable: boolean;
}>`
  margin-top: ${props => (props.collapsable ? "1em" : ".5em")};
`;

const Alert = ({
  alertHeader,
  alertSubheader,
  backgroundColor,
  children,
  collapsable,
  Icon = Bell
}: Props): JSX.Element => {
  const [expandAlert, setExpandAlert] = useState(false);
  return (
    <AlertContainer
      backgroundColor={backgroundColor}
      expandAlert={expandAlert}
      collapsable={collapsable}
    >
      <Icon size={24} />
      <AlertHeader>{alertHeader}</AlertHeader>
      <ButtonContainer>
        {collapsable && (
          <button type="button" onClick={() => setExpandAlert(!expandAlert)}>
            <ChevronUp size={16} />
          </button>
        )}
      </ButtonContainer>
      {alertSubheader && <AlertSubheader>{alertSubheader}</AlertSubheader>}
      {children && (
        <AlertContent>
          <AnimateHeight
            duration={500}
            height={collapsable ? (expandAlert ? "auto" : 0) : "auto"}
          >
            <ContentPadding collapsable={collapsable}>
              {children}
            </ContentPadding>
          </AnimateHeight>
        </AlertContent>
      )}
    </AlertContainer>
  );
};

export default Alert;
