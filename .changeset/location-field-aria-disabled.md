---
"@opentripplanner/location-field": patch
---

Fix location field ARIA when there are no selectable options: stop counting disabled current-location in the selectable lookup, set `aria-expanded="false"` when nothing is selectable, set `aria-disabled` only when the menu is completely empty, and include unavailable status in the toggle and combobox accessible names for screen readers.
