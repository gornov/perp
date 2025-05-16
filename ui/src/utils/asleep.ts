export default async function asleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
