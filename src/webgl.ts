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

export function createAttribute(gl:WebGL2RenderingContext, program:WebGLProgram, name:string) {
	let location = gl.getAttribLocation(program, name)
	return location
}

// Buffers

const buffers:Map<WebGL2RenderingContext, WebGLBuffer[]> = new Map()
function addBuffer(gl:WebGL2RenderingContext, buffer:WebGLBuffer) {
	let gl_buffers = buffers.get(gl) || []
	buffers.set(gl, [...gl_buffers, buffer])
}

export function releaseAllBuffers(gl:WebGL2RenderingContext) {
	for (let buffer of buffers.get(gl) || []) gl.deleteBuffer(buffer)
	buffers.set(gl, [])
}

export function releaseBuffer(gl:WebGL2RenderingContext, buffer:WebGLBuffer) {
	let gl_buffers = buffers.get(gl) || []
	let index = gl_buffers.indexOf(buffer)
	if (index != -1) {
		gl.deleteBuffer(buffer)
		gl_buffers.splice(index, 1)
		buffers.set(gl, gl_buffers)
	}
}

export function createBuffer(gl:WebGL2RenderingContext, data:ArrayBufferView | ArrayBuffer | null, usage:number = gl.STATIC_DRAW) {
	const buffer = gl.createBuffer()
	if (!buffer) throw new Error('Unable to create buffer')

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, usage)
	addBuffer(gl, buffer)

	return buffer
}

// Framebuffers

const framebuffers:Map<WebGL2RenderingContext, WebGLFramebuffer[]> = new Map()
function addFramebuffer(gl:WebGL2RenderingContext, framebuffer:WebGLFramebuffer) {
	let gl_framebuffers = framebuffers.get(gl) || []
	framebuffers.set(gl, [...gl_framebuffers, framebuffer])
}

export function releaseAllFramebuffers(gl:WebGL2RenderingContext) {
	for (let framebuffer of framebuffers.get(gl) || []) gl.deleteFramebuffer(framebuffer)
	framebuffers.set(gl, [])
}

export function createFramebuffer(gl:WebGL2RenderingContext) {
	let framebuffer = gl.createFramebuffer()
	if (!framebuffer) throw new Error('Unable to create framebuffer')

	addFramebuffer(gl, framebuffer)

	return framebuffer
}

export function attachTexture(gl:WebGL2RenderingContext, frame_buffer:WebGLFramebuffer, attachment:number, texture:WebGLTexture) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer)
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0)
}
