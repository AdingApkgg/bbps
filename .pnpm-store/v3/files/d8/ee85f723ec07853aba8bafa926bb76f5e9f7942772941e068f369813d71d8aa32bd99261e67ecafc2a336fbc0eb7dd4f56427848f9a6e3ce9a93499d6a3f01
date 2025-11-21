import { createImage } from "../../image.js";
import { imageOptions } from "#internal/nuxt-image";
import { useRuntimeConfig } from "#imports";
export const useImage = (event) => {
  const config = useRuntimeConfig();
  return createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    },
    event,
    runtimeConfig: config
  });
};
