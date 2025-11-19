const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot]

// Allow imports from outside the project root
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(workspaceRoot, 'node_modules')
]

// Create extraNodeModules to dedupe React
const extraNodeModules = {}

// Force react, react-native to come from the app's node_modules
// This ensures a single React instance
extraNodeModules.react = path.join(projectRoot, 'node_modules/react')
extraNodeModules['react-native'] = path.join(
	projectRoot,
	'node_modules/react-native'
)

config.resolver.extraNodeModules = extraNodeModules

// Dedupe React to prevent multiple instances
config.resolver.resolveRequest = (context, moduleName, platform) => {
	// Ensure React is always resolved from the app's node_modules
	if (moduleName === 'react' || moduleName.startsWith('react/')) {
		try {
			const filePath = require.resolve(moduleName, {
				paths: [projectRoot]
			})
			return {
				type: 'sourceFile',
				filePath
			}
		} catch (e) {
			// Fall through to default resolution
		}
	}

	// Use default resolution for everything else
	return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
