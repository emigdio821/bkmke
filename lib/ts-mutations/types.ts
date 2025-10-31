import type { MutationOptions } from '@tanstack/react-query'

export type MutationOptionsWithoutKeyAndFn<TData> = Omit<MutationOptions<TData>, 'mutationKey' | 'mutationFn'>
