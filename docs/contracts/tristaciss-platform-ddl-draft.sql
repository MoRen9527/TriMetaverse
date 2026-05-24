BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tmv_provider_account (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_key TEXT NOT NULL UNIQUE,
    provider_type TEXT NOT NULL,
    credential_ref TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    quota_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tmv_model_route (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT NOT NULL,
    model_tag TEXT,
    provider_account_id UUID NOT NULL REFERENCES tmv_provider_account(id),
    provider_model_id TEXT NOT NULL,
    route_policy TEXT NOT NULL DEFAULT 'weighted_primary',
    weight INTEGER NOT NULL DEFAULT 100,
    priority INTEGER NOT NULL DEFAULT 100,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_model_route_tag_model_tag
    ON tmv_model_route(tag, model_tag);

CREATE TABLE IF NOT EXISTS tmv_api_request_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL UNIQUE,
    caller_id TEXT,
    source_client TEXT,
    route_tag TEXT,
    route_model_tag TEXT,
    resolved_provider TEXT,
    resolved_model TEXT,
    status_code INTEGER,
    latency_ms INTEGER,
    error_code TEXT,
    trace_id TEXT,
    request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tmv_task_ingress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingress_id TEXT NOT NULL UNIQUE,
    request_id TEXT,
    task_type TEXT NOT NULL,
    creator_user_id TEXT NOT NULL,
    source_client TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    forwarded_controller TEXT,
    status TEXT NOT NULL DEFAULT 'accepted',
    approval_status TEXT NOT NULL DEFAULT 'not_required',
    trace_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_task_ingress_status_created_at
    ON tmv_task_ingress(status, created_at DESC);

CREATE TABLE IF NOT EXISTS tmv_task_ingress_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ingress_id UUID NOT NULL REFERENCES tmv_task_ingress(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_task_ingress_event_ingress_id_created_at
    ON tmv_task_ingress_event(ingress_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tmv_user_workspace (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    workspace_key TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, workspace_key)
);

CREATE TABLE IF NOT EXISTS tmv_wallet_binding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    node_id TEXT,
    wallet_address TEXT NOT NULL,
    chain_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'bound',
    bound_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tmv_wallet_binding_user_wallet
    ON tmv_wallet_binding(user_id, wallet_address);

COMMIT;