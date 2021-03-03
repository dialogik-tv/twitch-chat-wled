# A Twitch Chat WLED Controller

Control a WLED using Twitch chat commands.

This web page listens to Twitch chat WLED commands that allow to control the WLED. This application uses [WLED HTTP request API](https://github.com/Aircoookie/WLED/wiki/HTTP-request-API).

## Setting color

Say `!color RRGGBB` (or `#RRGGBB`) in [hexadecimal notation](https://en.wikipedia.org/wiki/Hexadecimal) or `!color R,G,B` where `R`, `G` and `B` must be a value between `0-255` to modify the primary color.

You can see a live demo of this in the [dialogikTV Twitch livestream chat](https://www.twitch.tv/dialogikTV).

## Examples

HEX
```
!color 00acee (dialogikTV blue)
!color #ee00ac (ping, note the optional # sign)
```
RGB
```
       R     G     B
!color 0-255,0-255,0-255

!color 255,0,0 (red)
!color 255,0,255 (purple)
!color 200,255,200 (light green)
```

## Setting effects

You can modify the WLED effects using the `!fx` command. (Technically, these commands change [*presets*](https://github.com/Aircoookie/WLED/wiki/Presets), not [*effects*](https://github.com/Aircoookie/WLED/wiki/List-of-effects-and-palettes#effects)).

Say `!fx <effect>`, where `effect` is

* `android`,
* `scanner` or
* `breathe`

to select a specific effect. You can also just say `!fx` to cycle through effects.
