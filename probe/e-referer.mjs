import { probe } from './_lib.mjs'

await probe('E', [
  'accept',
  'accept-language',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'referer'
])
