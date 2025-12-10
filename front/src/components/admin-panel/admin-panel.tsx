import { useEffect, useState, useCallback } from "react"
import { AdminEditModal } from "./AdminModal"
import './admin-panel.css'
import type { AdminObject, FieldConfig } from "./types/admin"

type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    dateRegistrationDate: string;
    status: 'active' | 'deleted';
}

type Event = {
    id: number
    name: string,
    img: string,
    start: string,
    end: string
    people: number,
    status: 'active' | 'end',
    price: number | 'free',
    current_participants: number,
    max_participants: number
}

type AdminObjectUnion = User | Event
type ObjectType = 'user' | 'event'

interface ActionInfo {
    object: ObjectType;
    id: number;
    subject: AdminObjectUnion;
}

export const AdminPanel = () => {
    const [users, setUsers] = useState<User[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState({ users: true, events: true })
    const [error, setError] = useState({ users: '', events: '' })
    const [selectedItem, setSelectedItem] = useState<ActionInfo | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<ActionInfo | null>(null)
    const [activeTab, setActiveTab] = useState<'users' | 'events'>('users')

    const userFieldsConfig: Record<string, FieldConfig> = {
        name: {
            label: 'Имя',
            type: 'text',
            required: true,
            validation: (value: string) => value.length < 2 ? 'Имя должно быть не менее 2 символов' : null
        },
        email: {
            label: 'Email',
            type: 'email',
            required: true,
            validation: (value: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                return emailRegex.test(value) ? null : 'Введите корректный email'
            }
        },
        role: {
            label: 'Роль',
            type: 'select',
            options: ['user', 'admin'],
            required: true
        },
        dateRegistrationDate: {
            label: 'Дата регистрации',
            type: 'date',
            disabled: true
        },
        status: {
            label: 'Статус',
            type: 'select',
            options: ['active', 'deleted']
        }
    }

    const eventFieldsConfig: Record<string, FieldConfig> = {
        name: {
            label: 'Название события',
            type: 'text',
            required: true,
            validation: (value: string) => value.length < 3 ? 'Название должно быть не менее 3 символов' : null
        },
        img: {
            label: 'Ссылка на изображение',
            type: 'text',
            placeholder: 'https://example.com/image.jpg'
        },
        start: {
            label: 'Дата начала',
            type: 'date',
            required: true
        },
        end: {
            label: 'Дата окончания',
            type: 'date',
            required: true
        },
        people: {
            label: 'Количество людей',
            type: 'number',
            validation: (value: number) => value < 1 ? 'Должно быть не менее 1' : null
        },
        status: {
            label: 'Статус',
            type: 'select',
            options: ['active', 'end']
        },
        price: {
            label: 'Цена',
            type: 'number',
            validation: (value: number | 'free') => {
                if (value !== 'free' && value < 0) return 'Цена не может быть отрицательной'
                return null
            }
        },
        current_participants: {
            label: 'Текущие участники',
            type: 'number',
            validation: (value: number) => value < 0 ? 'Не может быть отрицательным' : null
        },
        max_participants: {
            label: 'Максимум участников',
            type: 'number',
            validation: (value: number) => value < 1 ? 'Должно быть не менее 1' : null
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(prev => ({ ...prev, users: true }))
                const usersResponse = await fetch('/api/admin/users')
                if (!usersResponse.ok) throw new Error('Ошибка загрузки пользователей')
                const usersData = await usersResponse.json()
                setUsers(usersData)
                setError(prev => ({ ...prev, users: '' }))
            } catch (err) {
                setError(prev => ({ ...prev, users: err instanceof Error ? err.message : 'Ошибка загрузки' }))
            } finally {
                setLoading(prev => ({ ...prev, users: false }))
            }

            try {
                setLoading(prev => ({ ...prev, events: true }))
                const eventsResponse = await fetch('/api/admin/events')
                if (!eventsResponse.ok) throw new Error('Ошибка загрузки событий')
                const eventsData = await eventsResponse.json()
                setEvents(eventsData)
                setError(prev => ({ ...prev, events: '' }))
            } catch (err) {
                setError(prev => ({ ...prev, events: err instanceof Error ? err.message : 'Ошибка загрузки' }))
            } finally {
                setLoading(prev => ({ ...prev, events: false }))
            }
        }

        fetchData()
    }, [])

    const handleEdit = useCallback((info: ActionInfo) => {
        setSelectedItem(info)
        setIsEditModalOpen(true)
    }, [])

    const handleDeleteClick = useCallback((info: ActionInfo) => {
        setDeleteConfirm(info)
    }, [])

    const confirmDelete = useCallback(async () => {
        if (!deleteConfirm) return

        try {
            const response = await fetch(`/api/admin/${deleteConfirm.object}s/${deleteConfirm.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) throw new Error('Ошибка удаления')

            if (deleteConfirm.object === 'user') {
                setUsers(prev => prev.filter(user => user.id !== deleteConfirm.id))
            } else {
                setEvents(prev => prev.filter(event => event.id !== deleteConfirm.id))
            }

            alert(`${deleteConfirm.object === 'user' ? 'Пользователь' : 'Событие'} успешно удален`)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Ошибка удаления')
        } finally {
            setDeleteConfirm(null)
        }
    }, [deleteConfirm])

    const handleSave = useCallback(async (updatedData: AdminObject) => {
        if (!selectedItem) return

        try {
            const response = await fetch(`/api/admin/${selectedItem.object}s/${selectedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })

            if (!response.ok) throw new Error('Ошибка сохранения')

            const savedData = await response.json()

            if (selectedItem.object === 'user') {
                setUsers(prev => prev.map(user => 
                    user.id === selectedItem.id ? savedData as User : user
                ))
            } else {
                setEvents(prev => prev.map(event => 
                    event.id === selectedItem.id ? savedData as Event : event
                ))
            }

            alert('Изменения сохранены успешно')
            setIsEditModalOpen(false)
        } catch (err) {
            throw err
        }
    }, [selectedItem])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    const formatPrice = (price: number | 'free') => {
        return price === 'free' ? 'Бесплатно' : `${price} ₽`
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active': return 'status-badge active'
            case 'deleted': return 'status-badge deleted'
            case 'end': return 'status-badge ended'
            default: return 'status-badge'
        }
    }

    const getRoleBadgeClass = (role: string) => {
        return role === 'admin' ? 'role-badge admin' : 'role-badge user'
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1 className="admin-title">Панель администратора</h1>
                <p className="admin-subtitle">Управление пользователями и событиями</p>
            </header>

            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    👥 Пользователи ({users.length})
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    🎪 События ({events.length})
                </button>
            </div>

            {deleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <h3>Подтверждение удаления</h3>
                        <p>
                            Вы уверены, что хотите удалить 
                            {deleteConfirm.object === 'user' ? ' пользователя' : ' событие'}?
                        </p>
                        <div className="delete-confirm-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Отмена
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={confirmDelete}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedItem && (
                <AdminEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    data={selectedItem.subject as AdminObject}
                    onSave={handleSave}
                    fieldsConfig={
                        selectedItem.object === 'user' 
                            ? userFieldsConfig 
                            : eventFieldsConfig
                    }
                    title={`Редактирование ${selectedItem.object === 'user' ? 'пользователя' : 'события'}`}
                    isLoading={false}
                />
            )}

            <div className="admin-content">
                {activeTab === 'users' ? (
                    <>
                        {loading.users ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Загрузка пользователей...</p>
                            </div>
                        ) : error.users ? (
                            <div className="error-alert">
                                <span className="error-icon">⚠️</span>
                                {error.users}
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => window.location.reload()}
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : (
                            <div className="users-grid">
                                {users.map(user => (
                                    <div key={user.id} className="admin-card user-card">
                                        <div className="card-header">
                                            <div className="user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="user-info-header">
                                                <h3 className="user-name">{user.name}</h3>
                                                <span className={getRoleBadgeClass(user.role)}>
                                                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="info-row">
                                                <span className="info-label">📧 Email:</span>
                                                <span className="info-value">{user.email}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">📅 Регистрация:</span>
                                                <span className="info-value">{formatDate(user.dateRegistrationDate)}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">🔧 Статус:</span>
                                                <span className={getStatusBadgeClass(user.status)}>
                                                    {user.status === 'active' ? 'Активен' : 'Удален'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleEdit({
                                                    object: 'user',
                                                    id: user.id,
                                                    subject: user
                                                })}
                                            >
                                                ✏️ Редактировать
                                            </button>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteClick({
                                                    object: 'user',
                                                    id: user.id,
                                                    subject: user
                                                })}
                                                disabled={user.status === 'deleted'}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {loading.events ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Загрузка событий...</p>
                            </div>
                        ) : error.events ? (
                            <div className="error-alert">
                                <span className="error-icon">⚠️</span>
                                {error.events}
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => window.location.reload()}
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {events.map(event => (
                                    <div key={event.id} className="admin-card event-card">
                                        <div className="card-header">
                                            <div className="event-image">
                                                {event.img ? (
                                                    <img src={event.img} alt={event.name} />
                                                ) : (
                                                    <div className="event-image-placeholder">
                                                        🎪
                                                    </div>
                                                )}
                                            </div>
                                            <div className="event-info-header">
                                                <h3 className="event-name">{event.name}</h3>
                                                <div className="event-meta">
                                                    <span className={getStatusBadgeClass(event.status)}>
                                                        {event.status === 'active' ? 'Активно' : 'Завершено'}
                                                    </span>
                                                    <span className="price-badge">
                                                        {formatPrice(event.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="info-grid">
                                                <div className="info-item">
                                                    <span className="info-label">📅 Начало:</span>
                                                    <span className="info-value">{formatDate(event.start)}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">✅ Окончание:</span>
                                                    <span className="info-value">{formatDate(event.end)}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">👥 Участники:</span>
                                                    <div className="participants-info">
                                                        <span className="current">{event.current_participants}</span>
                                                        <span className="separator">/</span>
                                                        <span className="max">{event.max_participants}</span>
                                                        <div className="progress-bar">
                                                            <div 
                                                                className="progress-fill"
                                                                style={{
                                                                    width: `${(event.current_participants / event.max_participants) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="info-item">
                                                    <span className="info-label">👤 Мест:</span>
                                                    <span className="info-value">{event.people}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleEdit({
                                                    object: 'event',
                                                    id: event.id,
                                                    subject: event
                                                })}
                                            >
                                                ✏️ Редактировать
                                            </button>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteClick({
                                                    object: 'event',
                                                    id: event.id,
                                                    subject: event
                                                })}
                                            >
                                                🗑️ Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}