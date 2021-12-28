import React, { FunctionComponent, ReactElement } from "react";
import { TriMetModeIcon2021 as TriMetModeIcon } from "@opentripplanner/icons";
import * as S from "./styled";
import { CheckboxIcons } from "./types";

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface ButtonProps {
  ariaChecked?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  inset?: boolean;
  mode?: string;
  onClick(): void;
  selected: boolean;
}

export default function Checkbox(
  props: {
    checkboxIcons?: CheckboxIcons;
    checked: boolean;
    children: React.ReactNode | string;
    className?: string;
    innerRef?: React.MutableRefObject<HTMLInputElement>;
    SimpleModeIcon?: FunctionComponent<{ mode: string }>;
  } & ButtonProps
): ReactElement {
  const {
    ariaChecked,
    ariaLabel,
    checkboxIcons,
    checked,
    children,
    className,
    disabled,
    innerRef,
    inset,
    mode,
    onClick,
    selected,
    // If no icon is passed, TriMetModIcon is the default
    SimpleModeIcon = TriMetModeIcon
  } = props;

  const modeIcon = mode && <SimpleModeIcon mode={mode} />;
  const GreenCheck = checkboxIcons?.checked || S.GreenCheck;
  const PlusIcon = checkboxIcons?.unchecked || S.UncheckedIcon;

  return (
    <S.Checkbox
      ariaChecked={ariaChecked}
      ariaLabel={ariaLabel}
      className={className}
      disabled={disabled}
      inset={inset}
      mode={mode}
      ref={innerRef}
      onClick={onClick}
      selected={selected}
    >
      {mode && <S.ModeIconWrapper>{modeIcon}</S.ModeIconWrapper>}
      {checked ? <GreenCheck /> : <PlusIcon />}
      {children}
    </S.Checkbox>
  );
}
