import { useEffect, useState } from 'react'
import { searchRecipes } from './Search'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { FindingRecipeList } from './RecipeList'
import { thunks } from '../../store/cardsSlice'
import { Header } from '../../components/Layout/Header'

import style from './styles/Search.module.css'
import { RecipeEntity } from '../../store/types'

export const SearchList = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(thunks.getData())
	}, [dispatch])
	const { list } = useAppSelector(state => state.cards)

	const [query, setQuery] = useState('')
	const [filteredRecipes, setFilteredRecipes] = useState<RecipeEntity[]>([])

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
		setFilteredRecipes(searchRecipes(list, e.target.value))
	}

	return (
		<div>
			<Header>
				<div className={style.content}>
					<h1>Поиск по рецептам</h1>

					<div className={style.description}>
						<p>начните вводить и мы постараемся найти совпадения во всех</p>
					</div>
				</div>
			</Header>
			<div className={style.container}>
				<input
					className={style.searchInput}
					type='text'
					value={query}
					onChange={handleSearch}
					placeholder='Поиск рецептов...'
				/>
				<FindingRecipeList recipes={filteredRecipes} />
			</div>
		</div>
	)
}
