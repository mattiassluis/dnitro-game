let cachedConfig = {}
export function getRuntimeConfig () {
  if (cachedConfig.length) return cachedConfig

  cachedConfig = Object.assign(process.env, window.consoleEnv)
  return cachedConfig
}
