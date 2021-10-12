import React, { FunctionComponent, ReactElement } from "react";
import { TriMetModeIcon2021 as TriMetModeIcon } from "@opentripplanner/icons";
import * as S from "./styled";

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface ButtonProps {
  disabled?: boolean;
  inset?: boolean;
  mode?: string;
  onClick(): void;
  selected: boolean;
}

export default function Checkbox(
  props: {
    ariaLabel?: string;
    checked: boolean;
    children: React.ReactNode | string;
    className?: string;
    SimpleModeIcon?: FunctionComponent<{ mode: string }>;
  } & ButtonProps
): ReactElement {
  const {
    ariaLabel,
    checked,
    children,
    className,
    disabled,
    inset,
    mode,
    onClick,
    selected,
    // If no icon is passed, TriMetModIcon is the default
    SimpleModeIcon = TriMetModeIcon
  } = props;

  const modeIcon = mode && <SimpleModeIcon mode={mode} />;

  return (
    <S.Checkbox
      aria-label={ariaLabel}
      className={className}
      disabled={disabled}
      inset={inset}
      mode={mode}
      onClick={onClick}
      selected={selected}
    >
      {mode && <S.ModeIconWrapper>{modeIcon}</S.ModeIconWrapper>}
      {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      {children}
    </S.Checkbox>
  );
}
