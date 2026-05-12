import { Checkbox } from "../ui/checkbox";

const CheckBox = ({
  name,
  value,
  label,
  register,
  checked,
  isDisabled = false,
  isSelectable = true,
  checkedFunc,
} : any) => {
  const identifier = value ?? name;
  const checkboxId = `${name}-${String(identifier)}`;
  // Resolve checked state: if array, check if this checkbox's name/value is included
  const isChecked = Array.isArray(checked)
    ? checked.includes(identifier)
    : (checked ?? false);

  return (
    <div className="flex items-center space-x-0.5">
      <Checkbox
        id={checkboxId}
        {...(register && name ? register(name) : {})}
        checked={isChecked}
        disabled={isDisabled || !isSelectable}
        isSelectable={isSelectable}
        defaultChecked={!isSelectable}
        onCheckedChange={(val) => {
          if (checkedFunc) {
            if (Array.isArray(checked)) {
              const updated = val
                ? Array.from(new Set([...checked, identifier]))
                : checked.filter((v) => v !== identifier);
              (checkedFunc as (checked: string[]) => void)(updated);
            } else {
              (checkedFunc as (checked: boolean) => void)(Boolean(val));
            }
          }
        }}
      />
      <label
        htmlFor={checkboxId}
        className={`pl-2 text-sm font-medium cursor-pointer ${!isSelectable ? "text-muted-foreground" : "text-muted-foreground"
          }`}
      >
        {label}
      </label>
    </div>
  );
};
export default CheckBox;
