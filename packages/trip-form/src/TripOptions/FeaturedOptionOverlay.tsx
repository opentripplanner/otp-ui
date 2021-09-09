import { ExternalLinkAlt } from "@styled-icons/fa-solid/ExternalLinkAlt";
import React from "react";

import * as S from "./styled";
import { Company, Modes } from "./types";
import { getCategoryPrimaryMode } from "./util";

const FeaturedOptionOverlay = ({
  featuredOption,
  setFeaturedOption,
  supportedModes
}: {
  featuredOption: string;
  setFeaturedOption(option: string): void;
  supportedCompanies: Company[];
  supportedModes: Modes;
}) => {
  const category = supportedModes.categories.find(
    c => featuredOption === getCategoryPrimaryMode(c)
  );
  return (
    <S.OverlayContainer>
      <button onClick={() => setFeaturedOption(null)} type="button">
        Back
      </button>
      <S.FeaturedOptionImageWrapper>
        <S.MaxHeightImage src={category.image} />
      </S.FeaturedOptionImageWrapper>
      <S.OverlayHeader>{category.label}</S.OverlayHeader>
      <p>{category.description}</p>
      <S.OverlayOptions>
        {category.options.map(o => {
          // Don't show non-company options (e.g., park and ride)
          if (!o.company) return null;
          return (
            <li key={o.label}>
              <a href={o.url}>
                <span className="label">
                  {o.image ? <img src={o.image} alt={o.label} /> : o.label}
                </span>
                <span className="open-link">
                  Open app{" "}
                  <ExternalLinkAlt style={{ height: "1em", width: "1em" }} />
                </span>
              </a>
            </li>
          );
        })}
      </S.OverlayOptions>
    </S.OverlayContainer>
  );
};

export default FeaturedOptionOverlay;
