"""
Active leak state manager for the water network simulation.

Tracks active physical leaks injected at specific junction nodes (J1..J16).
Propagated upward by app/simulation/aggregation.py during bottom-up flow sum.
"""

from __future__ import annotations

from typing import Dict, Optional

_active_leaks: Dict[str, float] = {}


def inject_leak(node_id: str, rate_lpm: float) -> None:
    """
    Inject or update an active leak at the specified junction node.

    Parameters
    ----------
    node_id : str
        Junction ID (e.g. 'J2', 'J3', 'J5')
    rate_lpm : float
        Leak volume loss rate in Liters/minute.
    """
    if rate_lpm > 0:
        _active_leaks[node_id] = float(rate_lpm)
    else:
        clear_leak(node_id)


def clear_leak(node_id: Optional[str] = None) -> None:
    """
    Clear leak at node_id, or all leaks if node_id is None.

    Parameters
    ----------
    node_id : Optional[str]
        Specific junction to clear, or None to clear all active leaks.
    """
    if node_id is None:
        _active_leaks.clear()
    else:
        _active_leaks.pop(node_id, None)


def get_active_leaks() -> Dict[str, float]:
    """Return a dictionary copy of all currently active leaks: { node_id: rate_lpm }."""
    return dict(_active_leaks)
