import type { VehicleData } from "./types";

export const VAHAN_DB: Record<string, VehicleData> = {
  DL09CA1234: {
    make: "Maruti Suzuki",
    model: "Swift",
    variant: "VXi (1197cc)",
    manufacture_year: 2019,
    fuel_type: "Petrol",
  },
  MH12AB4521: {
    make: "Hyundai",
    model: "Creta",
    variant: "SX(O) (1493cc)",
    manufacture_year: 2021,
    fuel_type: "Diesel",
  },
  KA05MN9090: {
    make: "Tata",
    model: "Nexon",
    variant: "XZ+ (1199cc)",
    manufacture_year: 2022,
    fuel_type: "Petrol",
  },
  TN10BB7777: {
    make: "Maruti Suzuki",
    model: "WagonR",
    variant: "LXi CNG (998cc)",
    manufacture_year: 2020,
    fuel_type: "CNG",
  },
  UP14EV1010: {
    make: "Tata",
    model: "Nexon EV",
    variant: "XZ+ Lux",
    manufacture_year: 2023,
    fuel_type: "EV",
  },
};

export const SAMPLE_REGS = Object.keys(VAHAN_DB);
