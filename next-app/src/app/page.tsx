export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-bb-text">
          蚕豆海岛私服
        </h1>
        <p className="mt-4 text-bb-text-light">
          Next.js + shadcn/ui 脚手架已就绪。运行 <code className="rounded bg-bb-bg px-2 py-1">pnpm dev</code> 启动开发。
        </p>
        <p className="mt-2 text-sm text-bb-text-light">
          使用 <code className="rounded bg-bb-bg px-2 py-1">npx shadcn@latest add button card</code> 添加组件。
        </p>
      </div>
    </main>
  )
}
