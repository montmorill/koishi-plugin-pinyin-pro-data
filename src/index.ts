import type { Context } from 'koishi'
import CharsDict from '@pinyin-pro/data/chars'
import CompleteDict from '@pinyin-pro/data/complete'
import ModernDict from '@pinyin-pro/data/modern'
import { Schema } from 'koishi'
import {} from 'koishi-plugin-pinyin-pro'

export const name = 'pinyin-pro-data'
export const inject = ['pinyin-pro']

export interface Config {
  prefix: string
  chars: boolean
  complete: boolean
  modern: boolean
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    prefix: Schema.string().default('koishi-plugin-pinyin-pro-data-').description('字典前缀。'),
  }),
  Schema.object({
    chars: Schema.boolean().default(true).description('部分补充生僻字字典。'),
    complete: Schema.boolean().default(true).description('jieba 中文分词库词语拼音合集。'),
    modern: Schema.boolean().default(true).description('《现代汉语词典》（第7版）词语拼音合集。'),
  }).description('字典设置'),
])

export function apply(ctx: Context, config: Config) {
  config.chars && ctx['pinyin-pro'].addDict(CharsDict, { name: `${config.prefix}chars` })
  config.complete && ctx['pinyin-pro'].addDict(CompleteDict, { name: `${config.prefix}complete` })
  config.modern && ctx['pinyin-pro'].addDict(ModernDict, { name: `${config.prefix}modern` })
  return () => {
    ctx['pinyin-pro'].removeDict(`${config.prefix}chars`)
    ctx['pinyin-pro'].removeDict(`${config.prefix}complete`)
    ctx['pinyin-pro'].removeDict(`${config.prefix}modern`)
  }
}
