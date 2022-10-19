/**
 * https://www.wikiwand.com/en/Pseudorandom_number_generator#/Implementation
 *
 * Pseudo random
 *
 * @example
 * ```ts
 * const random = Random(10)
 * random() // => 0.9417890602847239
 * random() // => 0.722160604293402
 *
 * const random2 = Random(-10)
 * random2() // => 0.9417890602847239
 * ```
 *
 * @param seed
 */
export function Random(seed = 0) {
  seed = Math.abs(seed)

  return () => {
    const a = seed * 15485863
    seed++
    return ((a * a * a) % 2038074743) / 2038074743
  }
}
