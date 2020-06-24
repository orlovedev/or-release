import type { IAppCtx } from '../types/app-ctx'
import type { LogFunction, LogFatalError } from '../utils/logger'
import { Either } from '../utils/either'
import { tap } from '../utils/helpers'

interface IDeps {
	logSuccess: LogFunction
	logInfo: LogFunction
	httpTransport: {
		post: (
			url: string,
			options: { headers: Record<string, string>; json: Record<string, any> },
		) => Promise<any>
	}
	logFatalError: LogFatalError
}

type Ctx = Pick<
	IAppCtx,
	'token' | 'changelog' | 'newVersion' | 'repository' | 'dryRun' | 'customUrl'
>

export const publishTag = ({ logSuccess, logInfo, httpTransport, logFatalError }: IDeps) => ({
	token,
	changelog,
	newVersion,
	repository,
	customUrl,
}: Ctx) =>
	Either.fromNullable(customUrl || null)
		.map(tap((url) => logInfo`Custom URL used for publishing the tag: ${({ g }) => g(url)}`))
		.fold(() => Either.right('https://api.github.com/repos/'), Either.right)
		.map((origin) => origin.concat(repository))
		.map((origin) => origin.concat('/releases'))
		.map(async (url) => {
			try {
				await httpTransport.post(url, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					json: { tag_name: newVersion, name: newVersion, body: changelog },
				})

				logSuccess`Version ${({ g }) => g(newVersion)} successfully released! 🥂`
			} catch (error) {
				logFatalError('Could not publish the release due to the error:')(error)
			}
		})
