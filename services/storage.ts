
import { Operation, IndexedDevice } from "../types";

const OPS_KEY = "marwan_fon_ops";
const INDEX_KEY = "marwan_fon_index";

// Operations
export const saveOperation = (op: Operation) => {
  const ops = getAllOperations();
  ops.unshift(op);
  localStorage.setItem(OPS_KEY, JSON.stringify(ops));
};

export const updateOperation = (id: string, updates: Partial<Operation>) => {
  const ops = getAllOperations();
  const index = ops.findIndex(o => o.id === id);
  if (index !== -1) {
    ops[index] = { ...ops[index], ...updates };
    localStorage.setItem(OPS_KEY, JSON.stringify(ops));
  }
};

export const deleteOperation = (id: string) => {
  const ops = getAllOperations().filter(o => o.id !== id);
  localStorage.setItem(OPS_KEY, JSON.stringify(ops));
};

export const getAllOperations = (): Operation[] => {
  const data = localStorage.getItem(OPS_KEY);
  return data ? JSON.parse(data) : [];
};

// Hardware Index (The Library)
export const saveToIndex = (device: IndexedDevice) => {
  const index = getAllIndexedDevices();
  const exists = index.find(d => d.model === device.model);
  if (!exists) {
    index.unshift(device);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  }
};

export const removeFromIndex = (id: string) => {
  const index = getAllIndexedDevices().filter(d => d.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
};

export const getAllIndexedDevices = (): IndexedDevice[] => {
  const data = localStorage.getItem(INDEX_KEY);
  return data ? JSON.parse(data) : [];
};
