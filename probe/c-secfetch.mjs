import { probe } from './_lib.mjs'

await probe('C', [
  'accept',
  'accept-language',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site'
])
