import { useEffect, useState, type FC } from "react"
import { Modal } from "./components/modal/modal"
import './app.css'
import { usePromise } from "./utils/usePromise"

export const App: FC = () => {
  const [navStatus, setNavStatus] = useState<'registration' | 'login' | 'help' | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  const [name, setName] = useState<string | null>(null)
  const [type, setType] = useState<'active' | 'ended' | 'my'>('active')

  const { activeEvents, error } = usePromise('', type)//получение событий

  useEffect(() => {
    if (error !== null) {
      console.log('События не получены', error)
    }
  }, [type])

  return (
    <div className="app">
      <header>
        <h1>Система электронных афиш</h1>
        <nav>
          <button
            className="nav-btn"
            onClick={() => { setNavStatus('login'); setShowModal(true) }}
          >
            Войти
          </button>
          <button
            className="nav-btn primary"
            onClick={() => { setNavStatus('registration'); setShowModal(true) }}
          >
            Зарегистрироваться
          </button>
          <button
            className="nav-btn primary"
            onClick={() => { setNavStatus('help'); setShowModal(true) }}
          >
            Восстановить пароль
          </button>
        </nav>
      </header>

      <div className="main-content">

        <div className="panel-container">
          <div className="tabs">
            <button className="tab active" onClick={() => {setType('active')}}>Активные</button>
            <button className="tab" onClick={() => {setType('my')}}>Мои события</button>
            <button className="tab" onClick={() => {setType('ended')}}>Прошедшие</button>
          </div>

          <div className="user-profile">
            <div className="user-avatar">АИ</div>
            <div className="user-info">
              <p className="user-name">{name}</p>
              <span className="user-status">В сети</span>
            </div>
          </div>
        </div>

        <div className="events-container">
          <div className="events-header">
            <h2 className="events-title">События</h2>
            <span className="events-count">0 событий</span>
          </div>

          <div className="events-grid">
            {activeEvents.map((i) => {
              return (
              <div className="event-card-placeholder">
                <div className="placeholder-icon">🎪</div>
                  {i.name}
              </div>)
            })}
          </div>
        </div>
      </div>
      {navStatus && showModal && <Modal status={navStatus} setShowModal={setShowModal} setName={setName}/>}
    </div>
  )
}
