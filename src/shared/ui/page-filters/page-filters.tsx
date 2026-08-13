import { useSearchRequestParams } from 'shared/lib'
import type { PageableRequestParams } from 'shared/types'

import cn from './filter-fields.module.css'

import { FilterField } from './filter-field'
import { getInitialValues, parseData, resetValues } from './model/helpers'
import type { PageFiltersField } from './model/types'
import { Button, Card, Group, Stack } from '@mantine/core'
import type { FormValidateInput } from '@mantine/form'
import { useForm } from '@mantine/form'
import { RiDeleteBackLine, RiSearchLine } from '@remixicon/react'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface IFilterFieldComponentProps<T> {
  fields: PageFiltersField<T>[]
  mode?: 'controlled' | 'uncontrolled'
  onBeforeFilter?: (data: T) => T
  onFilter?: (data: T) => void
  isLoading?: boolean
  validate?: FormValidateInput<T>
}

export const PageFilters = <T extends object>({
  fields,
  mode = 'uncontrolled',
  onBeforeFilter,
  onFilter,
  isLoading,
  validate,
}: Readonly<IFilterFieldComponentProps<T>>) => {
  const { t } = useTranslation()
  const [formKey, setFormKey] = React.useState(0)
  const { searchParams, resetSearchParams, setSearchParams } =
    useSearchRequestParams<PageableRequestParams & T>()
  const initialValues = getInitialValues<T>(searchParams, fields)

  const form = useForm<T>({
    mode,
    validate,
    initialValues,
  })

  const resetFields = () => {
    form.setValues(resetValues(fields))
    resetSearchParams()
    setFormKey((k) => k + 1)
  }
  const handleFilter = (data: T) => {
    const parsedData = onBeforeFilter
      ? onBeforeFilter(structuredClone(data))
      : data
    if (onFilter) onFilter(parsedData)
    else setSearchParams(parseData(parsedData))
  }

  return (
    <Card mb={'xl'}>
      <form onSubmit={form.onSubmit(handleFilter)} key={formKey}>
        <Stack>
          <div className={classNames(cn.grid)}>
            {fields.map((field, index) => {
              const key = `${String(field.field)}${index}`
              return <FilterField key={key} field={field} form={form} />
            })}
          </div>

          <Group justify={'flex-end'}>
            <Button
              leftSection={<RiDeleteBackLine />}
              onClick={resetFields}
              type={'reset'}
              variant={'default'}
            >
              {t('clear')}
            </Button>
            <Button
              variant="filled"
              type="submit"
              leftSection={<RiSearchLine />}
              loading={isLoading}
              disabled={isLoading}
            >
              {t('search')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}
