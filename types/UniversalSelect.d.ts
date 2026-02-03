import { default as React } from 'react';
export interface UniversalSelectOption {
    id: string | number;
    label: string;
    disabled?: boolean;
}
export interface UniversalSelectStyle {
    selectWrapper?: React.CSSProperties;
    optionsList?: React.CSSProperties;
    highlightOption?: React.CSSProperties;
    disabledOption?: React.CSSProperties;
    selectedOption?: React.CSSProperties;
}
export interface UniversalSelectProps {
    options?: UniversalSelectOption[];
    loadAsyncOptions?: (query: string) => Promise<UniversalSelectOption[]>;
    value?: UniversalSelectOption | UniversalSelectOption[] | null;
    onChange?: (value: UniversalSelectOption | UniversalSelectOption[] | null) => void;
    label?: string;
    isMultiSelectAllow?: boolean;
    closeOnOutsideClick?: boolean;
    isClearOptionAllow?: boolean;
    isSearchAllow?: boolean;
    selectStyle?: UniversalSelectStyle;
    renderOption?: (option: UniversalSelectOption) => React.ReactNode;
    renderSelectedOptionChip?: (option: UniversalSelectOption) => React.ReactNode;
}
declare const UniversalSelect: React.FC<UniversalSelectProps>;
export default UniversalSelect;
