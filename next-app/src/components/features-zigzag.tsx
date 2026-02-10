'use client'

import { Check } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { ASSETS } from '@/lib/assets'
import { FadeIn } from '@/components/motion'

/** 每个 feature 对应的配图 */
const FEATURE_IMAGES = [
  ASSETS.commander,
  ASSETS.hammerman,
  ASSETS.creativeSlides[0],
  ASSETS.island
]

interface FeatureItem {
  heading: string
  description: string
  bullets: string[]
}

function FeatureRow({
  item,
  image,
  reverse,
  index
}: {
  item: FeatureItem
  image: string
  reverse: boolean
  index: number
}) {
  return (
    <div className="items-center gap-8 md:grid md:grid-cols-12 md:gap-12">
      {/* 图片 */}
      <FadeIn
        direction="up"
        delay={index * 0.05}
        className={`mx-auto mb-8 max-w-xl md:col-span-5 md:mb-0 lg:col-span-6 ${
          reverse ? '' : 'md:order-1'
        }`}
      >
        <img
          src={image}
          alt={item.heading}
          loading="lazy"
          className="mx-auto h-auto max-w-full rounded-lg shadow-lg"
        />
      </FadeIn>

      {/* 文字 */}
      <FadeIn
        direction={reverse ? 'left' : 'right'}
        delay={index * 0.05 + 0.1}
        className="mx-auto max-w-xl md:col-span-7 md:max-w-none lg:col-span-6"
      >
        <div className={reverse ? 'md:pr-4 lg:pr-12 xl:pr-16' : 'md:pl-4 lg:pl-12 xl:pl-16'}>
          <h3 className="mb-3 text-2xl font-bold tracking-tight">
            {item.heading}
          </h3>
          <p className="mb-4 text-lg text-muted-foreground">
            {item.description}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-green-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  )
}

export function FeaturesZigzag() {
  const locale = useLocale()
  const dict = getDictionary(locale)
  const items = dict.features.items as FeatureItem[]

  return (
    <section className="border-b">
      <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
        {/* 标题 */}
        <FadeIn className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {dict.features.subtitle}
          </p>
        </FadeIn>

        {/* 交错排列的 feature 行 */}
        <div className="space-y-16 md:space-y-24">
          {items.map((item, i) => (
            <FeatureRow
              key={i}
              item={item}
              image={FEATURE_IMAGES[i % FEATURE_IMAGES.length]}
              reverse={i % 2 === 1}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
