declare module "react-day-picker" {
  import type { ComponentType, ReactNode } from "react";

  export interface DayPickerChevronProps {
    orientation: "left" | "right";
    [key: string]: unknown;
  }

  export interface DayPickerProps {
    className?: string;
    classNames?: Record<string, string>;
    components?: {
      Chevron?: ComponentType<DayPickerChevronProps>;
    };
    showOutsideDays?: boolean;
    mode?: string;
    selected?: unknown;
    onSelect?: (value: unknown) => void;
    disabled?: ((date: Date) => boolean) | Date | Date[];
    initialFocus?: boolean;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export const DayPicker: ComponentType<DayPickerProps>;
}
