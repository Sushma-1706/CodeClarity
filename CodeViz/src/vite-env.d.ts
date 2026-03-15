/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GROK_API_KEY?: string;
	readonly VITE_GROK_MODEL?: string;
	readonly VITE_SANDBOX_API_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
