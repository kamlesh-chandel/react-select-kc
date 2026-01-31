import * as React from "react";

export interface UniversalSelectOption {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface UniversalSelectProps {
  options?: UniversalSelectOption[];
  loadAsyncOptions?: (query: string) => Promise<UniversalSelectOption[]>;
  value?: UniversalSelectOption | UniversalSelectOption[] | null;
  onChange?: (
    value: UniversalSelectOption | UniversalSelectOption[] | null,
  ) => void;
  label?: string;
  isMultiSelectAllow?: boolean;
  closeOnOutsideClick?: boolean;
  isClearOptionAllow?: boolean;
  isSearchAllow?: boolean;
  selectStyle?: Record<string, React.CSSProperties>;
  renderOption?: (option: UniversalSelectOption) => React.ReactNode;
  renderSelectedOptionChip?: (option: UniversalSelectOption) => React.ReactNode;
}

declare const UniversalSelect: React.FC<UniversalSelectProps>;

export default UniversalSelect;
