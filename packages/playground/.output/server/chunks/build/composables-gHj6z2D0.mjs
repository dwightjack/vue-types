import { a as useNuxtApp, v as vueExports } from './server.mjs';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';

function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (vueExports.hasInjectionContext()) {
      const head = vueExports.inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}

export { useHead as u };
//# sourceMappingURL=composables-gHj6z2D0.mjs.map
