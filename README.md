# SLGL - TypeScript WebGL Utilities

Some typed convenience functions for working directly with shaders and WebGL.

## Installation

Install with your favorite NodeJS package manager:

```bash
$ npm install slgl

$ yarn add slgl
```

## Usage

### Simple Fragment Shaders

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
const { render } = createFragmentShaderCanvas(canvas, fragment_source)
render() // Call render any time you want to re-draw
```

Use resize observer to re-draw when the canvas size is changed:

```ts
const canvas_observer = new ResizeObserver(() => render())
canvas_observer.observe(canvas)
```

### Animated Shaders

Use the `LoopEngine` class to drive animated shaders:

```ts
import { LoopEngine } from 'slgl'

const fragment_source = glsl`#version 300 es

precision highp float;
uniform vec2 resolution;
uniform float time;
out vec4 color;

void main() {
	vec2 uv = gl_FragCoord.xy/resolution;
	color = vec4(
		(sin(uv.x + time) + 1.0) / 2.0,
		(sin(uv.y + time + 5.0) + 1.0) / 2.0,
		0.0,
		1.0
	);
}`

// Get canvas element and device pixel ratio
const canvas = document.getElementById('canvas')
const devicePixelRatio = window.devicePixelRatio || 1

// Create the fragment shader program
const { program, createUniform, setResolution, draw } = createFragmentShaderProgram(gl, fragment_source)

// Create variables for program
let time = 0
const setTime = createUniform('1f', 'time')

// Update shader uniform for `resolution` any time the canvas resizes
const canvas_observer = new ResizeObserver(() => {
	const canvas_rect = canvas.getBoundingClientRect()
	const width = canvas.width = canvas_rect.width * devicePixelRatio
	const height = canvas.height = canvas_rect.height * devicePixelRatio
	setResolution([width, height])
})

// Create the loop engine
const engine = new LoopEngine()

// Create the program to animate the shader
engine.linkProgram({
	init() {
		time = 0 // Reset time each init
		canvas_observer.observe(canvas) // Start observing the canvas
	},
	destroy() {
		canvas_observer.unobserve(canvas) // Clean up observer
	},
	update(dt) {
		time += dt // Advance our time variable by the time delta passed by `LoopEngine`

		setTime(time) // Update the time uniform within the shader
	},
	render() {
		draw()
	}
})

// Start the engine
engine.init()
```

## License

SLGL is [MIT](LICENSE) licensed.
