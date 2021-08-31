import React from "react";
import * as S from "./styled";
import TrimetModeIcon from "../../../icons/lib/trimet-mode-icon-2021";

// FIXME: Move this to @opentripplanner/types added in https://github.com/opentripplanner/otp-ui/pull/281
export interface ButtonProps {
  onClick(): void;
  selected: boolean;
}

export default function Checkbox(
  props: {
    checked: boolean;
    children: React.ReactNode | string;
    className?: string;
    inset?: boolean;
    mode?: string;
  } & ButtonProps
): React.ReactElement {
  const {
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
      className={`${className || ""} ${inset ? "inset" : ""}`}
      onClick={onClick}
      selected={selected}
    >
      {mode && (
        <span className="customIcon">
          <TrimetModeIcon mode={mode} />
        </span>
      )}
      {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      {children}
    </S.Checkbox>
  );
}
