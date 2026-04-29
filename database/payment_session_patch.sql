CREATE TABLE IF NOT EXISTS payment_session (
    id BINARY(16) NOT NULL,
    order_id BINARY(16) NOT NULL,
    provider VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    reference VARCHAR(64) NOT NULL,
    qr_url VARCHAR(512) NULL,
    payment_url VARCHAR(512) NULL,
    provider_transaction_id VARCHAR(64) NULL,
    provider_order_code BIGINT NULL,
    provider_payment_link_id VARCHAR(64) NULL,
    callback_token VARCHAR(128) NULL,
    expires_at DATETIME NULL,
    confirmed_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_payment_session_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT uk_payment_session_callback_token UNIQUE (callback_token)
);

CREATE INDEX idx_payment_session_order_id_created_at
    ON payment_session (order_id, created_at);

ALTER TABLE payment_session
    ADD COLUMN IF NOT EXISTS provider_order_code BIGINT NULL;

ALTER TABLE payment_session
    ADD COLUMN IF NOT EXISTS provider_payment_link_id VARCHAR(64) NULL;

CREATE INDEX idx_payment_session_provider_order_code
    ON payment_session (provider_order_code);
