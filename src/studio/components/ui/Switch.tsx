import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className="radix-switch-root"
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="radix-switch-thumb" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
