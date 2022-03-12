import { ShaderCanvasOptions, WebGLUniformType } from './types'
import { ScreenCoveringTriangleVertexSource } from './shaders'
import { DefaultShaderCanvasOptions } from './constants'
import { deepMerge } from './utils'
import { createShader, createProgram, createUniform, createAttribute } from './webgl'

// Canvas utilities

export function createShaderCanvas(canvas:HTMLCanvasElement, vertex_source:string, fragment_source:string, options:ShaderCanvasOptions = {}) {
	const { devicePixelRatio, context } = deepMerge(DefaultShaderCanvasOptions(), options)

	const gl = canvas.getContext("webgl2", context)
	if (!gl) throw new Error('Unable to get WebGL context.')

	const shader_program = createShaderProgram(gl, vertex_source, fragment_source)
	const { setResolution } = shader_program

	// This function runs the webgl program
	function render(draw = true) {
		if (!gl) return {}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null) // We are rendering to the canvas so unbind any framebuffers
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)

		// Resize viewport to DOM resolution and set resolution uniform
		const canvas_rect = canvas.getBoundingClientRect()
		const width = canvas.width = canvas_rect.width * devicePixelRatio
		const height = canvas.height = canvas_rect.height * devicePixelRatio

		gl.viewport(0, 0, width, height)
		setResolution([width, height])

		if (draw) gl.drawArrays(gl.TRIANGLE_FAN, 0, 3) // Draw

		return {
			width, height,
			ratio: width/height
		}
	}

	function destroy() {
		if (!gl) return

		let ext = gl.getExtension('WEBGL_lose_context')
		if (ext) ext.loseContext()
	}

	return {
		...shader_program,
		render,
		destroy
	}
}

/** Create a fragment-only shader canvas */
export function createFragmentShaderCanvas(canvas:HTMLCanvasElement, fragment_source:string, options:ShaderCanvasOptions = {}) {
	return createShaderCanvas(canvas, ScreenCoveringTriangleVertexSource, fragment_source, options)
}

export function createShaderProgram(gl:WebGL2RenderingContext, vertex_source:string, fragment_source:string) {
	// Create shaders
	const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_source)
	const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_source)

	// Create program
	const program = createProgram(gl, vertex_shader, fragment_shader)
	if (!program) throw new Error('Unable to create shader program')

	// Set up common program uniforms
	const setResolution = createUniform(gl, program, '2fv', 'resolution')

	// Make sure the gl context is using the program
	gl.useProgram(program)

	return {
		gl,
		program,
		vertex_shader,
		fragment_shader,
		createUniform: (type:WebGLUniformType, name:string) => createUniform(gl, program, type, name),
		createAttribute: (name:string) => createAttribute(gl, program, name),
		setResolution
	}
}

/** Create a fragment-only shader program */
export function createFragmentShaderProgram(gl:WebGL2RenderingContext, fragment_source:string) {
	return {
		...createShaderProgram(gl, ScreenCoveringTriangleVertexSource, fragment_source),
		draw() {
			gl.drawArrays(gl.TRIANGLE_FAN, 0, 3)
		}
	}
}
