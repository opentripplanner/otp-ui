import React, { useState } from "react";
import styled from "styled-components";
import AnimateHeight from "react-animate-height";
import { ChevronUp } from "@styled-icons/bootstrap/ChevronUp";
import { Bell } from "@styled-icons/bootstrap/Bell";
import { StyledIcon } from "@styled-icons/styled-icon";
import { useIntl } from "react-intl";
import blue from "../colors/blue";

interface Props {
  alertHeader: JSX.Element | string;
  alertSubheader?: JSX.Element | string;
  backgroundColor?: string;
  /* If true, adds a toggle that expands/collapses the alert content */
  collapsible?: boolean;
  children?: JSX.Element | string;
  /* Icon displayed on Alert - default is Bell */
  Icon?: StyledIcon;
}

const AlertContainer = styled.div<{
  backgroundColor: string;
  collapsible: boolean;
  expandAlert: boolean;
}>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : blue[50]};
  display: grid;
  grid-template-columns: 50px auto auto;
  grid-template-rows: minmax(25px, auto) auto;
  column-gap: 1em;
  padding: 1.5em;

  svg {
    align-self: center;
    grid-column: 1;
    grid-row: 1 / span 2;
    justify-self: center;
  }

  button.toggle-btn {
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
  collapsible: boolean;
}>`
  margin-top: ${props => (props.collapsible ? "1em" : ".5em")};
`;

const Alert = ({
  alertHeader,
  alertSubheader,
  backgroundColor,
  children,
  collapsible,
  Icon = Bell
}: Props): JSX.Element => {
  const [expandAlert, setExpandAlert] = useState(false);
  const intl = useIntl();
  const label = intl.formatMessage({
    id: "otpUi.buildingBlocks.alert.expand",
    defaultMessage: "Expand"
  });
  return (
    <AlertContainer
      backgroundColor={backgroundColor}
      expandAlert={expandAlert}
      collapsible={collapsible}
    >
      <Icon size={24} />
      <AlertHeader>{alertHeader}</AlertHeader>
      <ButtonContainer>
        {collapsible && (
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setExpandAlert(!expandAlert)}
            aria-label={label}
            title={label}
          >
            <ChevronUp size={16} />
          </button>
        )}
      </ButtonContainer>
      {alertSubheader && <AlertSubheader>{alertSubheader}</AlertSubheader>}
      {children && (
        <AlertContent>
          <AnimateHeight
            duration={500}
            height={collapsible ? (expandAlert ? "auto" : 0) : "auto"}
          >
            <ContentPadding collapsible={collapsible}>
              {children}
            </ContentPadding>
          </AnimateHeight>
        </AlertContent>
      )}
    </AlertContainer>
  );
};

export default Alert;
