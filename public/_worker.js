export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 非 30hb.cn 的访问全部 301 重定向
    if (url.hostname !== '30hb.cn') {
      url.hostname = '30hb.cn'
      return Response.redirect(url.toString(), 301)
    }

    // 正常请求交给 Pages 处理
    return env.ASSETS.fetch(request)
  }
}
