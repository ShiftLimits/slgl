# SLGL - TypeScript WebGL Utilities

Some typed convenience functions for working directly with shaders and WebGL.

## Installation

Install with your favorite NodeJS package manager:

```bash
$ npm install slgl

$ yarn add slgl
```

## Usage

### Shaders

Get started with fragment shaders with only a canvas and the fragment source:

```ts
import { glsl, createFragmentShaderProgram } from 'slgl'

const fragment_source = glsl`#version 300 es

precision highp float;
uniform vec2 resolution;
out vec4 color;

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;
	color = vec4(uv.x, uv.y, 0.0, 1.0);
}`

const canvas = document.getElementById('canvas')
const { render } = createFragmentShaderProgram(canvas, fragment_source)
render()
```

## License

SLGL is [MIT](LICENSE) licensed.
