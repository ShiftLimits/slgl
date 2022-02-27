import { ResolvedShaderProgramOptions } from './types'

export const DefaultShaderProgramOptions:ResolvedShaderProgramOptions = {
	devicePixelRatio: (window && window.devicePixelRatio) || 1,
	context: {
		premultipliedAlpha: false
	}
}