export type Update<T> = {
  id: string
  changes: Partial<T>
}
