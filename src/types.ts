export type WebGLUniformType = '1f'|'1fv'|'1i'|'1iv'|'1ui'|'1uiv'|'2f'|'2fv'|'2i'|'2iv'|'2ui'|'2uiv'|
															 '3f'|'3fv'|'3i'|'3iv'|'3ui'|'3uiv'|'4f'|'4fv'|'4i'|'4iv'|'4ui'|'4uiv'|
															 'Matrix2fv'|'Matrix2x3fv'|'Matrix2x4fv'|
															 'Matrix3fv'|'Matrix3x2fv'|'Matrix3x4fv'|
															 'Matrix4fv'|'Matrix4x2fv'|'Matrix4x3fv'

// Credit ford04: https://stackoverflow.com/a/63029283
export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
