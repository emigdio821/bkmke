import type { UndefinedInitialDataOptions } from '@tanstack/react-query'

export type QueryOptionsWithoutKeyAndFn<TData> = Omit<UndefinedInitialDataOptions<TData>, 'queryKey' | 'queryFn'>
