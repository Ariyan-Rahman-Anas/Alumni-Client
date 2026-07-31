"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitive.Root
> {
  isSelectable?: boolean;
}

const Checkbox = ({
  className,
  isSelectable = true,
  checked,
  ...props
}: CheckboxProps) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={isSelectable ? checked : true} // Force checked when not selectable
      className={cn(
        "peer border-input dark:bg-input/30 cursor-pointer data-[state=checked]:bg-transparent data-[state=checked]:text-primary dark:data-[state=checked]:bg-transparent data-[state=checked]:border-primary focus-visible:border-primary focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-5 w-5 shrink-0 rounded border-[2.3px] transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
        isSelectable
          ? "cursor-pointer border-primary "
          : "cursor-default border-muted bg-muted/20",
        !isSelectable &&
        "data-[state=checked]:border-muted-foreground data-[state=checked]:text-muted-foreground",
      )}
      disabled={!isSelectable}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
export { Checkbox };
