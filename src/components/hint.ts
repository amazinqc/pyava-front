import type {
  Completion,
  CompletionContext,
  CompletionResult,
  CompletionSource
} from '@codemirror/autocomplete'

type CompletionSourceFactory = (options?: Completion[]) => CompletionSource

export const preKeyComplete: CompletionSourceFactory =
  (options?: Completion[]) => (context: CompletionContext) => {
    const reg = /^(\s*)((?:\S|(?:\(.+?\))|(?:\{.+?\})|(?:\[.+?\]))*)\.\w+$/
    const word = context.matchBefore(reg)

    if (word?.from == word?.to && !context.explicit) {
      return null
    }
    const r = reg.exec(word!.text)!
    const prefix = r[2]
    const prefix_from = word!.from + r[1].length

    return {
      from: prefix_from + prefix!.length + 1,
      options,
      validFor: reg
    } as CompletionResult
  }
