interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

interface LabelProps {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}

interface Item {
  id: number;
  name: string;
}

interface CheckboxGroupListProps {
  type: 'brand' | 'feature' | 'manufacturer' | 'ratings';
  values: number[];
  items: Item[];
  onChange: (id: number, type: CheckboxGroupListProps['type'], isChecked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onCheckedChange, className }) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`
        h-4 w-4 rounded-[4]
        focus:ring-blue-500 focus:ring-offset-0
        appearance-none cursor-pointer
        transition-all duration-200 ease-in-out
        ${checked ? 'bg-[#0d6efd] border-none' : 'bg-white border border-gray-300'}
        ${className || ''}
      `}
      style={{
        backgroundImage: checked ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export const Label: React.FC<LabelProps> = ({ htmlFor, className, children }) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};

export const CheckboxGroupList: React.FC<CheckboxGroupListProps> = ({ type, values, items, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${type}-${item.id}`}
            className="data-[state=checked]:bg-[#0d6efd] data-[state=checked]:border-none"
            checked={values.includes(item.id)}
            onCheckedChange={(isChecked) => onChange(item.id, type, isChecked as boolean)}
          />
          <Label htmlFor={`${type}-${item.id}`} className="text-sm text-gray-600">
            {item.name}
          </Label>
        </div>
      ))}
    </div>
  );
};