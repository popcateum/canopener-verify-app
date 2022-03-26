import '@/assets/scss/common.scss';
import App from '@/App.svelte';

declare global {
	interface Window {
		ethereum: any,
	}
}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;