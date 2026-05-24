BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tmv_device_pairing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_fingerprint TEXT NOT NULL UNIQUE,
    pairing_code TEXT,
    paired_by TEXT,
    paired_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tmv_node_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_key TEXT NOT NULL UNIQUE,
    device_pairing_id UUID REFERENCES tmv_device_pairing(id),
    runtime_type TEXT NOT NULL,
    role TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'registered',
    active_flag BOOLEAN NOT NULL DEFAULT FALSE,
    consent_status TEXT NOT NULL DEFAULT 'pending',
    owner_user_id TEXT,
    wallet_address TEXT,
    last_heartbeat_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_node_registry_state_active
    ON tmv_node_registry(state, active_flag, consent_status);

CREATE INDEX IF NOT EXISTS idx_tmv_node_registry_owner_user_id
    ON tmv_node_registry(owner_user_id);

CREATE TABLE IF NOT EXISTS tmv_node_capability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES tmv_node_registry(id) ON DELETE CASCADE,
    capability_key TEXT NOT NULL,
    capability_version TEXT,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    cost_hint JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (node_id, capability_key)
);

CREATE TABLE IF NOT EXISTS tmv_node_lease (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES tmv_node_registry(id) ON DELETE CASCADE,
    lease_type TEXT NOT NULL,
    holder_id TEXT NOT NULL,
    lease_started_at TIMESTAMPTZ NOT NULL,
    lease_expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_node_lease_status_expires_at
    ON tmv_node_lease(status, lease_expires_at);

CREATE TABLE IF NOT EXISTS tmv_task (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL UNIQUE,
    ingress_id TEXT,
    task_type TEXT NOT NULL,
    creator_user_id TEXT NOT NULL,
    source_domain TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'accepted',
    policy_gate JSONB NOT NULL DEFAULT '{}'::jsonb,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_task_status_created_at
    ON tmv_task(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tmv_task_creator_created_at
    ON tmv_task(creator_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tmv_task_offer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tmv_task(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES tmv_node_registry(id),
    offer_status TEXT NOT NULL DEFAULT 'offered',
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_tmv_task_offer_target_status
    ON tmv_task_offer(target_node_id, offer_status, offered_at DESC);

CREATE TABLE IF NOT EXISTS tmv_task_execution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id TEXT NOT NULL UNIQUE,
    task_id UUID NOT NULL REFERENCES tmv_task(id) ON DELETE CASCADE,
    node_id UUID REFERENCES tmv_node_registry(id),
    execution_status TEXT NOT NULL DEFAULT 'queued',
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    exit_code INTEGER,
    summary_hash TEXT,
    summary_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_task_execution_task_node
    ON tmv_task_execution(task_id, node_id);

CREATE INDEX IF NOT EXISTS idx_tmv_task_execution_status_updated_at
    ON tmv_task_execution(execution_status, updated_at DESC);

CREATE TABLE IF NOT EXISTS tmv_task_artifact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_execution_id UUID NOT NULL REFERENCES tmv_task_execution(id) ON DELETE CASCADE,
    artifact_type TEXT NOT NULL,
    uri TEXT NOT NULL,
    hash TEXT,
    size_bytes BIGINT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tmv_audit_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    actor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_audit_event_aggregate_created_at
    ON tmv_audit_event(aggregate_type, aggregate_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tmv_verification_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_execution_id UUID NOT NULL REFERENCES tmv_task_execution(id) ON DELETE CASCADE,
    verifier_type TEXT NOT NULL,
    result TEXT NOT NULL,
    score NUMERIC(10, 2),
    report_uri TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tmv_reward_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_type TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    reward_type TEXT NOT NULL,
    amount NUMERIC(24, 8) NOT NULL,
    token_symbol TEXT NOT NULL DEFAULT 'TMV',
    source_execution_id UUID REFERENCES tmv_task_execution(id),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_reward_ledger_subject_created_at
    ON tmv_reward_ledger(subject_type, subject_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tmv_settlement_batch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_no TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(24, 8) NOT NULL DEFAULT 0,
    settlement_ref TEXT,
    settled_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;