/**
 * @example
 *
 * ```ts
 * mapRange(0, 1, 11) // => 1
 * mapRange(0.1, 1, 11) // => 2
 * mapRange(0.2, 1, 11) // => 3
 * mapRange(1, 1, 11) // => 11
 * ```
 *
 * @param value
 * @param start
 * @param end
 * @returns
 */
export function mapRange(value: number, start: number, end: number) {
  const len = end - start

  return start + value * len
}
