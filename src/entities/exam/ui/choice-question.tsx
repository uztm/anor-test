import type {
  ChoiceQuestion as ChoiceQuestionModel,
  OptionId,
} from '../model/types'
import { Group, Radio, Stack, Text } from '@mantine/core'

interface ChoiceQuestionProps {
  question: ChoiceQuestionModel
  optionOrder?: OptionId[]
  value?: string
  onChange: (value: string) => void
}

export const ChoiceQuestion = ({
  question,
  optionOrder,
  value,
  onChange,
}: Readonly<ChoiceQuestionProps>) => {
  const order = optionOrder ?? question.options.map((option) => option.id)

  const options = order
    .map((optionId) =>
      question.options.find((option) => option.id === optionId),
    )
    .filter((option) => option !== undefined)

  return (
    <Radio.Group value={value ?? ''} onChange={onChange}>
      <Stack gap={'xs'}>
        {options.map((option) => (
          <Radio.Card
            key={option.id}
            value={option.id}
            p={'md'}
            radius={'md'}
            withBorder={true}
          >
            <Group wrap={'nowrap'} align={'center'} gap={'sm'}>
              <Radio.Indicator />
              <Text size={'sm'}>{option.text}</Text>
            </Group>
          </Radio.Card>
        ))}
      </Stack>
    </Radio.Group>
  )
}
