/**
A CSS Houdini PaintWorklet to fill a background with clouds.
https://github.com/redoPop/houdini-clouds
*/

// LCG constants, from C++ 11's minstd_rand0
const MINSTD_A = 7 ** 5,
      MINSTD_M = 2 ** 31 - 1;

class Clouds {
  static get inputProperties() {
    return [
      '--cloud-hue',
      '--cloud-saturation',
      '--cloud-lightness',
      '--cloud-width',
      '--cloud-density',
      '--cloud-seed',
    ];
  }

  // Draw a single cloud on the given context object
  static drawCloud(ctx, { x, y, width, color }) {
    const scale = width / 165;

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(
      x, y,
      (30 * scale), 0,
      2 * Math.PI
    );
    ctx.arc(
      x + (80 * scale), y - (25 * scale),
      (30 * scale), 0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.arc(
      x + (32 * scale), y - (35 * scale),
      (35 * scale), 0,
      2 * Math.PI
    );
    ctx.arc(
      x + (105 * scale), y,
      (30 * scale), 0,
      2 * Math.PI
    );
    ctx.rect(
      x, y - (10 * scale),
      (105 * scale), (40 * scale)
    );
    ctx.fill();
  }

  // Lehmer RNG, based on C++ 11's minstd_rand0
  rand(max = 1) {
    this.minstdX = MINSTD_A * this.minstdX % MINSTD_M;
    return this.minstdX / MINSTD_M * max;
  }

  // Seed the RNG with the given integer
  seed(value) {
    this.minstdX = value;
    this.rand();
  }

  paint(ctx, size, properties) {
    this.seed(Number(properties.get('--cloud-seed')) || 7);

    const cloudWidth = Number(properties.get('--cloud-width')) || 200;
    const cloudDensity = Number(properties.get('--cloud-density')) || 1;
    const cloudCount = Math.ceil((size.width / cloudWidth) * (size.height / cloudWidth) * cloudDensity);

    const hue = parseInt(properties.get('--cloud-hue'), 10) || 210;
    const saturation = parseInt(properties.get('--cloud-saturation'), 10) || 100;
    const lightness = parseInt(properties.get('--cloud-lightness'), 10) || 100;

    for (let i = 0; i < cloudCount; i++) {
      const scale = this.rand();
      Clouds.drawCloud(ctx, {
        x: this.rand(size.width),
        y: this.rand(size.height),
        width: cloudWidth / 2 + scale * cloudWidth,
        color: `hsl(${hue}deg, ${saturation}%, ${lightness * 0.7 + scale * lightness * 0.3}%)`
      });
    }
  }
}

registerPaint('clouds', Clouds);
