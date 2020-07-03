import type { IAppCtx } from '../../types/app-ctx'
import { Either } from '../../utils/either'
import { extractVersionTuple } from '../../utils/helpers'

type Ctx = Pick<IAppCtx, 'latestVersion' | 'public' | 'prefixReset'>

export const validatePublic = ({ latestVersion, public: isPublic, prefixReset }: Ctx) => ({
	public:
		isPublic ||
		Either.fromNullable(extractVersionTuple(latestVersion))
			.map(([_, major]) => major)
			.map(Number)
			.fold(
				() => prefixReset,
				(major) => prefixReset || major > 0,
			),
})
