export interface City {
  name: string
  postalCode: string
  department: string
  lat: number
  lng: number
  isMain?: boolean
}

export const cities: City[] = [
  { name: "Neuilly-sur-Seine", postalCode: "92200", department: "Hauts-de-Seine", lat: 48.8848, lng: 2.2685, isMain: true },
  { name: "Courbevoie", postalCode: "92400", department: "Hauts-de-Seine", lat: 48.8971, lng: 2.2564 },
  { name: "Levallois-Perret", postalCode: "92300", department: "Hauts-de-Seine", lat: 48.8943, lng: 2.2878 },
  { name: "Puteaux", postalCode: "92800", department: "Hauts-de-Seine", lat: 48.8847, lng: 2.2398 },
  { name: "Nanterre", postalCode: "92000", department: "Hauts-de-Seine", lat: 48.8924, lng: 2.2070 },
  { name: "Boulogne-Billancourt", postalCode: "92100", department: "Hauts-de-Seine", lat: 48.8352, lng: 2.2410 },
  { name: "Issy-les-Moulineaux", postalCode: "92130", department: "Hauts-de-Seine", lat: 48.8234, lng: 2.2746 },
  { name: "Suresnes", postalCode: "92150", department: "Hauts-de-Seine", lat: 48.8714, lng: 2.2264 },
  { name: "Rueil-Malmaison", postalCode: "92500", department: "Hauts-de-Seine", lat: 48.8773, lng: 2.1879 },
  { name: "Asnières-sur-Seine", postalCode: "92600", department: "Hauts-de-Seine", lat: 48.9178, lng: 2.2855 },
  { name: "Clichy", postalCode: "92110", department: "Hauts-de-Seine", lat: 48.9033, lng: 2.3092 },
  { name: "Colombes", postalCode: "92700", department: "Hauts-de-Seine", lat: 48.9218, lng: 2.2531 },
  { name: "Gennevilliers", postalCode: "92230", department: "Hauts-de-Seine", lat: 48.9261, lng: 2.2957 },
  { name: "Chatou", postalCode: "78400", department: "Yvelines", lat: 48.8913, lng: 2.1612 },
  { name: "Paris 16e", postalCode: "75016", department: "Paris", lat: 48.8635, lng: 2.2759 },
  { name: "Paris 17e", postalCode: "75017", department: "Paris", lat: 48.8864, lng: 2.3128 },
  { name: "Paris 8e", postalCode: "75008", department: "Paris", lat: 48.8754, lng: 2.3109 },
  { name: "Garches", postalCode: "92380", department: "Hauts-de-Seine", lat: 48.8433, lng: 2.1841 },
  { name: "Vaucresson", postalCode: "92420", department: "Hauts-de-Seine", lat: 48.8315, lng: 2.1578 },
  { name: "La Garenne-Colombes", postalCode: "92250", department: "Hauts-de-Seine", lat: 48.9084, lng: 2.2467 },
]

export const mainInterventionZone = {
  center: { lat: 48.8848, lng: 2.2685 },
  radius: 30,
}
