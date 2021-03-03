# A Twitch Chat WLED Controller

Control a WLED using Twitch chat commands.

This web page listens to Twitch chat WLED commands that allow to control the WLED. This application uses [WLED HTTP request API](https://github.com/Aircoookie/WLED/wiki/HTTP-request-API).

## Setting color

Say `!color RRGGBB` (or `#RRGGBB`) in [hexadecimal notation](https://en.wikipedia.org/wiki/Hexadecimal) in the [dialogikTV Twitch livestream chat](https://www.twitch.tv/dialogikTV) to set the primary color. This command currently only accepts the color value as a 6 character hexadecimal (`0-9` and `A-F`) string, optionally prefixed by a hash `#`.

## Setting effects

You can modify the WLED effects using the `!fx` command. (Technically, these commands change [*presets*](https://github.com/Aircoookie/WLED/wiki/Presets), not [*effects*](https://github.com/Aircoookie/WLED/wiki/List-of-effects-and-palettes#effects)).

Say `!fx <effect>`, where `effect` is

* `android`,
* `scanner` or
* `breathe`

to select a specific effect. You can also just say `!fx` to cycle through effects.