import React from "react";
import * as S from "./styled";
import TrimetModeIcon from "../../../icons/lib/trimet-mode-icon-2021";

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface ButtonProps {
  onClick(): void;
  selected: boolean;
  inset?: boolean;
}

export default function Checkbox(
  props: {
    checked: boolean;
    children: React.ReactNode | string;
    className?: string;
    mode?: string;
    ariaLabel?: string;
  } & ButtonProps
): React.ReactElement {
  const {
    ariaLabel,
    checked,
    children,
    className,
    inset,
    mode,
    onClick,
    selected
  } = props;

  return (
    <S.Checkbox
      aria-label={ariaLabel}
      className={className}
      inset={inset}
      onClick={onClick}
      selected={selected}
    >
      {mode && (
        <S.ModeIconWrapper>
          <TrimetModeIcon mode={mode} />
        </S.ModeIconWrapper>
      )}
      {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      {children}
    </S.Checkbox>
  );
}
