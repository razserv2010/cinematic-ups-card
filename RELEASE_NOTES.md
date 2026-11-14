## Cinematic UPS Card 0.5.7

- Beeper control opens a styled menu directly inside the card instead of the entity more-info dialog.
- Options are read from the configured select/input_select entity. Switch/input_boolean entities expose on/off choices.
- Hebrew labels are displayed while exact underlying option values are sent to Home Assistant.
- Unavailable entities cannot be operated; pending requests prevent duplicate actions and failures display an inline message.
- Existing beeper_entity configuration is retained. A controllable select or switch entity is required; sensors remain status-only.
