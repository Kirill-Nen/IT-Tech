import { useState, useEffect, type FC } from 'react';
import './admin-modal.css';
import type { AdminObject, FieldConfig, AdminEditModalProps } from './types/admin';

export const AdminEditModal: FC<AdminEditModalProps> = ({
    isOpen,
    onClose,
    data,
    onSave,
    fieldsConfig = {},
    title = 'Редактирование записи',
    isLoading = false
}) => {
    const [formData, setFormData] = useState<AdminObject | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({ ...data });
            setErrors({});
        }
    }, [data]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleChange = (field: string, value: any) => {
        if (!formData) return;

        if (field.includes('.')) {
            const keys = field.split('.');
            const updatedData = { ...formData };
            let current: any = updatedData;
            
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            
            current[keys[keys.length - 1]] = value;
            setFormData(updatedData);
        } else {
            setFormData({
                ...formData,
                [field]: value
            });
        }

        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        if (!formData) return false;

        const newErrors: Record<string, string> = {};

        Object.entries(fieldsConfig).forEach(([field, config]) => {
            if (config.required) {
                let value: any;
                
                if (field.includes('.')) {
                    const keys = field.split('.');
                    value = keys.reduce((obj, key) => obj?.[key], formData);
                } else {
                    value = formData[field];
                }

                if (value === undefined || value === null || value === '') {
                    newErrors[field] = `${config.label} обязательно для заполнения`;
                }
            }

            if (config.validation && formData[field]) {
                const error = config.validation(formData[field]);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                _form: error instanceof Error ? error.message : 'Ошибка сохранения'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldValue = (field: string): any => {
        if (!formData) return '';
        
        if (field.includes('.')) {
            const keys = field.split('.');
            return keys.reduce((obj, key) => obj?.[key], formData) || '';
        }
        
        return formData[field] || '';
    };

    const renderField = (field: string, config: FieldConfig) => {
        const value = getFieldValue(field);
        const error = errors[field];
        const isDisabled = config.disabled || isSubmitting;

        const commonProps = {
            value: value === null || value === undefined ? '' : value,
            onChange: (e: React.ChangeEvent<any>) => handleChange(field, e.target.value),
            disabled: isDisabled,
            className: `admin-input ${error ? 'error' : ''}`,
            placeholder: config.placeholder || `Введите ${config.label.toLowerCase()}...`,
            required: config.required,
            'aria-label': config.label,
            'aria-invalid': !!error
        };

        switch (config.type) {
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">Выберите {config.label.toLowerCase()}</option>
                        {config.options?.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            id={field}
                            checked={!!value}
                            onChange={(e) => handleChange(field, e.target.checked)}
                            disabled={isDisabled}
                            className="admin-checkbox"
                        />
                        <label htmlFor={field} className="checkbox-label">
                            {config.label}
                        </label>
                    </div>
                );

            case 'date':
                const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
                return (
                    <input
                        type="date"
                        {...commonProps}
                        value={dateValue}
                    />
                );

            default:
                return (
                    <input
                        type={config.type}
                        {...commonProps}
                    />
                );
        }
    };

    const formatFieldName = (field: string): string => {
        if (fieldsConfig[field]?.label) {
            return fieldsConfig[field].label;
        }

        return field
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    if (!isOpen || !data || !formData) {
        return null;
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal-container" onClick={e => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h2 className="admin-modal-title">
                        {title}
                        {data.id && (
                            <span className="record-id">ID: {data.id}</span>
                        )}
                    </h2>
                    <button
                        className="admin-modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="admin-modal-form">
                    <div className="admin-modal-body">
                        {errors._form && (
                            <div className="form-error-alert" role="alert">
                                <span className="error-icon">⚠️</span>
                                {errors._form}
                            </div>
                        )}

                        <div className="admin-form-fields">
                            {Object.entries(fieldsConfig).map(([field, config]) => (
                                <div key={field} className="form-group">
                                    {config.type !== 'checkbox' && (
                                        <label htmlFor={field} className="admin-label">
                                            {config.label}
                                            {config.required && <span className="required">*</span>}
                                        </label>
                                    )}
                                    {renderField(field, config)}
                                    {errors[field] && (
                                        <div className="error-message" role="alert">
                                            {errors[field]}
                                        </div>
                                    )}
                                    {config.disabled && (
                                        <div className="field-hint">Только для чтения</div>
                                    )}
                                </div>
                            ))}

                            {Object.keys(formData)
                                .filter(field => !fieldsConfig[field] && field !== 'id')
                                .map(field => (
                                    <div key={field} className="form-group">
                                        <label className="admin-label">
                                            {formatFieldName(field)}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData[field] || ''}
                                            onChange={(e) => handleChange(field, e.target.value)}
                                            disabled={isSubmitting}
                                            className="admin-input"
                                            placeholder={`Введите ${formatFieldName(field).toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Сохранение...
                                </>
                            ) : (
                                'Сохранить изменения'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AdminCreateModal: FC<Omit<AdminEditModalProps, 'data'> & { 
    initialData?: AdminObject;
    mode?: 'create' | 'edit';
}> = ({ 
    initialData = { id: 0 }, 
    mode = 'create', 
    ...props 
}) => {
    return (
        <AdminEditModal
            {...props}
            data={initialData}
            title={mode === 'create' ? 'Создание новой записи' : props.title}
        />
    );
};