<template>
  <Codemirror
    :model-value="code"
    @update:model-value="$emit('update:modelVaule', $event)"
    placeholder="Code going on here..."
    :style="{ height: '400px', width: '600px', paddingRight: '1em' }"
    :indent-with-tab="true"
    :tabSize="2"
    :extensions="extensions"
  />
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { python, localCompletionSource } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  autocompletion,
  type CompletionContext,
  type CompletionResult,
  type Completion
} from '@codemirror/autocomplete'

const props = withDefaults(defineProps<{ code?: string; callables?: string[] }>(), {
  code: 'from bgtools import example\nexample()\n',
  callables: () => []
})

const extensions = [
  python(),
  oneDark,
  autocompletion({
    override: [
      /* 默认local变量提示 */
      localCompletionSource,
      /* 自定义特殊类型提示 */
      (context: CompletionContext) => {
        const word = context.matchBefore(/.?\w+/)
        if (word?.text.startsWith('.') || (word?.from == word?.to && !context.explicit)) {
          return null
        }

        const apply = (vp: any, cp: Completion, from: number, to: number) => {
          vp.dispatch({
            changes: { from, to, insert: cp.label + '()' },
            selection: { anchor: from + cp.label.length + 1 }
          })
        }

        return {
          from: /^\w/.test(word!.text) ? word!.from : word!.from + 1,
          options: [
            ...props.callables.map((custom) => {
              return { label: custom, type: 'function', detail: 'custom function', apply }
            }),
            { label: 'User', type: 'class', info: 'uid玩家', apply },
            { label: 'user', type: 'function', info: 'ID玩家', apply },
            { label: 'Manager', type: 'class', detail: 'game manager', apply },
            { label: 'Class', type: 'class', detail: 'game class', apply },
            { label: 'Enum', type: 'class', detail: 'game enum', apply },
            { label: 'unwrap', type: 'function', detail: 'fetch or raise result', apply }
          ]
        } as CompletionResult
      },
      /* 自定义特殊类型的快捷b包装提示 */
      (context: CompletionContext) => {
        const reg = /((?:\S|(?:\(.+?\))|(?:\{.+?\})|(?:\[.+?\]))+)\.\w+$/
        const word = context.matchBefore(reg)

        if (word?.from == word?.to && !context.explicit) {
          return null
        }
        const prefix = reg.exec(word!.text)?.[1]
        const prefix_from = word!.from

        const apply = (vp: any, cp: Completion, from: number, to: number) => {
          const repl = `${cp.label}(${prefix})`
          vp.dispatch({
            changes: { from: prefix_from, to, insert: repl },
            selection: { anchor: prefix_from + repl.length }
          })
        }

        return {
          from: prefix_from + prefix!.length + 1,
          options: [
            { label: 'unwrap', type: 'function', detail: 'quick wrap', apply },
            { label: 'ok', type: 'function', detail: 'quick ok', apply }
          ],
          validFor: reg
        } as CompletionResult
      },
      /* 自定义变量声明快捷方式 */
      (context: CompletionContext) => {
        const reg = /^(\s*)((?:\S|(?:\(.+?\))|(?:\{.+?\})|(?:\[.+?\]))+)\.\w+$/
        const word = context.matchBefore(reg)

        if (word?.from == word?.to && !context.explicit) {
          return null
        }
        const r = reg.exec(word!.text)!
        const prefix = r[2]
        const prefix_from = word!.from + r[1].length

        const apply = (vp: any, cp: Completion, from: number, to: number) => {
          const repl = ` = ${prefix}`
          vp.dispatch({
            changes: { from: prefix_from, to, insert: repl },
            selection: { anchor: prefix_from }
          })
        }

        return {
          from: prefix_from + prefix!.length + 1,
          options: [{ label: 'var', type: 'keyword', detail: 'quick variable', apply }],
          validFor: reg
        } as CompletionResult
      }
    ]
  })
]
</script>
