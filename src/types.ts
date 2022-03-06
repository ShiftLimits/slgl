export interface ShaderCanvasOptions {
	devicePixelRatio?:number
	context?:WebGLContextAttributes
}

export interface ResolvedShaderCanvasOptions {
	devicePixelRatio:number
	context:WebGLContextAttributes
}

export type WebGLUniformType = '1f'|'1fv'|'1i'|'1iv'|'1ui'|'1uiv'|'2f'|'2fv'|'2i'|'2iv'|'2ui'|'2uiv'|
															 '3f'|'3fv'|'3i'|'3iv'|'3ui'|'3uiv'|'4f'|'4fv'|'4i'|'4iv'|'4ui'|'4uiv'|
															 'Matrix2fv'|'Matrix2x3fv'|'Matrix2x4fv'|
															 'Matrix3fv'|'Matrix3x2fv'|'Matrix3x4fv'|
															 'Matrix4fv'|'Matrix4x2fv'|'Matrix4x3fv'

// Credit ford04: https://stackoverflow.com/a/63029283
export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
export type DropFirstTwo<T extends unknown[]> = T extends [any, any, ...infer U] ? U : never

// Credit voodoocreation: https://github.com/voodoocreation/ts-deepmerge/blob/cd27bf7dc38271200b3287f7f5d29f5f394b15f0/src/index.ts#L6
export type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export enum LoopEngineState {
	IDLE,
	RUNNING,
	PAUSED,
	DESTROYED
}

export enum LoopProgramState {
	IDLE,
	INITIALIZED,
	DESTROYED
}
export interface LoopProgram {
	init?():Promise<void>|void
	update?(dt:number):void
	render?(interpolation:number):void
	destroy?():void
}