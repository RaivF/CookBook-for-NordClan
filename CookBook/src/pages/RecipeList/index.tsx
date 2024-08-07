import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { useAppDispatch, useAppSelector } from '../../store/store'
import style from './styles/UsersList.module.css'
import { actionsCard, thunks } from '../../store/cardsSlice'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Layout/Header'
import UserCard from './components/UserCard'
import { RecipeEntity } from '../../store/types'
import { DeleteRecipe } from '../../store/cardsSlice/api'
import { likeRecipe, unLikeRecipe } from '../../store/sessionSlice/api'

// Set the app element for accessibility
Modal.setAppElement('#root')

export const UsersList: React.FC = () => {
	const dispatch = useAppDispatch()
	const { list } = useAppSelector(state => state.cards)
	const token = useAppSelector(state => state.session.sessionInfo.token)
	const userName = useAppSelector(state => state.session.sessionInfo.userName)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const navigate = useNavigate()
	useEffect(() => {
		dispatch(thunks.getData())
	}, [])

	const goToAbout = (e: string) => {
		navigate(`/recipe/${e}`)
	}
	const edit = (e: string) => {
		navigate(`/edit/${e}`)
	}
	const handleClickDelete = (id: string) => {
		setSelectedId(id)
		setModalIsOpen(true)
	}

	const handleDelete = async () => {
		if (selectedId) {
			dispatch(actionsCard.deleteCard({ id: selectedId }))
			const response = await DeleteRecipe(selectedId)
			console.log(response)
			setModalIsOpen(false)
			setSelectedId(null)
		}
	}

	const closeModal = () => {
		setModalIsOpen(false)
		setSelectedId(null)
	}
	const clickHandlerLike = async (id: string, userName: string) => {
		await likeRecipe(id, userName)
		dispatch(thunks.getData())
	}
	const clickHandlerUnLike = async (id: string, userName: string) => {
		await unLikeRecipe(id, userName)
		dispatch(thunks.getData())
	}
	

	return (
		<div>
			<Header>
				<div className={style.content}>
					<h1>Наши рецепты</h1>

					<div className={style.description}>
						<p>Это прекрасные рецепты от лучших поваров</p>
					</div>
				</div>
			</Header>

			<div className={style.containerCardList}>
				<section className={style.actions}>
					<div className={style.search}>
						<button onClick={() => navigate('/search')}>
							<img src='./lupa.png' alt='' />
						</button>
						<span>поиск</span>
					</div>
					{token && (
						<div className={style.createNewRecipe}>
							<span>создать новый рецепт</span>
							<button onClick={() => navigate('/recipeForm')}>
								<img src='./plus.png' alt='' />
							</button>
						</div>
					)}
				</section>

				{list?.map((data: RecipeEntity) => (
					<div className={style.mainContainerRecipe} key={data.id}>
						<div
							className={style.cardContainer}
							onClick={() => goToAbout(data.id)}
						>
							<UserCard data={data} />
						</div>
						{userName === data.created && (
							<button
								className={style.deleteButton}
								onClick={() => handleClickDelete(data.id)}
							>
								<div>D</div> <div>E</div> <div>L</div>
							</button>
						)}
						{userName === data.created && (
							<button
								className={style.editButton}
								onClick={() => edit(data.id)}
							>
								<div>E</div> <div>D</div> <div>I</div> <div>T</div>
							</button>
						)}
						{token && (
							<div className={style.likesContainer}>
								{data.detailed_info.likedUsers.includes(userName) && (
									<img
										onClick={() => {
											clickHandlerUnLike(data.id, userName)
										}}
										className={style.heart}
										src='/heartYes.png'
										alt='likes'
									/>
								)}
								{!data.detailed_info.likedUsers.includes(userName) && (
									<img
										onClick={() => {
											clickHandlerLike(data.id, userName)
										}}
										className={style.heart}
										src='/heartNo.png'
										alt='likes'
									/>
								)}
							</div>
						)}
					</div>
				))}
			</div>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel='Confirm Deletion'
				className={style.modal}
				overlayClassName={style.overlay}
			>
				<h2>Вы точно хотите удалить?</h2>
				<div className={style.modalActions}>
					<button className={style.yesButton} onClick={handleDelete}>
						Да
					</button>
					<button onClick={closeModal}>Нет</button>
				</div>
			</Modal>
		</div>
	)
}

export default UsersList
