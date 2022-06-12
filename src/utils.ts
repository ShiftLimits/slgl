import { TUnionToIntersection } from './types'

export function deepMerge<T extends { [key:string]: any }[]>(...sources:T):TUnionToIntersection<T[number]> {
	const target:any = {}

	for (let source of sources) {
		for (let property in source) {
			let value = source[property]
			if (typeof value == 'object' && value !== null) {
				target[property] = deepMerge(target[property] || {}, source[property])
			} else {
				target[property] = value
			}
		}
	}

	return target
}
