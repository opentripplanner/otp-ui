import React, { useState } from "react";
import styled from "styled-components";

import colors from "@opentripplanner/building-blocks";

const NoticeSymbol = styled.button`
  background-color: transparent;
  border: solid black;
  border-radius: 50%;
  cursor: pointer;
  display: block;
  font-size: 1.3rem;
  padding: 0 6px;
`;

const NoticeContent = styled.div`
  background-color: ${colors.grey[100]};
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  position: absolute;
  text-align: left;
  text-wrap: wrap;
  transform: translateX(25px) translateY(-80%);
  max-width: 600px;
`;

const NoticeContainer = styled.div`
  display: flex;
`;

const CloseIcon = styled.div`
  cursor: pointer;
  padding: 10px;
`;

interface Props {
  content: string[];
}

const Notice = (props: Props): JSX.Element => {
  const { content } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <NoticeContainer>
      <NoticeSymbol
        aria-label={isOpen ? "Close notice" : "Open notice"}
        className="trip-notice-symbol"
        onClick={() => setIsOpen(!isOpen)}
      >
        {"\u2139"}
      </NoticeSymbol>
      {isOpen ? (
        <NoticeContent>
          <ul>
            {content.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <CloseIcon onClick={() => setIsOpen(false)}>{"\u2715"}</CloseIcon>
        </NoticeContent>
      ) : null}
    </NoticeContainer>
  );
};

export default Notice;
