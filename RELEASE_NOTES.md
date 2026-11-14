## Cinematic UPS Card 0.5.8

- Move active alarm messages to the bottom of the card, below the controls and battery date.
- Show the alarm panel only for a non-empty active alarms_entity value. No panel for unknown, unavailable, clear or absent alarms, and no inferred alarm text from battery percentage.
- Alarm-sensor unavailability no longer changes a healthy UPS status badge. Existing status-code warnings remain intact.
- Other card configuration and controls are unchanged.
