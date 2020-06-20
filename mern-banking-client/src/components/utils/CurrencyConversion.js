export const convertionTypes = {
  CADtoMXN: "CADtoMXN",
  MXNtoCAD: "MXNtoCAD",
  CADtoUSD: "CADtoUSD",
  USDtoCAD: "USDtoCAD",
};
export const currencyTypes = {
  CAD: "CAD",
  MXN: "MXN",
  USD: "USD",
};
export function currencyConvert(type, amount) {
  console.log(" currencyConvert", type);
  switch (type) {
    case convertionTypes.CADtoMXN: {
      console.log(" CADtoMXN", amount * 10);
      return amount * 10;
    }
    case convertionTypes.MXNtoCAD: {
      console.log(" CADtoMXN", amount / 10);
      return amount / 10;
    }
    case convertionTypes.CADtoUSD: {
      return amount * 0.5;
    }
    case convertionTypes.USDtoCAD: {
      return amount / 0.5;
    }
    default: {
      return amount;
    }
  }
}
