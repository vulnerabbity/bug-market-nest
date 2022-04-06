// version 1.2.3
export const CategoriesList = <const>[
  // machines
  "cars",
  "carsParts",
  "carsEquipment",

  "realEstate",

  // electronics
  "electronics",
  "smartphones",
  "headphones",
  "computers",
  "commutersEquipment",
  "laptops",
  "photoVideoEquipment",
  "audioDevices",
  "networkDevices",

  // furniture
  "furniture",
  "houseAppliances",

  // humans
  "service",
  "vacancy",
  "resume",
  "handmade",

  "clothes",

  //hobby
  "hobby",
  "sport",
  "musicInstruments",

  "childrenGoods",

  "animals",

  "other"
]

// convert to unionType
export type Category = typeof CategoriesList[number]
