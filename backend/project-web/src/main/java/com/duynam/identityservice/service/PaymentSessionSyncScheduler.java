package com.duynam.identityservice.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.identityservice.configuration.PayOsProperties;
import com.duynam.identityservice.entity.PaymentSession;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentSessionSyncScheduler {

    private static final Logger log = LoggerFactory.getLogger(PaymentSessionSyncScheduler.class);

    private final PayOsProperties payOsProperties;
    private final PaymentSessionService paymentSessionService;

    @Scheduled(fixedDelayString = "${app.payment.payos.sync-fixed-delay-ms:30000}")
    @Transactional
    public void syncPendingPayOsSessions() {
        if (!payOsProperties.isEnabled() || !payOsProperties.isSyncEnabled()) {
            return;
        }

        List<PaymentSession> sessions = paymentSessionService.findPendingPayOsSessions(payOsProperties.getSyncBatchSize());
        if (sessions.isEmpty()) {
            return;
        }

        log.info("payOS scheduler syncing {} pending payment session(s)", sessions.size());
        for (PaymentSession session : sessions) {
            try {
                paymentSessionService.syncPaymentSession(session.getOrder());
            } catch (Exception exception) {
                log.warn("payOS scheduler failed to sync sessionId={}, orderId={}: {}",
                        session.getId(),
                        session.getOrder() != null ? session.getOrder().getId() : null,
                        exception.getMessage());
            }
        }
    }
}
