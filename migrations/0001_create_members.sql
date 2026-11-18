-- Member Rumah Kelinci Padel.
-- token: kode acak di QR kartu (/m/<token>); bisa diganti kalau kartu hilang.
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    birth_date TEXT,
    city TEXT,
    requested_tier TEXT NOT NULL,
    tier TEXT,
    member_number TEXT UNIQUE,
    valid_until TEXT,
    activated_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS members_status_index ON members (status);
