export const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Ajmer", "Aligarh", "Allahabad", "Amravati", "Amritsar",
  "Asansol", "Aurangabad", "Bareilly", "Belgaum", "Bengaluru", "Bhavnagar",
  "Bhilai", "Bhiwandi", "Bhopal", "Bhubaneswar", "Bikaner", "Bilaspur",
  "Chandigarh", "Chennai", "Coimbatore", "Cuttack", "Dehradun", "Delhi",
  "Dhanbad", "Durgapur", "Erode", "Faridabad", "Firozabad", "Ghaziabad",
  "Gorakhpur", "Greater Noida", "Gulbarga", "Guntur", "Gurgaon", "Gurugram",
  "Guwahati", "Gwalior", "Haldia", "Hisar", "Howrah", "Hubli-Dharwad",
  "Hyderabad", "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu",
  "Jamnagar", "Jamshedpur", "Jhansi", "Jodhpur", "Kakinada", "Kalyan-Dombivli",
  "Kanpur", "Karnal", "Kochi", "Kolhapur", "Kolkata", "Kollam", "Kota",
  "Kozhikode", "Kurnool", "Lucknow", "Ludhiana", "Madurai", "Mangalore",
  "Mathura", "Meerut", "Moradabad", "Mumbai", "Mysuru", "Nagpur", "Nanded",
  "Nashik", "Navi Mumbai", "Nellore", "Noida", "Panaji", "Patiala", "Patna",
  "Pimpri-Chinchwad", "Pondicherry", "Pune", "Raipur", "Rajahmundry", "Rajkot",
  "Ranchi", "Rourkela", "Saharanpur", "Salem", "Sangli", "Shimla", "Siliguri",
  "Solapur", "Srinagar", "Surat", "Thane", "Thiruvananthapuram", "Thrissur",
  "Tiruchirappalli", "Tirunelveli", "Tirupati", "Tiruppur", "Udaipur", "Ujjain",
  "Vadodara", "Varanasi", "Vasai-Virar", "Vellore", "Vijayawada", "Visakhapatnam",
  "Warangal",
];

const CITY_SET = new Set(INDIAN_CITIES.map((c) => c.toLowerCase()));

export function isKnownCity(name: string): boolean {
  return CITY_SET.has(name.trim().toLowerCase());
}
