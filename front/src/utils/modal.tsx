import { useEffect, useRef, useState, type FC, type FormEvent, type ReactNode } from "react"

type ModalTypeProps = {
    status: 'registration' | 'login'
}

export const Modal: FC<ModalTypeProps> = ({ status }) => {
    const formRef = useRef<HTMLFormElement>(null)

    const [data, setData] = useState<Record<string, string> | null>(null)

    function btnSubmit(e: FormEvent) {
        e.preventDefault()

        if (!formRef.current) {
            console.error('Форма не найдена')
            return
        }

        const formData = new FormData(formRef.current)
        const formDataObject: Record<string, string> = {}

        formData.forEach((value, key) => {
            formDataObject[key] = value.toString()
        })

        setData(formDataObject)
    }

    useEffect(() => {
        fetch(`${status}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data_res => console.log(data_res))
    }, [data])

    return (
        <div>
            <form ref={formRef} onSubmit={btnSubmit}>
                {status === 'login' ? <div>
                    <h2>Вход в аккаунт</h2>

                    <div className="form-group">
                        <label htmlFor="login-email">Электронная почта</label>
                        <input
                            type="email"
                            id="login-email"
                            name="email"
                            placeholder="example@mail.ru"
                            required
                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Введите корректный email"
                        />
                        <div className="hint">Например: user@example.com</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Пароль</label>
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            title="Пароль должен быть не менее 6 символов"
                        />
                        <div className="hint">Минимум 6 символов</div>
                    </div>

                    <button type="submit" className="submit-btn">Войти</button>

                    <div className="form-footer">
                        <a href="#" className="link">Забыли пароль?</a>
                        <span>Нет аккаунта? <a href="#" className="link">Зарегистрироваться</a></span>
                    </div>
                </div> : <div>
                    <h2>Регистрация</h2>

                    <div className="form-group">
                        <label htmlFor="register-fio">ФИО</label>
                        <input
                            type="text"
                            id="register-fio"
                            name="fio"
                            placeholder="Иванов Иван Иванович"
                            required
                            pattern="[А-ЯЁа-яё\s]{5,50}"
                            title="Введите ФИО кириллицей (минимум 5 символов)"
                        />
                        <div className="hint">Полное ФИО на русском языке</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Электронная почта</label>
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            placeholder="example@mail.ru"
                            required
                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            title="Введите корректный email"
                        />
                        <div className="hint">Будет использоваться для входа</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-password">Пароль</label>
                        <input
                            type="password"
                            id="register-password"
                            name="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$"
                            title="Пароль должен содержать минимум 6 символов, включая буквы и цифры"
                        />
                        <div className="hint">Минимум 6 символов, буквы и цифры</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-confirm">Подтверждение пароля</label>
                        <input
                            type="password"
                            id="register-confirm"
                            name="confirmPassword"
                            placeholder="••••••••"
                            required
                            title="Пароли должны совпадать"
                        />
                        <div className="hint">Повторите пароль</div>
                    </div>

                    <div className="form-group checkbox">
                        <input
                            type="checkbox"
                            id="register-agreement"
                            name="agreement"
                            required
                        />
                        <label htmlFor="register-agreement">
                            Я согласен с <a href="#" className="link">правилами использования</a> и
                            <a href="#" className="link">политикой конфиденциальности</a>
                        </label>
                    </div>

                    <button type="submit" className="submit-btn">Зарегистрироваться</button>

                    <div className="form-footer">
                        <span>Уже есть аккаунт? <a href="#" className="link">Войти</a></span>
                    </div>
                </div>}
                <button>{status === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
            </form>
        </div>
    )
}