import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'

/** @type {import("eslint").Linter.Config[]} */
export default [...nextConfig, ...coreWebVitals]
