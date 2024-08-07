import { useState } from 'react'
import { registerUser } from '../../store/sessionSlice/api'
import style from './style/Register.module.css'
import { useNavigate } from 'react-router-dom'

const Register = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [userName, setUserName] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [fieldsError, setFieldsError] = useState('')
	const navigate = useNavigate()

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	const handleRegister = async () => {
		if (!userName || !email || !password || !repeatPassword) {
			setFieldsError('Все поля должны быть заполнены')
			return
		} else {
			setFieldsError('')
		}

		if (!validateEmail(email)) {
			setEmailError('Введите корректный email')
			return
		} else {
			setEmailError('')
		}

		if (password !== repeatPassword) {
			setError('Ошибка: пароли не совпадают')
			return
		}

		const response = await registerUser(userName, email, password)

		if (response === 201) {
			setMessage('Успешно')
			setError('')
			navigate('/')
		} else if (response == 400) {
			setError('Email уже зарегистрирован')
		}
	}
	const clickHandler = () => {
		navigate('/')
	}

	return (
		<div className={style.mainContainer}>
			<div className={style.containerForm}>
				<h2>Регистрация</h2>
				<form>
					<div className={style.inputArea}>
						<label>Имя</label>
						<input
							type='text'
							value={userName}
							onChange={e => setUserName(e.target.value)}
							required
						/>
					</div>
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
							className={error ? style.errorInput : ''}
							required
						/>
					</div>
					<div className={style.inputArea}>
						<label>Подтвердите пароль</label>
						<input
							type='password'
							value={repeatPassword}
							onChange={e => setRepeatPassword(e.target.value)}
							required
						/>
					</div>
				</form>
				<button onClick={handleRegister} className={style.registerButton}>
					Зарегистрироваться
				</button>
				{fieldsError && <p className={style.errorMessage}>{fieldsError}</p>}
				{error && <p className={style.errorMessage}>{error}</p>}
				{message && <p className={style.successMessage}>{message}</p>}
			</div>
			<div
				className={style.heaveAccount}
				onClick={() => {
					clickHandler()
				}}
			>
				Есть аккаунт? Кликни на меня!
			</div>
		</div>
	)
}

export default Register
