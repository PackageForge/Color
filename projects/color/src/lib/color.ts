import { namedColors } from './named-colors';

const namedColorList = Object.getOwnPropertyNames(namedColors);
const namedColorListI = namedColorList.map(name => name.toLowerCase());

export type EColorFormat = "rgb" | "rgba" | "#" | "hsl" | "hsla" | "name" | "name?" | "name?rgb" | "name?#" | "name?hsl";
export interface IHsl {
  h: number
  s: number
  l: number
  a?: number
}
export function isIHsl(hsl: any): hsl is IHsl {
  return typeof (hsl) === "object" &&
    typeof (hsl.h) === "number" &&
    typeof (hsl.s) === "number" &&
    typeof (hsl.l) === "number";
}
export interface IHsla {
  h: number
  s: number
  l: number
  a: number
}
export function isIHsla(hsl: any): hsl is IHsla {
  return typeof (hsl) === "object" &&
    typeof (hsl.h) === "number" &&
    typeof (hsl.s) === "number" &&
    typeof (hsl.l) === "number" &&
    typeof (hsl.a) === "number";
}
export interface IRgb {
  r: number
  g: number
  b: number
  a?: number
}
export function isIRgb(rgb: any): rgb is IRgb {
  return typeof (rgb) === "object" &&
    typeof (rgb.r) === "number" &&
    typeof (rgb.g) === "number" &&
    typeof (rgb.b) === "number";
}
export interface IRgba {
  r: number
  g: number
  b: number
  a: number
}
export function isIRgba(rgb: any): rgb is IRgba {
  return typeof (rgb) === "object" &&
    typeof (rgb.r) === "number" &&
    typeof (rgb.g) === "number" &&
    typeof (rgb.b) === "number" &&
    typeof (rgb.a) === "number";
}
export type AnyColor = string | Color | IRgba | IRgb | IHsla | IHsl;
export class Color implements IRgba, IRgb {
  constructor()
  constructor(r: number, g: number, b: number, a?: number)
  constructor(r?: number, g?: number, b?: number, a?: number) {
    this.r = typeof (r) === "number" ? r : 0;
    this.g = typeof (g) === "number" ? g : 0;
    this.b = typeof (b) === "number" ? b : 0;
    this.a = typeof (a) === "number" ? a : 1;
  }
  private _n: string | undefined;
  private _r!: number;
  get r(): number {
    return this._r;
  }
  set r(r: number) {
    if (r < 0 || r >= 256)
      throw new Error("r value out of [0-255] range: " + r);
    this._r = Math.floor(r);
  }

  private _g!: number;
  get g(): number {
    return this._g;
  }
  set g(g: number) {
    if (g < 0 || g >= 256)
      throw new Error("g value out of [0-255] range: " + g);
    this._g = Math.floor(g);
  }

  private _b!: number;
  get b(): number {
    return this._b;
  }
  set b(b: number) {
    if (b < 0 || b >= 256)
      throw new Error("b value out of [0-255] range: " + b);
    this._b = Math.floor(b);
  }

  private _a!: number;
  get a(): number {
    return this._a;
  }
  set a(a: number) {
    if (a < 0 || a > 1)
      throw new Error("a value out of [0-1] range: " + a);
    this._a = a;
  }
  clone(a?: number): Color {
    const color = Color.fromRgb(this);
    color._n = this._n;
    if (typeof (a) === "number")
      this.a = a;
    return color;
  }
  toHsl(): IHsla {
    const r = this._r / 255, g = this._g / 255, b = this._b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h, s;
    if (max === min)
      h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r)
        h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g)
        h = (b - r) / d + 2;
      else
        h = (r - g) / d + 4;
      h /= 6;
    }
    return { h: h, s: s, l: l, a: this._a };
  }
  bestBWContrast(a?: number | boolean): Color {
    const c = (0.3126 * Math.pow((this._r / 255), 2.2) + 0.5152 * Math.pow((this._g / 255), 2.2) + 0.1722 * Math.pow((this._b / 255), 2.2)) > 0.333 ? 0 : 255;
    if (a === true)
      a = this._a;
    else if (typeof (a) !== "number")
      a = 1;
    return new Color(c, c, c, a);
  }
  matchesName(name: string): boolean {
    name = name.toLowerCase();
    if (name === "transparent")
      return this._a === 0;
    const i = namedColorListI.indexOf(name);
    if (i < 0)
      return false;
    const nc = namedColors[namedColorList[i]];
    return this._r === nc[0] && this._g === nc[1] && this._b === nc[2];
  }
  toName(): string | undefined {
    let nc;
    if (this._n && (nc = namedColors[this._n]) && this._r === nc[0] && this._g === nc[1] && this._b === nc[2])
      return this._n;
    for (let i = 0; i < namedColorList.length; i++) {
      const name = namedColorList[i], nc = namedColors[name];
      if (this._r === nc[0] && this._g === nc[1] && this._b === nc[2])
        return name;
    }
    return;
  }
  toString(format?: EColorFormat): string {
    if (!format)
      format = "rgba";
    else
      format = <EColorFormat>format.toLowerCase();
    if (format.startsWith("name")) {
      const name = this.toName();
      if (name)
        return name;
      if (format.length < 5)
        throw new Error("color is not a named color");
      format = <EColorFormat>format.substr(5) || "rgb";
    }
    if (format === "rgba")
      return "rgba(" + this._r + ", " + this._g + ", " + this._b + ", " + this._a + ")";
    if (format === "rgb")
      return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
    if (format === "#")
      return "#" + Color.to2PlaceHex(this._r) + Color.to2PlaceHex(this._g) + Color.to2PlaceHex(this._b);
    const hsl = this.toHsl();
    if (format === "hsla")
      return "hsla(" + Color.to1PlaceDecimal(hsl.h * 360) + ", " + Color.to1PlaceDecimal(hsl.s * 100) + "%, " + Color.to1PlaceDecimal(hsl.l * 100) + "%, " + hsl.a + ")";
    return "hsl(" + Color.to1PlaceDecimal(hsl.h * 360) + ", " + Color.to1PlaceDecimal(hsl.s * 100) + "%, " + Color.to1PlaceDecimal(hsl.l * 100) + "%)";
  }
  equals(color: AnyColor, ignoreAlpha?: boolean): boolean {
    if (!(color instanceof Color))
      color = Color.from(color);
    return this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      ignoreAlpha ? true : this.a === color.a;
  }
  public static fromRgb(rgb: IRgb, a?: number): Color
  public static fromRgb(rgba: IRgba, a?: number): Color
  public static fromRgb(r: number, g: number, b: number, a?: number): Color
  public static fromRgb(r: number | IRgb, g?: number, b?: number, a?: number): Color {
    if (isIRgb(r)) {
      a = typeof (g) === "number" ? g : r.a;
      g = r.g;
      b = r.b;
      r = r.r;
    } else {
      g = g!;
      b = b!;
    }
    return new Color(r, g, b, a);
  }
  public static fromHsl(hsl: IHsl, a?: number): Color
  public static fromHsl(hsla: IHsla, a?: number): Color
  public static fromHsl(h: number, s: number, l: number, a?: number): Color
  public static fromHsl(h: number | IHsl | IHsla, s?: number, l?: number, a?: number): Color {
    if (isIHsl(h)) {
      a = typeof (s) === "number" ? s : h.a;
      s = h.s;
      l = h.l;
      h = h.h;
    } else {
      s = s!;
      l = l!;
    }
    if (h < 0 || h > 1)
      throw new Error("h value out of [0-1] range: " + h);
    if (s < 0 || s > 1)
      throw new Error("s value out of [0-1] range: " + s);
    if (l < 0 || l > 1)
      throw new Error("l value out of [0-1] range: " + l);
    let r, g, b;
    if (s === 0)
      r = g = b = l;
    else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = Color.hueToRgb(p, q, h + 1 / 3);
      g = Color.hueToRgb(p, q, h);
      b = Color.hueToRgb(p, q, h - 1 / 3);
    }
    return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
  }
  public static random(a?: number): Color {
    return new Color(Color.randomChannel(), Color.randomChannel(), Color.randomChannel(), a);
  }
  public static fromRatios(r: number, g: number, b: number, a?: number): Color {
    return new Color(r / 256, g / 256, b / 256, a);
  }
  public static parse(c: string, a?: number): Color {
    if (c.search(/^\s*\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\s*$/i) === 0)
      return new Color(parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16), a);
    if (c.search(/^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i) === 0)
      return new Color(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), a);
    if (c.search(/^\s*rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)\s*$/i) === 0)
      return new Color(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), typeof (a) === "number" ? a : parseFloat(RegExp.$4));
    if (c.search(/^\s*\#([0-9a-f])([0-9a-f])([0-9a-f])\s*$/i) === 0)
      return new Color(parseInt(RegExp.$1 + RegExp.$1, 16), parseInt(RegExp.$2 + RegExp.$2, 16), parseInt(RegExp.$3 + RegExp.$3, 16), a);
    if (c.search(/^\s*hsl\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*\)\s*$/i) === 0)
      return Color.fromHsl(parseFloat(RegExp.$1) / 360, parseFloat(RegExp.$2) / 100, parseFloat(RegExp.$3) / 100, a);
    if (c.search(/^\s*hsla\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)\s*\)\s*$/i) === 0)
      return Color.fromHsl(parseFloat(RegExp.$1) / 360, parseFloat(RegExp.$2) / 100, parseFloat(RegExp.$3) / 100, typeof (a) === "number" ? a : parseFloat(RegExp.$4));
    if (c.toLowerCase() === "transparent")
      return new Color(0, 0, 0, typeof (a) === "number" ? a : 0);
    const i = namedColorListI.indexOf(c.toLowerCase());
    if (i < 0)
      throw new Error("Unrecognized color format " + c);
    const nc = namedColors[namedColorList[i]];
    let color = new Color(nc[0], nc[1], nc[2], a)
    color._n = namedColorList[i];
    return color;
  }
  public static from(c: AnyColor, a?: number): Color {
    if (typeof (c) === "string")
      return Color.parse(c, a);
    if (isIRgb(c))
      return Color.fromRgb(c, a);
    return Color.fromHsl(c, a);
  }
  public static bestAlpha(background: AnyColor, overlay: AnyColor, apparent: AnyColor):number {
    background = Color.from(background);
    overlay = Color.from(overlay);
    apparent = Color.from(apparent);
    let ratio=0,count=0;
    if (background.r!==overlay.r) {
      count++;
      ratio+=(apparent.r-background.r)/(overlay.r-background.r);
    }
    if (background.g!==overlay.g) {
      count++;
      ratio+=(apparent.g-background.g)/(overlay.g-background.g);
    }
    if (background.b!==overlay.b) {
      count++;
      ratio+=(apparent.b-background.b)/(overlay.b-background.b);
    }
    return count===0 ? 1 : ratio/count;
  }
  public static namedColorList(): string[] {
    return Object.getOwnPropertyNames(namedColors);
  }
  private static randomChannel(): number {
    return Math.floor(Math.random() * 256);
  }
  private static hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  private static to1PlaceDecimal(value: number): string {
    return (Math.round(value * 10) / 10).toString();
  }
  private static to2PlaceHex(value: number): string {
    const h = value.toString(16);
    return h.length === 1 ? "0" + h : h;
  }
}
