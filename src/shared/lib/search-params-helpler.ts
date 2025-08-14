export const transformToNumber = (value: string) => {
  return parseInt(value)
}
export const transformToBoolean = (value: string) => {
  return value === "true"
}
export const transformToArray = (value: string | string[]) => {
  if (typeof value === "string") {
    return [value]
  }
  return value
}
