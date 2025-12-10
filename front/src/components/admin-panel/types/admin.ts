export type AdminObject = {
    id: number;
    [key: string]: any;
};

export type FieldType = 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox';

export interface FieldConfig {
    label: string;
    type: FieldType;
    options?: string[];
    disabled?: boolean;
    required?: boolean;
    validation?: (value: any) => string | null;
    placeholder?: string;
}

export interface AdminEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AdminObject | null;
    onSave: (updatedData: AdminObject) => Promise<void>;
    fieldsConfig?: Record<string, FieldConfig>;
    title?: string;
    isLoading?: boolean;
}