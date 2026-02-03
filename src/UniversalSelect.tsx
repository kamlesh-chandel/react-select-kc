import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style.css";

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
  onChange?: (
    value: UniversalSelectOption | UniversalSelectOption[] | null,
  ) => void;
  label?: string;
  isMultiSelectAllow?: boolean;
  closeOnOutsideClick?: boolean;
  isClearOptionAllow?: boolean;
  isSearchAllow?: boolean;
  selectStyle?: UniversalSelectStyle;
  renderOption?: (option: UniversalSelectOption) => React.ReactNode;
  renderSelectedOptionChip?: (option: UniversalSelectOption) => React.ReactNode;
}

const STORAGE_KEY = "UNIVERSAL_SELECT_VALUE";

function isValidOptions(value: unknown): value is UniversalSelectOption[] {
  return (
    Array.isArray(value) &&
    value.every(
      (opt) =>
        typeof opt === "object" &&
        opt !== null &&
        "id" in opt &&
        "label" in opt,
    )
  );
}

const UniversalSelect: React.FC<UniversalSelectProps> = ({
  options = [],
  loadAsyncOptions,
  value,
  onChange,
  label,
  isMultiSelectAllow = false,
  closeOnOutsideClick = true,
  isClearOptionAllow = true,
  isSearchAllow = true,
  selectStyle = {},
  renderOption,
  renderSelectedOptionChip,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<
    UniversalSelectOption | UniversalSelectOption[] | null
  >(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : isMultiSelectAllow ? [] : null;
    } catch {
      return isMultiSelectAllow ? [] : null;
    }
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [asyncOptions, setAsyncOptions] = useState<UniversalSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const highlightedRef = useRef<HTMLLIElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const selectedValue = value !== undefined ? value : internalValue;

  const normalizedValue = isMultiSelectAllow
    ? Array.isArray(selectedValue)
      ? selectedValue
      : []
    : selectedValue;

  const baseOptions = loadAsyncOptions
    ? asyncOptions
    : isValidOptions(options)
      ? options
      : [];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedValue));
    } catch {}
  }, [normalizedValue]);

  useEffect(() => {
    if (
      !isMultiSelectAllow &&
      normalizedValue &&
      !Array.isArray(normalizedValue)
    ) {
      setSearch(normalizedValue.label);
    }
  }, [normalizedValue, isMultiSelectAllow]);

  const fetchOptions = async (reset = false) => {
    if (!loadAsyncOptions) return;
    setLoading(true);

    try {
      const resultOptions = await loadAsyncOptions(search);
      if (!isValidOptions(resultOptions)) return;

      setAsyncOptions((prev) =>
        reset ? resultOptions : [...prev, ...resultOptions],
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOptions(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!closeOnOutsideClick) return;

    document.addEventListener("click", closeOptions);
    return () => {
      document.removeEventListener("click", closeOptions);
    };
  }, [closeOnOutsideClick]);

  useLayoutEffect(() => {
    highlightedRef.current?.scrollIntoView({
      block: "nearest",
    });
  }, [focusedIndex]);

  const filteredOptions = useMemo(() => {
    if (loadAsyncOptions || !isSearchAllow) return baseOptions;

    return baseOptions.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [baseOptions, search, loadAsyncOptions, isSearchAllow]);

  const updateSelectedValue = (
    newValue: UniversalSelectOption | UniversalSelectOption[] | null,
  ) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const isOptionSelected = (option: UniversalSelectOption) => {
    if (!isMultiSelectAllow) {
      return (
        (normalizedValue as UniversalSelectOption | null)?.id === option.id
      );
    }
    return (
      Array.isArray(normalizedValue) &&
      normalizedValue.some((value) => value.id === option.id)
    );
  };

  const closeOptions = () => {
    if (isMultiSelectAllow) {
      setSearch("");
    } else {
      try {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        const parsed = storedValue ? JSON.parse(storedValue) : null;
        setSearch(parsed?.label || "");
      } catch {
        setSearch("");
      }
    }

    setFocusedIndex(-1);
    setIsOpen(false);
  };

  const toggleOption = (option: UniversalSelectOption) => {
    if (!isMultiSelectAllow) {
      updateSelectedValue(option);
      setSearch(option.label);
      closeOptions();
      return;
    }

    const exists =
      Array.isArray(normalizedValue) &&
      normalizedValue.some((o) => o.id === option.id);

    const newList = exists
      ? (normalizedValue as UniversalSelectOption[]).filter(
          (o) => o.id !== option.id,
        )
      : [...(normalizedValue as UniversalSelectOption[]), option];

    updateSelectedValue(newList);
    setSearch("");

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const handleKeyboardNavigation = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!baseOptions.length) return;

    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) => (prev + 1) % baseOptions.length);
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) =>
        prev <= 0 ? baseOptions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = baseOptions[focusedIndex];
      if (!option || option.disabled) return;
      toggleOption(option);
    } else if (e.key === "Escape") {
      closeOptions();
    }
  };

  const handleInfiniteScroll = (e: React.UIEvent<HTMLUListElement>) => {
    if (loading) return;

    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
      fetchOptions();
    }
  };

  const getOptionStyle = (
    isDisabled: boolean,
    isFocused: boolean,
    isSelected: boolean,
  ): React.CSSProperties => {
    return {
      ...(isDisabled && selectStyle.disabledOption),
      ...(isFocused && selectStyle.highlightOption),
      ...(isSelected && selectStyle.selectedOption),
    };
  };

  const getOptionClassName = (
    isDisabled: boolean,
    isFocused: boolean,
    isSelected: boolean,
  ) => {
    return [
      "custom-select-option",
      isDisabled && "disabled",
      isSelected && "selected",
      isFocused && "highlight",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const renderOptions = () => {
    return filteredOptions.map((option, index) => {
      const isDisabled = !!option.disabled;
      const isFocused = index === focusedIndex;
      const isSelected = isOptionSelected(option);

      return (
        <li
          key={option.id}
          ref={isFocused ? highlightedRef : null}
          style={getOptionStyle(isDisabled, isFocused, isSelected)}
          className={getOptionClassName(isDisabled, isFocused, isSelected)}
          onClick={(e) => {
            e.stopPropagation();
            toggleOption(option);
          }}
        >
          {!isMultiSelectAllow ? (
            <span className="option-label">
              {renderOption ? renderOption(option) : option.label}
            </span>
          ) : (
            <div className={`option-label ${isDisabled ? "disabled" : ""}`}>
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                readOnly
              />
              {renderOption ? renderOption(option) : option.label}
            </div>
          )}
        </li>
      );
    });
  };

  const renderActionIcon = () => {
    const hasSelection = isMultiSelectAllow
      ? Array.isArray(normalizedValue) && normalizedValue.length > 0
      : !!normalizedValue;

    if (loading) return <span>Loading...</span>;

    if (isClearOptionAllow && hasSelection) {
      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            updateSelectedValue(isMultiSelectAllow ? [] : null);
            setSearch("");
          }}
        >
          Clear
        </span>
      );
    }

    return <span>{isOpen ? "↑" : "↓"}</span>;
  };

  const renderSelectContent = () => {
    const renderSelectedOptionList = () => {
      if (!Array.isArray(normalizedValue)) return null;

      return normalizedValue.map((option) => (
        <div className="multiple-options" key={option.id}>
          {renderSelectedOptionChip
            ? renderSelectedOptionChip(option)
            : option.label}
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleOption(option);
            }}
          >
            ⤬
          </span>
        </div>
      ));
    };

    const renderSearchInput = () => (
      <input
        onChange={(e) => setSearch(e.target.value)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        placeholder="Search Here"
        value={search}
      />
    );

    if (isSearchAllow) {
      if (!isMultiSelectAllow) {
        return renderSearchInput();
      }
      return (
        <div className="multiple-options-container">
          {renderSelectedOptionList()}
          {renderSearchInput()}
        </div>
      );
    }

    if (!isMultiSelectAllow) {
      return (
        <p>
          {normalizedValue
            ? renderOption
              ? renderOption(normalizedValue as UniversalSelectOption)
              : (normalizedValue as UniversalSelectOption).label
            : "Please Select Option"}
        </p>
      );
    }

    if (Array.isArray(normalizedValue) && normalizedValue.length <= 0) {
      return <p>Please Select Options</p>;
    }

    return (
      <div className="multiple-options-container">
        {renderSelectedOptionList()}
      </div>
    );
  };

  return (
    <div className="custom-select" style={selectStyle.selectWrapper}>
      <label className="custom-select-label">{label}</label>

      <div
        ref={triggerRef}
        className="custom-select-trigger"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyboardNavigation}
      >
        {renderSelectContent()}
        {renderActionIcon()}
      </div>

      {isOpen && (
        <>
          {filteredOptions.length > 0 && (
            <ul
              className="custom-select-options"
              style={selectStyle.optionsList}
              onScroll={handleInfiniteScroll}
            >
              {renderOptions()}
              {loading && <li className="search-view">Loading...</li>}
            </ul>
          )}

          {!loading && filteredOptions.length === 0 && (
            <div className="no-custom-select-options">
              <p className="no-custom-select-option">No Option Available</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UniversalSelect;
