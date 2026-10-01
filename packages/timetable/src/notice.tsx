import React, { useEffect, useRef, useState } from "react";
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

const CloseIcon = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 1.5rem;
  height: 40px;
  margin-right: 0.8rem;
  padding: 0;
  width: 40px;
`;

interface Props {
  content: string[];
}

const Notice = (props: Props): JSX.Element => {
  const { content } = props;

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Adding document event listeners allows us to close the notice
  // when the user either clicks any part of the page that isn't the notice
  // or presses the escape key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleMouseEvent = (e: MouseEvent): void => {
      if (!containerRef?.current?.contains(e.target as HTMLElement))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleMouseEvent);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleMouseEvent);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [containerRef]);

  return (
    <NoticeContainer ref={containerRef}>
      <NoticeSymbol
        aria-label={isOpen ? "Close notice" : "Open notice"}
        className="trip-notice-symbol"
        onClick={() => setIsOpen(!isOpen)}
      >
        {"\u2139"}
      </NoticeSymbol>
      {isOpen ? (
        <NoticeContent>
          {/* TODO: When notices open, the focus needs to be set to the first element in this container */}
          <ul>
            {content.map(s => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <CloseIcon aria-label="Close notice" onClick={() => setIsOpen(false)}>
            {"\u2715"}
          </CloseIcon>
        </NoticeContent>
      ) : null}
    </NoticeContainer>
  );
};

export default Notice;
