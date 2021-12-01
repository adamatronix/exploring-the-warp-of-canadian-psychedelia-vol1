export const polarToCartesian = (centerX:number, centerY:number, angle:number, radius:number) => {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius
  }
}

export default polarToCartesian;