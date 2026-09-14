import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import netlify from '@netlify/vite-plugin'

// The Netlify plugin only matters for the production build. Inside the persistent
// dev runtime it loads an emulation layer that breaks `vite dev`, so it is skipped
// there (FLUXIO_REPO is only set inside the runtime container).
const inDevRuntime = process.env.FLUXIO_REPO !== undefined

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    host: true,
    // Served through the Coolify proxy on an external domain; Vite blocks
    // unknown hosts by default and would answer 403.
    allowedHosts: true,
    hmr: { clientPort: 443, protocol: 'wss' },
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    ...(inDevRuntime ? [] : [netlify()]),
  ],
})

export default config
