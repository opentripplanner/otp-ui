import React, { ReactElement } from "react";
import styled from "styled-components";
import { Combination } from "./types";

const Header = styled.div`
  font-size: 2em;
  text-align: left;
`;

const SettingsPanel = styled.div``;

interface Props {
  mode: Combination;
}
export default function SubSettingsPane({ mode }: Props): ReactElement {
  return (
    <SettingsPanel>
      <Header>{mode.label}</Header>
    </SettingsPanel>
  );
}
