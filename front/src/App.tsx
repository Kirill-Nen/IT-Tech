import { useState, type FC } from "react"
import { Modal } from "./utils/modal"

export const App:FC = () => {
  const [navStatus, setNavStatus] = useState<'registration' | 'login' | 'help' |null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="app">
      <header>
        <h1>Система электронных афиш</h1>
        <nav>
          <button 
            className="nav-btn"
            onClick={() => {setNavStatus('login'); setShowModal(true)}}
          >
            Войти
          </button>
          <button 
            className="nav-btn primary"
            onClick={() => {setNavStatus('registration'); setShowModal(true)}}
          >
            Зарегистрироваться
          </button>
          <button 
            className="nav-btn primary"
            onClick={() => {setNavStatus('help'); setShowModal(true)}}
          >
            Восстановить пароль
          </button>
        </nav>
      </header>
      
      <main>
        <h2>Добро пожаловать!</h2>
        <p>Выберите действие выше</p>
      </main>
      {navStatus && showModal && <Modal status={navStatus} setNavStatus={setNavStatus} setShowModal={setShowModal}/>}
    </div>
  )
}
