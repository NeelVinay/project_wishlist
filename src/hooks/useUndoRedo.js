import { useState, useCallback, useRef } from "react";

export function useUndoRedo(init) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(init);
  const [future, setFuture] = useState([]);
  const ref = useRef(present);
  ref.current = present;
  const set = useCallback((ns) => { const c = ref.current; setPast((p) => [...p, c]); const n = typeof ns === "function" ? ns(c) : ns; setPresent(n); ref.current = n; setFuture([]); }, []);
  const undo = useCallback(() => { if (!past.length) return; setFuture((f) => [ref.current, ...f]); const p = past[past.length - 1]; setPresent(p); ref.current = p; setPast((pp) => pp.slice(0, -1)); }, [past]);
  const redo = useCallback(() => { if (!future.length) return; setPast((p) => [...p, ref.current]); const n = future[0]; setPresent(n); ref.current = n; setFuture((f) => f.slice(1)); }, [future]);
  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
