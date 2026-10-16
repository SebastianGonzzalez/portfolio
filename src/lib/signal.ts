type Listener<T> = (value: T) => void;

export interface Signal<T> {
  emit(value: T): void;
  /** `replay`: also call the listener right away with the last emitted value, if any. */
  subscribe(listener: Listener<T>, options?: { replay?: boolean }): () => void;
}

/**
 * Minimal pub/sub. Used for per-frame values (scroll progress) that several components react to
 * imperatively, where React state would re-render on every frame.
 */
export function createSignal<T>(): Signal<T> {
  const listeners = new Set<Listener<T>>();
  let last: { value: T } | null = null;
  return {
    emit(value) {
      last = { value };
      listeners.forEach((l) => l(value));
    },
    subscribe(listener, { replay = false } = {}) {
      listeners.add(listener);
      if (replay && last) listener(last.value);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
