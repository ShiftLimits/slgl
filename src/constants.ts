import { ResolvedShaderCanvasOptions } from './types'

export const DefaultShaderCanvasOptions:ResolvedShaderCanvasOptions = {
	devicePixelRatio: (window && window.devicePixelRatio) || 1,
	context: {
		premultipliedAlpha: false
	}
}