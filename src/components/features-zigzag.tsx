'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getDictionary } from '@/lib/i18n'
import { ASSETS } from '@/lib/assets'
import { FadeIn } from '@/components/motion'

const FEATURE_IMAGES = [ASSETS.hero, ASSETS.commands, ASSETS.community, ASSETS.builder]

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
        <Image
          src={image}
          alt={item.heading}
          width={600}
          height={400}
          /* md 起是 12 栏里的 5~6 栏，窄屏是通栏 */
          sizes="(min-width: 768px) 48vw, 100vw"
          className="mx-auto h-auto max-w-full "
        />
      </FadeIn>

      {/* 文字 */}
      <FadeIn
        direction={reverse ? 'left' : 'right'}
        delay={index * 0.05 + 0.1}
        className="mx-auto max-w-xl md:col-span-7 md:max-w-none lg:col-span-6"
      >
        <div className={reverse ? 'md:pr-4 lg:pr-12 xl:pr-16' : 'md:pl-4 lg:pl-12 xl:pl-16'}>
          <h3 className="mb-2 text-title-lg">{item.heading}</h3>
          <p className="mb-3 text-body-02 text-on-surface-medium">{item.description}</p>
          <ul className="space-y-2 text-on-surface-medium">
            {item.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-success" />
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
      <div className="container-page py-12 md:py-20">
        {/* 标题 */}
        <FadeIn className="pb-10 md:pb-16">
          <h2 className="text-title-lg">{dict.features.title}</h2>
          <p className="mt-1 text-body-02 text-on-surface-medium">{dict.features.subtitle}</p>
        </FadeIn>

        {/* 交错排列的 feature 行 */}
        <div className="space-y-12 md:space-y-20">
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
