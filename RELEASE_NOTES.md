## Cinematic UPS Card 0.5.6

- Switches the active editor to Home Assistant getConfigForm: HA renders and manages the form directly. No getConfigElement override, custom editor CSS or custom value-change handler is used on this path.
- Native expandable sections for status/alarms, metrics, beeper and appearance with Hebrew labels.
- Existing flat YAML keys remain unchanged. The native text/color selector preserves hexadecimal accent_color values.

Implementation references reviewed:
https://github.com/piitaya/lovelace-mushroom/blob/main/src/cards/template-card/template-card-editor.ts
https://github.com/Axildor/AXiDOS-Avatar-Card/blob/main/src/editor.js
https://contributors.home-assistant.io/frontend/custom-ui/card-editor/

Update in HACS and fully refresh the browser before reopening the card editor.
