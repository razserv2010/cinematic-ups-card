## Cinematic UPS Card 0.5.5

- Replaced custom HTML editor inputs with Home Assistant ha-form and native entity, text, date and RGB color selectors, with Hebrew labels.
- Loads native form dependencies through Home Assistant card helpers when needed.
- Preserves existing YAML keys, unknown/custom options and the existing hexadecimal accent_color format.
- Keeps the same form instance during state updates so edits and selector focus are not reset.

Update through HACS and refresh the dashboard. Existing card configuration remains compatible.
