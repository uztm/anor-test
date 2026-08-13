import { useState } from 'react'

export interface IUseSelectionHandlerReturn {
  hasKey: (key: string) => boolean
  selections: string[]
  resetSelections: () => void
  onRemoveKey: (key: string) => void
  onAddKey: (value: string) => void
}

export function useSelectionHandler(): IUseSelectionHandlerReturn {
  const [selections, setSelections] = useState<string[]>([])

  const onAddKey = (value: string) => {
    setSelections((prev) => {
      const newArr = [...prev]
      if (!newArr.includes(value.toString())) {
        newArr.push(value.toString())
      }
      return newArr
    })
  }

  const onRemoveKey = (key: string) => {
    setSelections((prev) => {
      const newArr = [...prev]
      if (newArr.includes(key.toString())) {
        return newArr.filter((item) => item !== key.toString())
      }
      return newArr
    })
  }

  const hasKey = (key: string): boolean => selections.includes(key.toString())

  const resetSelections = () => setSelections([])

  return {
    selections,
    hasKey,
    resetSelections,
    onRemoveKey,
    onAddKey,
  }
}
