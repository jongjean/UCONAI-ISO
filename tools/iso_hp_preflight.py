#!/usr/bin/env python3
"""Check HP ISO paths and execution boundaries without changing system state."""

from __future__ import annotations

import argparse
import json
import subprocess
import socket
from pathlib import Path

CHECKS = [
    ("source_root", Path("/uconai/projects/iso"), True),
    ("data_root", Path("/uconai/data/iso"), True),
    ("db_bootstrap", Path("/uconai/data/iso/db/bootstrap"), True),
    ("storage_root", Path("/uconai/data/iso/storage"), True),
    ("logs_root", Path("/uconai/data/iso/logs"), True),
    ("deploy_index", Path("/uconai/www/iso/index.html"), False),
]

RESERVED_PORTS = {
    "iso-api": ("127.0.0.1", 4510),
    "iso-worker": ("127.0.0.1", 4511),
    "iso-scheduler": ("127.0.0.1", 4512),
}

PREVIEW_PORTS = {
    "iso-frontend-preview": ("127.0.0.1", 5174),
}

PROTECTED_ACTIONS = [
    "db-create",
    "db-migrate",
    "caddy-change",
    "caddy-reload",
    "service-start",
    "service-restart",
    "deploy",
    "paid-ai-provider",
    "legacy-data-migration",
]


def port_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.25)
        return sock.connect_ex((host, port)) == 0


def process_count(patterns: list[str]) -> int:
    try:
        output = subprocess.check_output(["ps", "-eo", "args="], text=True, timeout=2)
    except Exception:
        return -1
    count = 0
    for line in output.splitlines():
        if all(pattern in line for pattern in patterns):
            count += 1
    return count


def collect() -> dict:
    path_checks = []
    failed = False
    for name, path, should_exist in CHECKS:
        exists = path.exists()
        ok = exists is should_exist
        failed = failed or not ok
        path_checks.append(
            {
                "name": name,
                "path": str(path),
                "expected": "exists" if should_exist else "absent",
                "actual": "exists" if exists else "absent",
                "ok": ok,
            }
        )

    port_checks = []
    for name, (host, port) in RESERVED_PORTS.items():
        occupied = port_open(host, port)
        port_checks.append(
            {
                "name": name,
                "host": host,
                "port": port,
                "expected": "free-before-service-start",
                "actual": "occupied" if occupied else "free",
                "ok": not occupied,
            }
        )

    failed = failed or any(not item["ok"] for item in port_checks)

    preview_checks = []
    for name, (host, port) in PREVIEW_PORTS.items():
        occupied = port_open(host, port)
        preview_checks.append(
            {
                "name": name,
                "host": host,
                "port": port,
                "expected": "optional-preview-only",
                "actual": "running" if occupied else "stopped",
                "ok": True,
            }
        )

    process_checks = [
        {
            "name": "codex-exec",
            "expected": "absent",
            "actual": process_count(["codex", "exec"]),
        },
        {
            "name": "codex-smoke",
            "expected": "absent",
            "actual": process_count(["codex_smoke"]),
        },
    ]
    for item in process_checks:
        item["ok"] = item["actual"] == 0
    failed = failed or any(not item["ok"] for item in process_checks)

    return {
        "ok": not failed,
        "pathChecks": path_checks,
        "portChecks": port_checks,
        "previewChecks": preview_checks,
        "processChecks": process_checks,
        "protectedActions": PROTECTED_ACTIONS,
        "boundary": "no DB creation, no migration, no service start, no Caddy change, no deploy",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Read-only ISO HP preflight.")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON.")
    args = parser.parse_args()
    result = collect()

    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        for item in result["pathChecks"]:
            status = "OK" if item["ok"] else "FAIL"
            print(f"{status} {item['name']}: {item['path']} expected={item['expected']} actual={item['actual']}")
        for item in result["portChecks"]:
            status = "OK" if item["ok"] else "FAIL"
            print(f"{status} {item['name']}: {item['host']}:{item['port']} expected={item['expected']} actual={item['actual']}")
        for item in result["previewChecks"]:
            status = "OK" if item["ok"] else "FAIL"
            print(f"{status} {item['name']}: {item['host']}:{item['port']} expected={item['expected']} actual={item['actual']}")
        for item in result["processChecks"]:
            status = "OK" if item["ok"] else "FAIL"
            print(f"{status} {item['name']}: expected={item['expected']} actual={item['actual']}")
        print(f"boundary: {result['boundary']}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

