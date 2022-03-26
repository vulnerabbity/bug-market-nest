// TODO: add more
export const CategoriesList = <const>["electronics", "cars", "misc"]

// convert to unionType
export type Category = typeof CategoriesList[number]
