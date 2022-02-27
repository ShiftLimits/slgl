import { DropFirst, WebGLUniformType } from './types'

export function createProgram(gl:WebGL2RenderingContext, vertex_shader:WebGLShader, fragment_shader:WebGLShader) {
	let program = gl.createProgram()
	if (!program) throw new Error('Unable to create program')

	gl.attachShader(program, vertex_shader)
	gl.attachShader(program, fragment_shader)
	gl.linkProgram(program)

	let success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (!success) throw new Error('Unable to create program')

	return program
}

export function createShader(gl:WebGL2RenderingContext, type:typeof WebGL2RenderingContext.SHADER_TYPE, source:string) {
	let shader = gl.createShader(type)
	if (!shader) throw new Error('Unable to create shader')

	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!success) {
		console.log(source)
		console.error(gl.getShaderInfoLog(shader))
		throw new Error('Unable to compile shader')
	}

	return shader
}

export function createUniform<T extends WebGLUniformType>(gl:WebGL2RenderingContext, program:WebGLProgram, type:T, name:string) {
	let location = gl.getUniformLocation(program, name)
	return function setUniform(...args:DropFirst<Parameters<typeof gl[`uniform${T}`]>>) {
		// @ts-ignore
		return gl[`uniform${type}`](location, ...args)
	}
}

