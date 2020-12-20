# @packageforge/color

A TypeScript color library.

Add the package to your project on the command line:
```
npm install @packageforge/color --save
```

Import the `Color` class into your code file:
```typescript
import { Color } from '@packageforge/color';
```

Color object from r, g, b values (all in range of [0-255]):

```typescript
color = new Color(r, g, b);
```

With alpha (in range of [0-1]):

```typescript
color = new Color(r, g, b, a);
```

From css value or name:

```typescript
color = Color.parse(value);
```

From HSL, with optional alpha (all parameters in range of [0-1]):

```typescript
color = Color.fromHsl(h, s, l, a);
```

A random color, with optional alpha:

```typescript
color = Color.random(a);
```

Clone a color, with optional alpha:

```typescript
newColor = originalColor.clone(0.1);
```

Get best Black/White contrast:

```typescript
contrast = originalColor.bestBWContrast();
```

To HSL:

```typescript
hsla = originalColor.toHsl();
```

To a CSS string, with optional format

```typescript
color = new Color(0, 0, 0);
color.toString();           // "rgba(0, 0, 0, 1)"
color.toString("rgba");     // "rgba(0, 0, 0, 1)"
color.toString("rgb");      // "rgb(0, 0, 0)"
color.toString("#");        // "#000000"
color.toString("hsla");     // "hsla(0, 0%, 0%, 1)"
color.toString("hsl");      // "hsla(0, 0%, 0%)"
color.toString("name");     // "Black"
color.toString("name?");    // "Black"
color.toString("name?rgb"); // "Black"
color.toString("name?#");   // "Black"
color.toString("name?hsl"); // "Black"

color = new Color(0, 0, 1); // There is no named color with these values
color.toString("name");     // Throws error!
color.toString("name?");    // "rgb(0, 0, 1)"
color.toString("name?rgb"); // "rgb(0, 0, 1)"
color.toString("name?#");   // "#000001"
color.toString("name?hsl"); // "hsl(240, 100%, 0.2%)"

```

A list of color names:

```typescript
colorNameList = Color.namedColorList();
```

