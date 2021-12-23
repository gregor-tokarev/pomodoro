export function sameAsField(fieldName: string) {
  return (value: string, siblings: any) => value === siblings[fieldName]
}
