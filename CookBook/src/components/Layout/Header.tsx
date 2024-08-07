import { useNavigate } from 'react-router-dom'
import style from './Header.module.css'
import { actionsSession } from '../../store/sessionSlice'
import { useAppDispatch, useAppSelector } from '../../store/store'

export const Header = ({ children }: { children: JSX.Element }) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const path = window.location.pathname

	const token = useAppSelector(state => state.session.sessionInfo.token)

	const clickHandler = () => {
		navigate(-1)
	}
	const clickHandlerLogout = () => {
		dispatch(actionsSession.signOut())
		localStorage.removeItem('token')
		navigate('/login')
	}
	const clickHandlerLogin = () => {
		navigate('/login')
	}

	return (
		<div className={style.header}>
			<div className={style.back_container}>
				<button
					className={path === '/' ? (style.buttons, style.hide) : style.buttons}
					onClick={clickHandler}
				>
					Назад
				</button>
			</div>
			<div className={style.back_min_container}>
				<button
					className={
						path === '/'
							? (style.back_min_buttons, style.hide)
							: style.back_min_buttons
					}
					onClick={clickHandler}
				>
					<img src='/back.png' alt='' />
				</button>
			</div>
			{children}
			<div className={style.logout_min_container}>
				<button
					className={style.logout_min_buttons}
					onClick={() => {
						clickHandlerLogout()
					}}
				>
					<img src='/logout.png' alt='' />
				</button>
			</div>

			{token && (
				<div className={style.logout_container}>
					<button
						className={style.buttons}
						onClick={() => {
							clickHandlerLogout()
						}}
					>
						Выход
					</button>
				</div>
			)}
			{!token && (
				<div className={style.logout_container}>
					<button
						className={style.buttons}
						onClick={() => {
							clickHandlerLogin()
						}}
					>
						вход
					</button>
				</div>
			)}
		</div>
	)
}
