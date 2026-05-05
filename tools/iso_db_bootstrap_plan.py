#!/usr/bin/env python3
"""Print the ISO database bootstrap plan without executing it."""

from __future__ import annotations

import argparse
from pathlib import Path, PurePosixPath

DEFAULT_DB_NAME = "uconai_iso"
DEFAULT_DB_USER = "uconai_iso_app"
DEFAULT_DATA_ROOT = "/uconai/data/iso"


def build_sql(db_name: str, db_user: str) -> str:
    return f"""-- ISO DB bootstrap plan only. Review before execution.
-- This SQL must be executed only after separate DB execution review.

create user {db_user} with password '<SET_APPROVED_SECRET>';
create database {db_name} owner {db_user};
grant all privileges on database {db_name} to {db_user};
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-name", default=DEFAULT_DB_NAME)
    parser.add_argument("--db-user", default=DEFAULT_DB_USER)
    parser.add_argument("--data-root", default=str(DEFAULT_DATA_ROOT))
    parser.add_argument("--write-plan", action="store_true", help="Write plan file under data-root/db/bootstrap")
    args = parser.parse_args()

    data_root = PurePosixPath(args.data_root)
    plan = {
        "database": args.db_name,
        "app_user": args.db_user,
        "data_root": str(data_root),
        "prisma_schema": "/uconai/projects/iso/backend/prisma/schema.prisma",
        "execution_review_required": "Separate DB execution review",
        "not_executed_by_this_tool": [
            "createdb",
            "createuser",
            "psql",
            "prisma migrate",
            "systemd service start",
            "Caddy reload",
        ],
    }

    lines = [
        "# ISO DB Bootstrap Plan",
        "",
        f"Database: `{plan['database']}`",
        f"App user: `{plan['app_user']}`",
        f"Data root: `{plan['data_root']}`",
        f"Prisma schema: `{plan['prisma_schema']}`",
        f"Execution review required: {plan['execution_review_required']}",
        "",
        "## SQL Draft",
        "",
        "```sql",
        build_sql(args.db_name, args.db_user).strip(),
        "```",
        "",
        "## This Tool Does Not Execute",
    ]
    lines.extend(f"- {item}" for item in plan["not_executed_by_this_tool"])
    content = "\n".join(lines) + "\n"

    print(content)

    if args.write_plan:
        target = Path(args.data_root) / "db" / "bootstrap" / "DB_BOOTSTRAP_PLAN.md"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        print(f"wrote_plan={target}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

