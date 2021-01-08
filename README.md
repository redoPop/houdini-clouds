# Houdini Clouds [![NPM Version](https://img.shields.io/npm/v/houdini-clouds.svg?style=flat)](https://npmjs.org/package/houdini-clouds)
A [CSS Houdini](https://developer.mozilla.org/en-US/docs/Web/Houdini) [PaintWorklet](https://developer.mozilla.org/en-US/docs/Web/API/PaintWorklet) to fill a background with clouds, and an experiment in deterministic RNG for Houdini.

![Screenshot demonstrating the effect of Houdini Clouds](https://github.com/redoPop/houdini-clouds/blob/main/screenshot.png?raw=true)

**[☁ Demo](https://redopop.com/houdini-clouds)** (requires [a client with PaintWorklet support](https://caniuse.com/mdn-api_paintworkletglobalscope))

Many Houdini worklets use `Math.random()` e.g. for generating noise. Subsequent paints therefore alter the generated image dramatically. This can be a neat effect, but also jarring. Houdini Clouds instead uses a simple random number generator based on C++11's [`minstd_rand0`](https://cplusplus.com/reference/random/minstd_rand0/), seeded with a configurable static value. Subsequent paints therefore have a more predictable result.

## Use
Load the worklet:
```javascript
if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule('https://unpkg.com/houdini-clouds/worklet.js');
}
```

Apply it in CSS:
```css
.element {
  background-image: paint(clouds);
}
```

## Configure
Custom properties allow you to alter the appearance of the generated clouds:

```css
.element {
  --cloud-hue: 210;
  --cloud-saturation: 100;
  --cloud-lightness: 100;
  --cloud-width: 200;
  --cloud-density: 1;
  --cloud-seed: 7;
  background-image: paint(circles);
}
```

| Property | Default | Description
| -------: | :------ | :----------
| `--cloud-hue` | `210` | Hue of clouds
| `--cloud-saturation` | `100` | Saturation of clouds
| `--cloud-lightness` | `100` | Max lightness of clouds
| `--cloud-width` | `200` | Max width of clouds in CSS pixels
| `--cloud-density` | `1` | Multiplier to adjust number of clouds
| `--cloud-seed` | `7` | Default seed for RNG

## Demo
You can play with the demo at https://redopop.com/houdini-clouds or clone this repo and `npm run demo` to try it locally.

❤️⛅
