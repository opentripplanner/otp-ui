// Reference: https://en.wikipedia.org/wiki/Mile
// While most countries abandoned the mile when switching to the metric system,
// the international mile continues to be used in some countries, such as Liberia,
// Myanmar, the United Kingdom and the United States. It is also used in a number
// of territories with less than a million inhabitants, most of which are UK or US territories,
// or have close historical ties with the UK or US: American Samoa, Bahamas, Belize,
// British Virgin Islands, Cayman Islands, Dominica, Falkland Islands, Grenada,Guam,
// The N. Mariana Islands, Samoa, St. Lucia, St. Vincent & The Grenadines, St. Helena,
// St. Kitts & Nevis, the Turks & Caicos Islands, and the US Virgin Islands.
// The mile is even encountered in Canada, though this is predominantly in rail transport
// and horse racing, as the roadways have been metricated since 1977.

export const areMetricUnitsUsed = (locale: string): boolean => {
  const localesUsingImperialUnits = [
    "en-US",
    "en-GB",
    "en-LR",
    "en-AS",
    "sm-AS",
    "en-BS",
    "en-BZ",
    "es-BZ",
    "en-VG",
    "en-KY",
    "en-DM",
    "en-GD",
    "en-GU",
    "en-MP",
    "en-WS",
    "sm-WS",
    "en-LC",
    "en-VC",
    "en-SH",
    "en-KN",
    "en-TC",
    "en-VI",
    "my-MM"
  ];

  return !localesUsingImperialUnits.includes(locale);
};

export default areMetricUnitsUsed;
