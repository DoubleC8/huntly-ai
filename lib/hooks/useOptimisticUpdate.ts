import { useState, useCallback } from "react";

/**
 * Generic hook for optimistic UI updates with automatic error reversion
 * 
 * @param initialState - The initial state value
 * @param mutationFn - The async mutation function to call
 * @returns An object with the current state, a mutation function, and loading state
 * 
 * @example
 * const { state, mutate, isPending } = useOptimisticUpdate(
 *   initialStage,
 *   async (newStage) => await mutation.mutateAsync({ type: "setStage", stage: newStage, jobId })
 * );
 */
export function useOptimisticUpdate<T, R = T>(
  initialState: T,
  mutationFn: (newValue: T) => Promise<R>
) {
  const [state, setState] = useState<T>(initialState);

  const mutate = useCallback(
    async (newValue: T, onSuccess?: (value: T) => void, onError?: () => void): Promise<R> => {
      const previousValue = state;
      
      // Optimistically update the UI
      setState(newValue);

      try {
        const result = await mutationFn(newValue);
        onSuccess?.(newValue);
        return result;
      } catch (error) {
        // Revert to previous state on error
        setState(previousValue);
        onError?.();
        throw error; // Re-throw so caller can handle it
      }
    },
    [state, mutationFn]
  );

  return {
    state,
    setState,
    mutate,
  };
}
