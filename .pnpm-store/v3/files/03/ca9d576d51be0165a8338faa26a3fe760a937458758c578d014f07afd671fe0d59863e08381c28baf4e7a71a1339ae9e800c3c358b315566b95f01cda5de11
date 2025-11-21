import { createImage } from "./image.js";
import { imageOptions } from "#build/image-options.mjs";
import { useNuxtApp, useRuntimeConfig } from "#imports";
export const useImage = (event) => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: event || nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
