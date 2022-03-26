// TODO: add more
export const CategoriesList = <const>["electronics", "cars", "other"]

// convert to unionType
export type Category = typeof CategoriesList[number]
