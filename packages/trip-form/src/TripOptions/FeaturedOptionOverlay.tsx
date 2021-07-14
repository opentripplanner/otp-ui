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
    <div>
      <button onClick={() => setFeaturedOption(null)} type="button">
        Back
      </button>
      <S.MaxHeightImage src={category.image} />
      <h3>{category.label}</h3>
      <p>{category.description}</p>
      <ul>
        {category.options.map(o => {
          return (
            <li key={o.label}>
              {o.label}{" "}
              <a href="https://example.com">
                Open app{" "}
                <ExternalLinkAlt style={{ height: "1em", width: "1em" }} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FeaturedOptionOverlay;
