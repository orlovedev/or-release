import type { IAppCtx } from '../types/app-ctx'
import type { BumpKey } from '../types/common-types'
import type { LogFunction } from '../utils/logger'
import { Either } from '../utils/either'
import { tap } from '../utils/helpers'

interface IDeps {
	key: BumpKey
	logInfo: LogFunction
}

type Ctx = Pick<IAppCtx, 'commitList' | 'conventions' | BumpKey>

export const forceBumping = ({ key, logInfo }: IDeps) => (ctx: Ctx) => ({
	[key]: Either.right(ctx.commitList)
		.chain((commits) =>
			Either.fromNullable(
				ctx.conventions.find((convention) => convention.bumps === key.slice(4).toLowerCase()),
			).chain((convention) =>
				Either.fromNullable(
					commits.filter((commit) =>
						convention.match.some((match) => new RegExp(match).test(commit.type)),
					),
				).map(
					tap(
						(commits) =>
							/* istanbul ignore next */
							logInfo`${key.slice(4)} level changes: ${({ g }) => g(commits.length)}`,
					),
				),
			),
		)
		.fold(
			() => ctx[key],
			(commits) => commits.length > 0,
		),
})
