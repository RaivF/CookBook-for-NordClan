import { RecipeEntity } from '../../../store/types'
import style from '../styles/UserCard.module.css'

type RecipeCardProps = {
	data: RecipeEntity
}

const RecipeCard = (props: RecipeCardProps) => {
	const { recipe_name, detailed_info } = props.data
	const mainIngr = detailed_info.ingredients

	return (
		<>
			<div className={style.card}>
				<div className={style.imgProfileContainer}>
					<img
						className={style.imgProfile}
						src={props.data.preview}
						alt={recipe_name}
					/>
				</div>
				<span className={style.cardInfo}>{recipe_name}</span>
				<div className={style.cardDescription}>
					<p>Основные ингредиенты:</p>
					{mainIngr.slice(0, 4).map((ingredient, index: number) => (
						<p key={index}>{ingredient.name}</p>
					))}
				</div>
				<div>
					<span>нравится: </span>
					<span>{detailed_info.likedUsers.length}</span>
				</div>

				<div className={style.difficulty}>
					<span>Сложность:</span>
					<span>{detailed_info.difficulty}</span>
				</div>
			</div>
		</>
	)
}

export default RecipeCard
