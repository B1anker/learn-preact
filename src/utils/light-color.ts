import hexToRgb from 'hex-to-rgb'
import rgbToHsl from 'rgb-to-hsl'

export default function (hex, lightness) {
  const hsl = rgbToHsl.apply(rgbToHsl, hexToRgb(hex))
  const result = `hsl(${(hsl[0]).toFixed(3)}, ${parseInt(hsl[1], 10)}%, ${parseInt(hsl[2], 10) + lightness}%)`
  return result
}
