export interface RecipeEntity {
	id: string
	created: string
	recipe_name: string
	preview: string
	detailed_info: {
		description: string
		likedUsers: [string]
		cooking_steps: string[]
		ingredients: Ingredient[]
		difficulty: string
	}
}

export type Ingredient = {
	name: string
	alternatives: string[]
}
export type userLoginType = {
	isLogged: boolean
	login: string
}

export type IError = {
	message: string
	code: number
}

export interface InitialState {
	CurrentPeople: RecipeEntity[]
	list: RecipeEntity[]
	isLoading: boolean
	error: IError | null
}
