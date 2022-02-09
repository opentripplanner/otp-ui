const commonCompanies = [
  {
    id: "BIKETOWN",
    label: "Biketown",
    modes: "BICYCLE_RENT"
  },
  {
    id: "LIME",
    label: "Lime",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "BOLT",
    label: "Bolt",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "RAZOR",
    label: "Razor",
    modes: "MICROMOBILITY_RENT"
  },
  {
    id: "UBER",
    label: "Uber",
    modes: "CAR_HAIL"
  },
  {
    id: "LYFT",
    label: "Lyft",
    modes: "CAR_HAIL"
  },
  // The company below does not have an icon in @opentripplanner/icons
  // but that should not cause a UI crash or prevent anything else from rendering.
  {
    id: "UNKNOWN_BIKESHARE",
    label: "Unknown Bikeshare",
    modes: "BICYCLE_RENT"
  }
];

export default commonCompanies;
