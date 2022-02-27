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
