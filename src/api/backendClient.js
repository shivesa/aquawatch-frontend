/**
 * AquaWatch API Client for Industrial Water Network Simulation Backend.
 * Connects directly to FastAPI backend running on http://127.0.0.1:8000.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

async function safeFetch(url, options = {}, timeoutMs = 2000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export const backendApi = {
  baseUrl: BASE_URL,

  /** Check if the FastAPI backend is running */
  async checkHealth() {
    try {
      const data = await safeFetch(`${BASE_URL}/`, {}, 1200);
      return data?.status === 'ok';
    } catch {
      return false;
    }
  },

  /** Fetch current tick snapshot (flows J1..J16, pressures, machines M1..M8, taps) */
  async fetchCurrentState() {
    return await safeFetch(`${BASE_URL}/state/current`, {}, 1800);
  },

  /** Fetch full network topology tree */
  async fetchTopology() {
    return await safeFetch(`${BASE_URL}/network/topology`, {}, 2000);
  },

  /** Fetch historical snapshots */
  async fetchHistory(limit = 60) {
    return await safeFetch(`${BASE_URL}/state/history?limit=${limit}`, {}, 3000);
  },

  /** Inject physical leak at specific junction (e.g. 'J2', 'J3') */
  async injectLeak(nodeId = 'J2', rateLpm = 240) {
    return await safeFetch(`${BASE_URL}/simulation/leak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_id: nodeId, rate_lpm: Number(rateLpm) }),
    });
  },

  /** Clear leak at junction or all junctions */
  async clearLeak(nodeId = null) {
    return await safeFetch(`${BASE_URL}/simulation/leak/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_id: nodeId }),
    });
  },

  /** Update machine production rate and operating state */
  async controlMachine(machineId, productionPct, state = 'RUNNING') {
    return await safeFetch(`${BASE_URL}/control/machine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machine_id: machineId,
        production_pct: Number(productionPct),
        state: state,
      }),
    });
  },

  /** Update tap state */
  async controlTap(tapId, state = 'CLOSED') {
    return await safeFetch(`${BASE_URL}/control/tap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tap_id: tapId, state: state }),
    });
  },

  /** Advance one tick */
  async stepSimulation() {
    return await safeFetch(`${BASE_URL}/simulation/step`, { method: 'POST' });
  },

  /** Pause auto-tick loop */
  async pauseSimulation() {
    return await safeFetch(`${BASE_URL}/simulation/pause`, { method: 'POST' });
  },

  /** Resume auto-tick loop */
  async resumeSimulation() {
    return await safeFetch(`${BASE_URL}/simulation/resume`, { method: 'POST' });
  },

  /** Reset simulation */
  async resetSimulation() {
    return await safeFetch(`${BASE_URL}/simulation/reset`, { method: 'POST' });
  },
};
