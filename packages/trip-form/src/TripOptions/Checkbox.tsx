import React from "react";
import { TrimetModeIcon2021 as TrimetModeIcon } from "@opentripplanner/icons";
import * as S from "./styled";

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface ButtonProps {
  icon?: React.ReactElement;
  inset?: boolean;
  mode?: string;
  onClick(): void;
  selected: boolean;
}

export default function Checkbox(
  props: {
    checked: boolean;
    children: React.ReactNode | string;
    className?: string;
    ariaLabel?: string;
  } & ButtonProps
): React.ReactElement {
  const {
    ariaLabel,
    checked,
    children,
    className,
    icon,
    inset,
    mode,
    onClick,
    selected
  } = props;

  const modeIcon = icon || <TrimetModeIcon mode={mode} />;

  return (
    <S.Checkbox
      aria-label={ariaLabel}
      className={className}
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
