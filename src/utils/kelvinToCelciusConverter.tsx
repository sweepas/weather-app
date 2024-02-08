export default function kelvinToCelciusConverter(tempInKelvim: number): number {
  const tempInCelcius = tempInKelvim - 273.15;
  return Math.floor(tempInCelcius);
}
