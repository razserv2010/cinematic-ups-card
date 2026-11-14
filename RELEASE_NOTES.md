## Cinematic UPS Card 0.5.0

- Embedded cinematic background with amber/cyan lighting and reflective metallic floor. No extra background file or external image URL is required.
- Compact reference layout: animated battery on the left, status/runtime in the center, UPS photo on the right.
- Restored liquid fill and particle animation; charge reflects the battery entity.
- Correct left-to-right metric order and responsive sizing.
- Existing entities, image, beeper controls, installation date and editor options preserved.
- Unrelated state updates no longer restart animations or rebuild the editor.

Update through HACS, then refresh the dashboard. The existing YAML remains compatible. The configured UPS image is still used.
