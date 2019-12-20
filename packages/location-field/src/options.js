import { transitIndexStopWithRoutes } from "@opentripplanner/core-utils/lib/types";
import { isIE } from "@opentripplanner/core-utils/lib/ui";
import { humanizeDistanceStringImperial } from "@opentripplanner/humanize-distance";
import PropTypes from "prop-types";
import React from "react";
import { Bus } from "styled-icons/fa-solid";

import * as Styled from "./styled";

export function Option({ disabled, icon, isActive, onClick, title }) {
  return (
    <Styled.MenuItem onClick={onClick} active={isActive} disabled={disabled}>
      {isIE() ? (
        // In internet explorer 11, some really weird stuff is happening where it
        // is not possible to click the text of the title, but if you click just
        // above it, then it works. So, if using IE 11, just return the title text
        // and avoid all the extra fancy stuff.
        // See https://github.com/ibi-group/trimet-mod-otp/issues/237
        title
      ) : (
        <Styled.OptionContainer>
          <div style={{ float: "left" }}>{icon}</div>
          <div
            style={{
              marginLeft: "30px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {title}
          </div>
        </Styled.OptionContainer>
      )}
    </Styled.MenuItem>
  );
}

Option.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.node
};

Option.defaultProps = {
  disabled: false,
  icon: null,
  isActive: false,
  title: null
};

export function TransitStopOption({ stop, onClick, isActive }) {
  return (
    <Styled.MenuItem onClick={onClick} active={isActive}>
      <div>
        <div style={{ float: "left", paddingTop: "3px" }}>
          <Bus size={13} />
          <div style={{ fontSize: "8px" }}>
            {humanizeDistanceStringImperial(stop.dist, true)}
          </div>
        </div>
        <div style={{ marginLeft: "30px" }}>
          <div>
            {stop.name} ({stop.code})
          </div>
          <div style={{ fontSize: "9px" }}>
            {(stop.routes || []).map(route => {
              const name = route.shortName || route.longName;
              return (
                <Styled.RouteName key={`route-${name}`}>
                  {name}
                </Styled.RouteName>
              );
            })}
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>
    </Styled.MenuItem>
  );
}

TransitStopOption.propTypes = {
  stop: transitIndexStopWithRoutes.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool
};

TransitStopOption.defaultProps = {
  isActive: false
};
