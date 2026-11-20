// 探针公共件：只负责发请求并打印状态码
const U = process.env.U
const UA = process.env.UA

const BASE = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-ch-ua':
    '"Chromium";v="131", "Not_A Brand";v="24", "Google Chrome";v="131"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  referer: 'https://blog.30hb.cn/'
}

/** 只取指定 key，带 UA 发一次，打印状态码与前 80 字符 */
export async function probe(name, keys) {
  const headers = { 'User-Agent': UA }
  for (const k of keys) headers[k] = BASE[k]
  try {
    const res = await fetch(U, { headers })
    console.log(`${name} status=${res.status} body=${(await res.text()).slice(0, 60)}`)
  } catch (err) {
    console.log(`${name} THROW ${err.message}`)
  }
}
