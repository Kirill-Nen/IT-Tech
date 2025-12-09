import type { FC } from 'react'
import './event-modal.css'
import type { ActiveEvent } from '../../utils/usePromise'

type CardModalProps = {
    info: ActiveEvent | null,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    name: string | null
}

export const CardModal: FC<CardModalProps> = ({ info, setVisible, name }) => {
    if (info === null) {
        return
    }
    
    const onSubmit = async (operation: 'sucsribe' | 'unsucsribe') => {
        fetch('', { //
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                action: operation,
                id_info: info.id
            })
        })
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close-btn" onClick={() => { setVisible(false) }}>
                    ✕
                </button>

                <div className="modal-header">
                    <h1 className="event-title">{info.name}</h1>
                    <div className="event-status">

                    </div>
                </div>

                <div className="event-image-section">
                    <img
                        src={info.img}
                        className="event-image"
                    />
                </div>

                <div className="event-info-grid">
                    <div className="info-column">
                        <div className="info-item">
                            <div className="info-icon">📅</div>
                            <div className="info-content">
                                <div className="info-label">Начало</div>
                                <div className="info-value">{new Date(info.dates.start).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">✅</div>
                            <div className="info-content">
                                <div className="info-label">Окончание</div>
                                <div className="info-value">{new Date(info.dates.end).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">👥</div>
                            <div className="info-content">
                                <div className="info-label">Участники</div>
                                <div className="info-value">
                                    <div className="participants-count">
                                        <span className="current-count">{info.current_participants}</span>
                                        <span className="max-count"> / {info.max_participantsl}</span>
                                    </div>
                                    {info.isParticipantslLimited && (
                                        <div className="limit-reached">Лимит достигнут</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 2 */}
                    <div className="info-column">
                        <div className="info-item">
                            <div className="info-icon">💰</div>
                            <div className="info-content">
                                <div className="info-label">Оплата</div>
                                <div className={`info-value ${info.price === 'free' ? 'free' : 'paid'}`}>
                                    {info.price}
                                </div>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">👤</div>
                            <div className="info-content">
                                <div className="info-label">Ваш статус</div>
                                <div className="info-value">
                                    <span className={`user-status ${info.user_status}`}>
                                        {info.user_status ? 'Вы участвуете' : 'Вы не учавствуете'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {name === null ? <p>Зарегестируйтесь, чтобы учавствовать</p> : <div className="action-buttons">
                    {info.status === 'active' && info.user_status !== true && (
                        <button
                            className={`btn btn-primary ${info.isParticipantslLimited ? 'disabled' : ''}`}
                            onClick={!info.isParticipantslLimited ? () => {onSubmit('sucsribe')} : undefined}
                        >
                            {info.isParticipantslLimited ? (
                                <>
                                    <span className="btn-icon">⛔</span>
                                    Лимит участников
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">✅</span>
                                    Подтвердить участие
                                </>
                            )}
                        </button>
                    )}

                    {info.status === 'active' && info.user_status === true && (
                        <button
                            className="btn btn-danger"
                            onClick={() => {onSubmit('unsucsribe')}}
                        >
                            <span className="btn-icon">❌</span>
                            Отменить участие
                        </button>
                    )}
                </div>}

            </div>
        </div>
    )
}