import { default as React } from 'react';
export interface SmartSelectOption {
    id: string | number;
    label: string;
    disabled?: boolean;
}
export interface SmartSelectStyle {
    selectWrapper?: React.CSSProperties;
    optionsList?: React.CSSProperties;
    highlightOption?: React.CSSProperties;
    disabledOption?: React.CSSProperties;
    selectedOption?: React.CSSProperties;
}
export interface SmartSelectProps {
    options?: SmartSelectOption[];
    loadAsyncOptions?: (query: string) => Promise<SmartSelectOption[]>;
    value?: SmartSelectOption | SmartSelectOption[] | null;
    onChange?: (value: SmartSelectOption | SmartSelectOption[] | null) => void;
    label?: string;
    isMultiSelectAllow?: boolean;
    closeOnOutsideClick?: boolean;
    isClearOptionAllow?: boolean;
    isSearchAllow?: boolean;
    selectStyle?: SmartSelectStyle;
    renderOption?: (option: SmartSelectOption) => React.ReactNode;
    renderSelectedOptionChip?: (option: SmartSelectOption) => React.ReactNode;
}
declare const SmartSelect: React.FC<SmartSelectProps>;
export default SmartSelect;
