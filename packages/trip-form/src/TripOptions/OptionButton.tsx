import React from "react";
import * as S from "./styled";

// Prettier does not accept typescript in this file
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

export default function OptionButton({
  children,
  checked,
  className,
  disabled,
  image,
  label,
  onClick,
  selected
}: {
  checked: boolean;
  children?: React.ReactNode | string;
  className?: string;
  disabled?: boolean;
  image?: string;
  label: string;
} & ButtonProps): React.ReactElement {
  return (
    <S.OptionButton
      ariaLabel={label}
      ariaChecked={selected}
      className={className}
      disabled={disabled}
      onClick={onClick}
      selected={selected}
    >
      {/* This means the image tag is present even if there is no icon, but this 
      allows spacing to be even when there are options with and without icons */}
      <S.OptionImage alt={image && `image for ${label}`} src={image} />
      <S.OptionLabel>{label}</S.OptionLabel>
      <S.OptionIcon>
        {checked ? <S.GreenCheck /> : <S.UncheckedIcon />}
      </S.OptionIcon>
      {children}
    </S.OptionButton>
  );
}
