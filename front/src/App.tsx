import { useState, type FC } from "react"
import { Modal } from "./utils/modal"

export const App:FC = () => {
  const [navStatus, setNavStatus] = useState<'registration' | 'login' | null>(null)

  return (
    <>
      <nav>
        <button onClick={() => { setNavStatus('registration') }}>Регистрация</button>
        <button onClick={() => { setNavStatus('login') }}>Вход</button>
      </nav>
      {navStatus && <Modal status={navStatus}/>}
    </>
  )
}
