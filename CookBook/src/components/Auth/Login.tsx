import { useState } from 'react'
import { checkUser } from '../../store/sessionSlice/api'
import style from './style/login.module.css'
import { useAppDispatch } from '../../store/store'
import { actionsSession } from '../../store/sessionSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [emailError, setEmailError] = useState('')
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const handleLogin = async () => {
		if (!validateEmail(email)) {
			setEmailError('Введите корректный email')
			return
		} else {
			setEmailError('')
		}

		const response = await checkUser(email, password)

		if (response.token) {
			localStorage.setItem('token', response.token)
			localStorage.setItem('userName', email)
			dispatch(
				actionsSession.signIn({ token: response.token, userName: email })
			)
			navigate('/')
		} else {
			setMessage('Пользователь не найден')
		}
	}

	const clickHandler = () => {
		navigate('/')
	}

	return (
		<div className={style.mainContainer}>
			<div className={style.containerForm}>
				<h2>Авторизация</h2>
				<form>
					<div className={style.inputArea}>
						<label>Электронная почта</label>
						<input
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						{emailError && <p className={style.errorMessage}>{emailError}</p>}
					</div>
					<div className={style.inputArea}>
						<label>Пароль</label>
						<input
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</div>
				</form>
				<button onClick={handleLogin} className={style.registerButton}>
					Войти
				</button>

				{message && <p className={style.errorMessage}>{message}</p>}
			</div>
			<div
				className={style.noAccount}
				onClick={() => {
					clickHandler()
				}}
			>
				продолжить без авторизации
			</div>
		</div>
	)
}

export default Login
