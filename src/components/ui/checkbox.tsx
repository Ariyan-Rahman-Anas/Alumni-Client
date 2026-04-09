// "use client"

// import * as React from "react"
// import { Checkbox as CheckboxPrimitive } from "radix-ui"

// import { cn } from "@/lib/utils"
// import { CheckIcon } from "lucide-react"

// function Checkbox({
//   className,
//   ...props
// }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
//   return (
//     <CheckboxPrimitive.Root
//       data-slot="checkbox"
//       className={cn(
//         "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
//         className
//       )}
//       {...props}
//     >
//       <CheckboxPrimitive.Indicator
//         data-slot="checkbox-indicator"
//         className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
//       >
//         <CheckIcon
//         />
//       </CheckboxPrimitive.Indicator>
//     </CheckboxPrimitive.Root>
//   )
// }

// export { Checkbox }

















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
        "peer border-input dark:bg-input/30 cursor-pointer data-[state=checked]:bg-transparent data-[state=checked]:text-primary dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-primary focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-5 w-5 shrink-0 rounded border-[2.3px] transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
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
