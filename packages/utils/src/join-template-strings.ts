import { memo } from './memo'

export const joinTemplateStrings = memo(
	(strings: TemplateStringsArray['raw']) => {
		return strings.join('${var}')
	}
)
