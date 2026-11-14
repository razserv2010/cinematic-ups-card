## Cinematic UPS Card 0.5.2

- Hebrew UPS status labels, including online, on battery, charging and battery replacement.
- New configurable alarms_entity field in the visual editor.
- Active alarms show a red status badge and a separate red error message. Common alarms are translated; unrecognized alarm text is preserved.
- Alarm-only updates refresh the card. Cleared alarms restore the normal state. Unavailable alarm sensors show a separate availability notice.

Configuration example (keep your existing remaining fields):
```yaml
status_entity: sensor.ups_status_data
alarms_entity: sensor.alarms_ups_3d_printers
```
