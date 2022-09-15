import React, { ReactElement } from "react";
import styled from "styled-components";
import { Combination } from "./types";

const Header = styled.div`
  font-size: 2em;
  text-align: left;
`;

const SettingsPanel = styled.div``;

interface Props {
  combination: Combination;
}
export default function SubSettingsPane({ combination }: Props): ReactElement {
  // const modesWithSettings = combination.modes.map(mode => ({
  //   ...mode,
  //   settings: queryParams.filter(param => param.routingTypes.includes(mode))
  // }));
  return (
    <SettingsPanel>
      <Header>{combination.label}</Header>
      {/* {modesWithSettings.map(mode => (
        <div>{mode.mode}</div>
      ))} */}
    </SettingsPanel>
  );
}
