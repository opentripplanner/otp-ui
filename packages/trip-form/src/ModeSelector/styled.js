import styled from "styled-components";

const ModeRow = styled.div`
  margin-bottom: 10px;
  > * {
    width: 33.333333%;
    padding: 0px 5px;
  }
`;

export const MainModeRow = styled.div`
  padding: 0px 5px;
  font-size: 200%;
  margin-bottom: 18px;
  box-sizing: border-box;
  > * {
    width: 100%;
    height: 55px;
  }
`;

export const SecondaryModeRow = styled(ModeRow)`
  > * {
    font-size: 150%;
    height: 46px;
  }
`;

export const TertiaryModeRow = styled(ModeRow)`
  font-size: 90%;
  text-align: center;
  > * {
    height: 36px;
  }
`;
