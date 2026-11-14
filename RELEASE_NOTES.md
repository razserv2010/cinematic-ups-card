## Cinematic UPS Card 0.5.4

- Hebrew translations for all 18 alarm strings defined in NUT 2.8.1 usbhid-ups.c and MGE HID vendor mappings, plus existing aliases. Device capabilities vary; no claim that every model emits all alarms.
- Translate combined status codes and English labels; preserve unknown alarm text.
- Place red alarm details inside a scrollable status area. Alarm messages no longer add an extra row or change card height. Full messages remain accessible by scrolling within that area.
- Existing status_entity and alarms_entity settings remain compatible; no duplicate keys or YAML changes required.

Sources:
https://sources.debian.org/src/nut/2.8.1-5/drivers/usbhid-ups.c/
https://sources.debian.org/src/nut/2.8.1-5/drivers/mge-hid.c/

- Compact warning badge leaves space for the actual alarm message; power state remains available on hover. Runtime box stays within the center column.
