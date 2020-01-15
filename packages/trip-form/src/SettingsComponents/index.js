import styled from "styled-components";

export const SettingsHeader = styled.div`
  color: #333333;
  font-size: 18px;
  margin: 16px 0px;
`;

export const SettingsSection = styled.div`
  margin-bottom: 16px;
`;

export const SettingLabel = styled.label`
  padding-top: 8px;
  color: #808080;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const FloatingSettingLabel = styled(SettingLabel)`
  float: left;
  padding-top: 9px;
`;
