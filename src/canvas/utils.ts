/**
 *
 * @param ctx  default is `#fff`
 * @param color
 */
export function clear(ctx: CanvasRenderingContext2D, color = '#fff') {
  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.fillStyle = color
  ctx.clearRect(0, 0, w, h)
}
