export const findPointBetweenTwo = (percent:number, x1:number, y1:number, x2:number, y2:number) => {
  return {
    x: x1 + (x2 - x1) * percent,
    y: y1 + (y2 - y1) * percent
  }
}

export default findPointBetweenTwo;