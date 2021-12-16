import React, { FunctionComponent } from "react";
import * as S from "./styled";

// Prettier does not accept typescript in this file
// eslint-disable-next-line prettier/prettier
import type { ButtonProps } from "./Checkbox"

export default function OptionButton({
  checkboxIcons,
  children,
  checked,
  className,
  disabled,
  iconFillOverride,
  image,
  label,
  onClick,
  selected
}: {
  checkboxIcons?: { checked: FunctionComponent; unchecked: FunctionComponent };
  checked: boolean;
  children?: React.ReactNode | string;
  className?: string;
  disabled?: boolean;
  iconFillOverride?: string;
  image?: string;
  label: string;
} & ButtonProps): React.ReactElement {
  const GreenCheck = checkboxIcons?.checked || S.GreenCheck;
  const PlusIcon = checkboxIcons?.unchecked || S.UncheckedIcon;

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
      <S.OptionImage title={image && `image for ${label}`} iconFillOverride={iconFillOverride} key={label} src={image} />
      <S.OptionLabel>{label}</S.OptionLabel>
      <S.OptionIcon>
        {checked ? <GreenCheck /> : <PlusIcon />}
      </S.OptionIcon>
      {children}
    </S.OptionButton>
  );
}
