import type { Unary } from '../types/common-types'

export const execWith = (exec: (cmd: string) => string) => (cmd: string) => () => exec(cmd)

export const extendWith = <TArg extends Record<string, any>, TResult = TArg>(
	f: Unary<TArg, TResult>,
) => (object: TArg): TArg & TResult =>
	({
		...object,
		...(f(object) || {}),
	} as any)

export const trimCmdNewLine = (string: string) => string.replace(/\n$/, '')

export const errorToString = (error: Error) =>
	`  → ${error.message.replace('\n', '').replace(/\s{2,}/g, ' ')}`

export const tap = <TArg>(f: Unary<TArg, any>) => (x: TArg): TArg => {
	f(x)

	return x
}

export const extractVersionTuple = (versionString: string) =>
	/\.?(\d+)\.?(\d+)?\.?(\d+)?/.exec(versionString)
