import { useEffect, useState, type FC } from "react"
import { Modal } from "./components/modal/modal"
import './app.css'
import { usePromise, type ActiveEvent } from "./utils/usePromise"
import { CardModal } from "./components/events/event-modal"
import { AdminPanel } from "./components/admin-panel/admin-panel"

export const App: FC = () => {
  const [navStatus, setNavStatus] = useState<'registration' | 'login' | 'help' | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  const [email, setEmail] = useState<string | null>(null)
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [role, setRole] = useState<'admin' | 'user' | null>(null)

  const [type, setType] = useState<'active' | 'ended' | 'my'>('my')

  if (localStorage.getItem('auth_token')) {
    setIsLogin(true)
    //нужно email
  }

  const { activeEvents, error } = usePromise('', type, isLogin)//получение событий

  useEffect(() => {
    if (error !== null) {
      console.log('События не получены', error)
    }
  }, [type])

  const [visibleCard, setVisibleCard] = useState<boolean>(false)
  const [activeCard, setActiveCard] = useState<ActiveEvent | null>(null)

  return (
    <div className="app">
      <header>
        <h1>Система электронных афиш</h1>
        {!localStorage.getItem('auth_token') &&
          (<nav>
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
          </nav>)}
      </header>

      <div className="main-content">
        <div className="panel-container">
          <div className="tabs">
            <button className="tab" onClick={() => { setType('active') }}>Активные</button>
            <button className="tab active" onClick={() => { setType('my') }}>Мои события</button>
            <button className="tab" onClick={() => { setType('ended') }}>Прошедшие</button>
          </div>

          <div className="user-profile">
            <div className="user-avatar">АИ</div>
            <div className="user-info">
              <p className="user-name">{email}</p>
              <span className="user-status">В сети</span>
            </div>
          </div>
        </div>

        <div className="events-container">
          <div className="events-header">
            <h2 className="events-title">События</h2>
            <span className="events-count">0 событий</span>
          </div>

          {!isLogin && type === 'my' ? <p>Вы не зарегистрировались</p> : (<div className="events-grid">
            {activeEvents.map((i) => {
              setActiveCard(i)
              return (
                <div key={i.id} className="event-card-placeholder" onClick={() => { setVisibleCard(true) }}>
                  <img src="" alt="" />
                  <h3>{i.name}</h3>
                  <p>Начало: {new Date(i.dates.start).toLocaleDateString()}</p>
                  <p>Окончание: {new Date(i.dates.end).toLocaleDateString()}</p>
                  <p>Количество участников: {i.people}</p>
                  <h2>{i.status}</h2>
                </div>)
            })}
          </div>)}
        </div>
      </div>
      {navStatus && showModal && <Modal status={navStatus} setShowModal={setShowModal} setEmail={setEmail} setIsLogin={setIsLogin} setRole={setRole}/>}
      {role === 'admin' && <AdminPanel />}
      {visibleCard && <CardModal info={activeCard} setVisible={setVisibleCard} name={email} />}
    </div>
  )
}