/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PADDLE_CLIENT_TOKEN: string
  readonly VITE_PADDLE_PRO_PRICE_ID: string
  readonly VITE_PADDLE_MAX_PRICE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
