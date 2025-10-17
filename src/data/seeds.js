export const SEED_PARTNERSHIPS = [
  {
    id: "6555e6ac2f08325dca9b5e6c",
    name: "Chooose Demo",
    currency: "USD",
    portalUrl: "https://cdemo.test.portal.chooose.today",
    features: [
      "Flights_FromTo",
      "Flights_ByDistance",
      "Flights_Upload",
      "Carbon",
      "EmissionsDashboard",
      "EmissionCompensate_Flights",
      "EmissionCompensate_AirFreight",
    ],
    itemFeePercent: 15.0,
    instantBilling: false,
  },
  {
    id: "682fa8c19340de8ea5338e8a",
    name: "Chooose SAF Demo",
    currency: "USD",
    portalUrl: "https://safdemo.test.portal.chooose.today",
    features: [
      "EmissionsDashboard",
      "EmissionCompensate",
      "EmissionCompensate_AirFreight",
    ],
    itemFeePercent: 0.0,
    instantBilling: true,
  },
];