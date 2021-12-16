import coreUtils from "@opentripplanner/core-utils";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from "react";

import GeneralSettingsPanel from "../GeneralSettingsPanel";

import FeaturedOption from "./FeaturedOption";
import FeaturedOptionOverlay from "./FeaturedOptionOverlay";
import { getSelectedModes } from "./util";
import ModeRow from "./ModeRow";
import TransitOptions from "./TransitOptions";
import { Company, QueryParams, QueryProps } from "./types";
import * as S from "./styled";

interface ComponentProps {
  /**
   * React element to be rendered below
   * the rest of the element
   */
  footer?: ReactElement;

  /**
   * List of company objects to include in the
   * featured options
   */
  supportedCompanies: Company[];

  /**
   * Classnames to add to the container div to allow additional styling
   */
  className?: string;

  /**
   * Whether to display the built-in back button in the featured mode overlay. If the button is disabled,
   * featuredItemOverlayEnabled should be used to hide the overlay.
   */
  featuredItemOverlayBackButton?: boolean;
  /**
   * If this prop is set to false, the featured item overlay will immediately disappear.
   * This can be used in conjunction with featuredItemOverlayBackButton to replace the back
   * button.
   *
   * If passing a useState hook to this component, this prop should be the value of the useState output.
   */
  featuredItemOverlayEnabled?: boolean;
  /**
   * If this prop is passed, any updates to the featured item overlay will be
   * reported to the function passed. This can be used to keep track of if the overlay is open.
   *
   * If passing a useState hook to this component, this prop should be the setter of the useState output.
   */
  featuredItemOverlayShown?: (overlayShown: boolean) => void;

  /**
   * An optional prop to override svg fill color of CompanyIcons
   * Note: this will only work if the image field of the option is an svg
   */
  tripOptionIconFillOverride?: string;

  /**
   * Object of icon props used to overwrite the checkmark and plus icons
   */
  checkboxIcons?: { checked: FunctionComponent; unchecked: FunctionComponent };

  /**
   * Icon prop used for overwriting company logos throughout the component
   */
  CompanyIcon?: FunctionComponent<{ company: string }>;

  /**
   * Icon prop used for overwriting mode icons throughout the component
   */
  SimpleModeIcon?: FunctionComponent<{ mode: string }>;

  /**
   * Icon prop used for overwriting the question mark icon throughout the component
   */
  QuestionIcon: ReactElement;

  // DetailedModeIcon is defined in QueryProps
}

type Props = ComponentProps & QueryProps;

/**
 * This component renders the custom TriMet Mode Selector
 */
export default function TripOptions(props: Props): ReactElement {
  const {
    className,
    featuredItemOverlayBackButton,
    featuredItemOverlayEnabled,
    featuredItemOverlayShown,
    footer,
    onQueryParamChange: updateQueryParams,
    queryParams,
    supportedCompanies,
    supportedModes,
    tripOptionIconFillOverride,
    checkboxIcons,
    CompanyIcon,
    DetailedModeIcon,
    SimpleModeIcon,
    QuestionIcon
  } = props;

  const [featuredOption, setFeaturedOption] = useState(null);
  const [queryParamOverrides, setQueryParamOverrides] = useState<{
    [key: string]: QueryParams;
  }>({});

  // Populate the transit query param override if initial query params
  // include transit modes
  useEffect(() => {
    const initialTransitModes = getSelectedModes(queryParams).filter(
      coreUtils.itinerary.isTransit
    );

    if (initialTransitModes.length > 0) {
      setQueryParamOverrides({
        transit: {
          mode: initialTransitModes.join(",")
        }
      });
    }
  }, []);

  // Allow external closing
  useEffect(() => {
    if (featuredItemOverlayEnabled === false) {
      setFeaturedOption(null);
    }
  }, [featuredItemOverlayEnabled]);

  // Update callback when featuredItemOverlay changes
  useEffect(() => {
    featuredItemOverlayShown && featuredItemOverlayShown(!!featuredOption);
  }, [featuredOption]);

  // FIXME: move all query param handling to hook (object with category to queryParam mapping)
  // THis will involve refactoring all sub-components to send category along with
  // query param update. The refactor will be complex but the end result will be
  // cleaner and simpler. Only this index component will handle queryParam generation,
  // all others could work in only React space.
  const onQueryParamChange = (
    newQueryParams: QueryParams,
    categoryId: string = null
  ) => {
    const newParams = { ...newQueryParams };

    // Update transit override if changes are made to transit submodes
    const updatedSelectedModes = getSelectedModes(newParams);
    const updatedSelectedTransit = updatedSelectedModes.filter(
      coreUtils.itinerary.isTransit
    );
    // Only update if the updated transit isn't "TRANSIT", since that would reset things
    // when the user doesn't want them to be reset.
    if (
      updatedSelectedTransit.length > 0 &&
      updatedSelectedTransit[0] !== "TRANSIT"
    ) {
      setQueryParamOverrides({
        ...queryParamOverrides,
        transit: { mode: updatedSelectedTransit.join(",") }
      });
    }

    // Update category override
    if (categoryId) {
      // If custom transit is set, un-set it here (it will be replaced later)
      if ("transit" in queryParamOverrides) {
        newQueryParams.mode = newQueryParams.mode.replace(
          queryParamOverrides.transit.mode,
          "TRANSIT"
        );
      }
      const { companies, mode } = newQueryParams;
      setQueryParamOverrides({
        ...queryParamOverrides,
        [categoryId]: { companies, mode }
      });
    }

    // Override transit if transit override is present
    if (
      updatedSelectedTransit[0] === "TRANSIT" &&
      "transit" in queryParamOverrides
    ) {
      newParams.mode = newParams.mode.replace(
        "TRANSIT",
        queryParamOverrides.transit.mode
      );
    }
    updateQueryParams(newParams);
  };

  if (featuredOption) {
    return (
      <S.TripOptionsContainer className={className}>
        <FeaturedOptionOverlay
          featuredOption={featuredOption}
          setFeaturedOption={setFeaturedOption}
          showBackButton={featuredItemOverlayBackButton}
          supportedCompanies={supportedCompanies}
          supportedModes={supportedModes}
          CompanyIcon={CompanyIcon}
          DetailedModeIcon={DetailedModeIcon}
        />
      </S.TripOptionsContainer>
    );
  }
  return (
    <S.TripOptionsContainer className={className}>
      <ModeRow
        onQueryParamChange={onQueryParamChange}
        queryParamOverrides={queryParamOverrides}
        queryParams={queryParams}
        supportedModes={supportedModes}
        checkboxIcons={checkboxIcons}
        SimpleModeIcon={SimpleModeIcon}
      />
      <S.TripOptionsSubContainer>
        <FeaturedOption
          onQueryParamChange={onQueryParamChange}
          queryParams={queryParams}
          setFeaturedOption={setFeaturedOption}
          supportedModes={supportedModes}
          iconFillOverride={tripOptionIconFillOverride}
          questionIcon={QuestionIcon}
          checkboxIcons={checkboxIcons}
          DetailedModeIcon={DetailedModeIcon}
        />
        <GeneralSettingsPanel
          query={queryParams}
          supportedModes={supportedModes}
          onQueryParamChange={onQueryParamChange}
        />
        <TransitOptions
          onQueryParamChange={onQueryParamChange}
          queryParams={queryParams}
          supportedModes={supportedModes}
          checkboxIcons={checkboxIcons}
          DetailedModeIcon={DetailedModeIcon}
        />
        {footer}
      </S.TripOptionsSubContainer>
    </S.TripOptionsContainer>
  );
}

export { S as Styled };
