import React from "react";
import chroma from "chroma-js";
import styled from "styled-components";
import grey from "../../colors/grey";
import red from "../../colors/red";

interface Props {
  hue: string;
  background: string;
}

const ScoreCard = styled.div`
  border: 1px solid ${grey[100]};
  border-radius: 7px;
  padding: 10px 15px;
`;

const ScoreCardHeader = styled.p`
  font-size: 16px;
  font-weight: bolder;
`;

const ScoreBlock = styled.div`
  align-items: center;
  display: flex;
  gap: 5px;

  p {
    margin: 0;
  }
`;

const ScorePill = styled.div`
  color: white;
  display: flex;
  font-size: 13px;
  align-items: center;
  border-radius: 20px;
  padding: 5px 15px;
  margin: 3px 0;
`;

const PassContainer = styled(ScorePill)`
  background-color: green;
`;

const FailContainer = styled(ScorePill)`
  background-color: ${red[800]};
`;

const pass = <PassContainer>Pass</PassContainer>;
const fail = <FailContainer>Fail</FailContainer>;

// const wcagPassOrFail = () => {};

const WcagChecker = ({ hue, background }: Props): any => {
  const wcagScore = chroma.contrast(hue, background);

  const returnPassFail = (benchmark: number) => {
    const sufficientContrast = wcagScore >= benchmark;
    return sufficientContrast ? pass : fail;
  };

  return (
    <ScoreCard>
      <ScoreCardHeader>Normal Text</ScoreCardHeader>
      <ScoreBlock>
        <p>WCAG AA: </p>
        <p>{returnPassFail(4.1)}</p>
      </ScoreBlock>
      <ScoreBlock>
        <p>WCAG AAA: </p>
        <p>{returnPassFail(7.1)}</p>
      </ScoreBlock>
      <ScoreCardHeader>
        Large Text (at least 18 point or 14 point bold)
      </ScoreCardHeader>
      <ScoreBlock>
        <p>WCAG AA: </p>
        <p>{returnPassFail(3.1)}</p>
      </ScoreBlock>
      <ScoreBlock>
        <p>WCAG AAA: </p>
        <p>{returnPassFail(4.5)}</p>
      </ScoreBlock>
      <ScoreCardHeader>
        Graphical Objects and User Interface Components
      </ScoreCardHeader>
      <ScoreBlock>
        <p>WCAG AA: </p>
        <p>{returnPassFail(3)}</p>
      </ScoreBlock>
    </ScoreCard>
  );
};

export default WcagChecker;
