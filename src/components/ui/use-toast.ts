
import { useToast, toast } from "@/hooks/use-toast";

// Set default duration to 2000ms (2 seconds)
const defaultToast = toast;
const enhancedToast = (props: Parameters<typeof toast>[0]) => {
  return defaultToast({
    ...props,
    duration: props.duration ?? 2000,
  });
};

export { useToast, enhancedToast as toast };
