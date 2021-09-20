import React from "react";
import * as S from "./styled";
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

export default function OptionButton({ onClick, label, children, className, selected, checked }: {
  checked: boolean;
  children?: React.ReactNode | string;
  className?: string;
  label: string;
} & ButtonProps): React.ReactElement {
  return (
    <S.OptionButton className={className && className} onClick={onClick} selected={selected}>
      <S.OptionLabel>{label}</S.OptionLabel>
      <S.OptionIcon>
        {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      </S.OptionIcon>
      {children}
    </S.OptionButton>
  );
}
