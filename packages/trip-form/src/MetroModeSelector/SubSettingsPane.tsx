import React from "react";
import styled from "styled-components";

const Header = styled.div`
  font-size: 2em;
  text-align: left;
`;

const SettingsPanel = styled.div``;

export default function SubSettingsPane({ mode }) {
  return (
    <SettingsPanel>
      <Header>{mode.name}</Header>
    </SettingsPanel>
  );
}
