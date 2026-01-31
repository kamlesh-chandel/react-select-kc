# Universal Select

A powerful, flexible, and feature-rich React select component with support for single/multi-select, async options, search, keyboard navigation, and infinite scrolling.

## Features

**Single & Multi-Select** - Support for both selection modes  
**Search & Filter** - Built-in search with customizable filtering  
**Async Options** - Load options dynamically with infinite scroll  
**Keyboard Navigation** - Full keyboard support (Arrow keys, Enter, Escape)  
**Customizable Styling** - Override default styles easily  
**Persistent State** - Automatic localStorage integration  
**Custom Renderers** - Render custom option and chip components  
**Accessible** - Keyboard navigation and focus management  

## Installation

```bash
npm i @kamleshchandel/react-select-kc
```

or

```bash
yarn add @kamleshchandel/react-select-kc
```

## Basic Usage

### Single Select

```jsx
import UniversalSelect from "@kamleshchandel/react-select-kc";
import "@kamleshchandel/react-select-kc/style.css";

const options = [
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
  { id: 3, label: 'Option 3' },
];

function App() {
  const [value, setValue] = useState(null);

  return (
    <UniversalSelect
      options={options}
      value={value}
      onChange={setValue}
      label="Select an option"
    />
  );
}
```

### Multi-Select

```jsx
const [selectedValues, setSelectedValues] = useState([]);

<UniversalSelect
  options={options}
  value={selectedValues}
  onChange={setSelectedValues}
  label="Select multiple options"
  isMultiSelectAllow={true}
/>
```

### Async Options with Infinite Scroll

```jsx
const loadAsyncOptions = async (searchQuery) => {
  const response = await fetch(`/api/options?search=${searchQuery}`);
  const data = await response.json();
  return data;
};

<UniversalSelect
  loadAsyncOptions={loadAsyncOptions}
  value={value}
  onChange={setValue}
  label="Search and select"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{id: string\|number, label: string, disabled?: boolean}>` | `[]` | Array of options for static select |
| `loadAsyncOptions` | `(search: string) => Promise<Array>` | `undefined` | Async function to load options dynamically |
| `value` | `Object \| Array \| null` | `undefined` | Controlled value (single object or array for multi-select) |
| `onChange` | `(value) => void` | `undefined` | Callback when selection changes |
| `label` | `string` | `undefined` | Label text for the select |
| `isMultiSelectAllow` | `boolean` | `false` | Enable multi-select mode |
| `closeOnOutsideClick` | `boolean` | `true` | Close dropdown when clicking outside |
| `isClearOptionAllow` | `boolean` | `true` | Show clear button when value is selected |
| `isSearchAllow` | `boolean` | `true` | Enable search functionality |
| `selectStyle` | `object` | `{}` | Custom style overrides |
| `renderOption` | `(option) => ReactNode` | `undefined` | Custom renderer for options |
| `renderSelectedOptionChip` | `(option) => ReactNode` | `undefined` | Custom renderer for selected chips (multi-select) |

## Option Object Structure

Each option should follow this structure:

```javascript
{
  id: string | number,      // Unique identifier (required)
  label: string,             // Display text (required)
  disabled?: boolean         // Disable selection (optional)
}
```

## Advanced Examples

### Custom Option Rendering

```jsx
const renderOption = (option) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <img src={option.avatar} alt="" style={{ width: 24, height: 24 }} />
    <div>
      <div>{option.label}</div>
      <small style={{ color: '#666' }}>{option.email}</small>
    </div>
  </div>
);

<UniversalSelect
  options={users}
  renderOption={renderOption}
  value={selectedUser}
  onChange={setSelectedUser}
/>
```

### Custom Selected Chip Rendering

```jsx
const renderSelectedChip = (option) => (
  <span style={{ 
    background: option.color, 
    padding: '2px 8px', 
    borderRadius: '4px' 
  }}>
    {option.label}
  </span>
);

<UniversalSelect
  options={tags}
  isMultiSelectAllow={true}
  renderSelectedOptionChip={renderSelectedChip}
  value={selectedTags}
  onChange={setSelectedTags}
/>
```

### Custom Styling

```jsx
const customStyles = {
  selectWrapper: {
    maxWidth: '400px',
    margin: '20px 0'
  },
  optionsList: {
    maxHeight: '300px',
    borderRadius: '8px'
  },
  highlightOption: {
    backgroundColor: '#e3f2fd'
  },
  selectedOption: {
    backgroundColor: '#bbdefb',
    fontWeight: 'bold'
  },
  disabledOption: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

<UniversalSelect
  options={options}
  selectStyle={customStyles}
  value={value}
  onChange={setValue}
/>
```

### Disabled Options

```jsx
const options = [
  { id: 1, label: 'Available Option' },
  { id: 2, label: 'Disabled Option', disabled: true },
  { id: 3, label: 'Another Available' },
];

<UniversalSelect options={options} />
```

### Uncontrolled Component (Internal State)

```jsx
// Value is automatically managed and persisted in localStorage
<UniversalSelect
  options={options}
  onChange={(value) => console.log('Selection changed:', value)}
  label="Uncontrolled Select"
/>
```

## Keyboard Navigation

- **Arrow Down** - Move focus to next option
- **Arrow Up** - Move focus to previous option
- **Enter** - Select focused option
- **Escape** - Close dropdown

## CSS Classes

You can override these CSS classes for custom styling:

- `.custom-select` - Main wrapper
- `.custom-select-label` - Label element
- `.custom-select-trigger` - Trigger button
- `.custom-select-options` - Options list
- `.custom-select-option` - Individual option
- `.custom-select-option.selected` - Selected option
- `.custom-select-option.highlight` - Focused option
- `.custom-select-option.disabled` - Disabled option
- `.multiple-options-container` - Multi-select container
- `.multiple-options` - Individual selected chip
- `.no-custom-select-options` - No options message

## LocalStorage

The component automatically persists the selected value to localStorage under the key `UNIVERSAL_SELECT_VALUE`. This works for both controlled and uncontrolled modes.

## TypeScript Support

For TypeScript users, you can define your option type:

```typescript
interface Option {
  id: string | number;
  label: string;
  disabled?: boolean;
  // Add your custom properties
  [key: string]: any;
}

const options: Option[] = [
  { id: 1, label: 'Option 1' }
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author
Kamlesh Chandel
MERN Stack Developer

## Support

For issues and questions, please open an issue on the GitHub repository.