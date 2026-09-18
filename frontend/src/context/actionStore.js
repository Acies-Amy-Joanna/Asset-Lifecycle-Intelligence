import { createContext, useContext, useState, useEffect, useCallback } from "react";

const KEY = "ali_action_overrides_v1";
const Ctx = createContext(null);

// Per-device persistence (browser localStorage) for action status + owner.
export const ActionStoreProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(overrides)); } catch { /* ignore quota */ }
  }, [overrides]);

  const setStatus = useCallback((id, status) => {
    setOverrides((o) => ({ ...o, [id]: { ...o[id], status } }));
  }, []);

  const setOwner = useCallback((id, owner) => {
    setOverrides((o) => ({ ...o, [id]: { ...o[id], owner } }));
  }, []);

  return <Ctx.Provider value={{ overrides, setStatus, setOwner }}>{children}</Ctx.Provider>;
};

export const useActionStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useActionStore must be used within ActionStoreProvider");
  return ctx;
};

// effective values: stored override falls back to the seeded default
export const effStatus = (a, overrides) => (overrides[a.id] && overrides[a.id].status) || a.status;
export const effOwner = (a, overrides) => (overrides[a.id] && overrides[a.id].owner) || "";
