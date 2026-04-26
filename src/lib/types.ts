export type Ownership = "Individual" | "Corporate";
export type FuelType = "Petrol" | "Diesel" | "CNG" | "EV";
export type IDVPref = "Low" | "Market" | "High";
export type Tier = "High" | "Medium" | "Low Quality";
export type VahanStatus = "idle" | "loading" | "ok" | "fail";

export type VehicleData = {
  make: string;
  model: string;
  variant: string;
  manufacture_year: number;
  fuel_type: FuelType;
};

export type FormState = {
  step: number;
  ownership: Ownership;
  reg_number: string;
  vahan_status: VahanStatus;
  make: string;
  model: string;
  variant: string;
  manufacture_year: string;
  fuel_type: FuelType | "";
  cng_kit: "Yes" | "No";
  city_of_registration: string;
  previous_policy_expiry_date: string;
  ncb_percentage: string;
  claims_in_last_3_years: "0" | "1" | "2" | "3+";
  break_in: boolean;
  idv_preference: IDVPref;
  full_name: string;
  mobile_number: string;
  email_address: string;
  honeypot: string;
  start_ts: number;
  risk_score: number;
  risk_signals: string[];
  risk_tier: Tier | null;
  quote: Quote | null;
  loading_label: string | null;
};

export type Quote = {
  idv: number;
  od: number;
  tp: number;
  total: number;
  lo: number;
  hi: number;
  ncb_applied: number;
  insurers: { name: string; price: number }[];
  generic?: boolean;
};

export const initialState: FormState = {
  step: 1,
  ownership: "Individual",
  reg_number: "",
  vahan_status: "idle",
  make: "",
  model: "",
  variant: "",
  manufacture_year: "",
  fuel_type: "",
  cng_kit: "No",
  city_of_registration: "",
  previous_policy_expiry_date: "",
  ncb_percentage: "",
  claims_in_last_3_years: "0",
  break_in: false,
  idv_preference: "Market",
  full_name: "",
  mobile_number: "",
  email_address: "",
  honeypot: "",
  start_ts: 0,
  risk_score: 0,
  risk_signals: [],
  risk_tier: null,
  quote: null,
  loading_label: null,
};
