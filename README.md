# [My Awesome Monetized Player](https://dan-lucian.github.io/custom-player-with-ads/)

## Table of contents

- [Demo](#demo)
- [Description](#description)
- [Notable stuff](#notable-stuff)
- [Upcoming features](#upcoming-features)

## Demo

- [See the app](https://dan-lucian.github.io/custom-player-with-ads/)
- Disable ad blockers on that page if player not working.

## Description

A player with custom UI that can serve ads.

## Notable stuff

**Stuff**

- the player was built with native browser web components (aka custom elements), no frameworks.
- the player supports basic VAST ads, VPAID ads and IMA ads.
	- the player will run IMA-like urls (https://pubads.g.doubleclick.net) through IMA sdk.
- support for video streaming using HLS with m3u8 manifests.
  - video quality switcher for manifests with multiple qualities.
- custom made webpack (dev/prod) + typescript + eslint + prettier intergration.


## Upcoming features

- [ ] Feature: Seek bar.
- [ ] Feature: Sound slider.
