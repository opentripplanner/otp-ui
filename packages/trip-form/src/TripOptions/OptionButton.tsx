import React from "react";
import * as S from "./styled";

// Prettier does not accept typescript in this file
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

export default function OptionButton({ children, checked, className, disabled, label, onClick, selected, }: {
  checked: boolean;
  children?: React.ReactNode | string;
  className?: string;
  disabled?: boolean;
  label: string;
} & ButtonProps): React.ReactElement {
  return (
    <S.OptionButton className={className} disabled={disabled} onClick={onClick} selected={selected}>
      <S.OptionLabel>{label}</S.OptionLabel>
      <S.OptionIcon>
        {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      </S.OptionIcon>
      {children}
    </S.OptionButton>
  );
}
