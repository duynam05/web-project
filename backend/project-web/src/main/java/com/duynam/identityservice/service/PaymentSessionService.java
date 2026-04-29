package com.duynam.identityservice.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.identityservice.configuration.BankTransferProperties;
import com.duynam.identityservice.configuration.PayOsProperties;
import com.duynam.identityservice.constant.OrderStatus;
import com.duynam.identityservice.constant.PaymentMethod;
import com.duynam.identityservice.constant.PaymentProvider;
import com.duynam.identityservice.constant.PaymentSessionStatus;
import com.duynam.identityservice.constant.PaymentStatus;
import com.duynam.identityservice.dto.request.PayOsWebhookRequest;
import com.duynam.identityservice.dto.response.PaymentSessionResponse;
import com.duynam.identityservice.entity.Orders;
import com.duynam.identityservice.entity.PaymentSession;
import com.duynam.identityservice.repository.OrdersRepository;
import com.duynam.identityservice.repository.PaymentSessionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentSessionService {

    private static final Logger log = LoggerFactory.getLogger(PaymentSessionService.class);

    private final PaymentSessionRepository paymentSessionRepository;
    private final OrdersRepository ordersRepository;
    private final BankTransferProperties bankTransferProperties;
    private final PayOsProperties payOsProperties;
    private final PayOsService payOsService;

    @Transactional
    public PaymentSession getOrCreateBankTransferSession(Orders order) {
        return paymentSessionRepository.findLatestByOrderId(order.getId())
                .filter(this::isReusablePendingSession)
                .orElseGet(() -> createBankTransferSession(order));
    }

    @Transactional(readOnly = true)
    public PaymentSession findLatestForOrder(UUID orderId) {
        return paymentSessionRepository.findLatestByOrderId(orderId).orElse(null);
    }

    @Transactional(readOnly = true)
    public Map<UUID, PaymentSession> findLatestByOrderIds(Collection<UUID> orderIds) {
        if (orderIds == null || orderIds.isEmpty()) {
            return Map.of();
        }

        List<PaymentSession> sessions = paymentSessionRepository.findLatestByOrderIds(orderIds);
        return sessions.stream().collect(Collectors.toMap(session -> session.getOrder().getId(), Function.identity()));
    }

    @Transactional(readOnly = true)
    public PaymentSession findLatestByProviderOrderCode(Long providerOrderCode) {
        if (providerOrderCode == null) return null;
        PaymentSession session = paymentSessionRepository.findLatestByProviderOrderCode(providerOrderCode).orElse(null);
        log.info("lookup payment session by providerOrderCode={}: found={}", providerOrderCode, session != null);
        return session;
    }

    @Transactional(readOnly = true)
    public List<PaymentSession> findPendingPayOsSessions(int batchSize) {
        int normalizedBatchSize = Math.max(1, batchSize);
        return paymentSessionRepository.findByProviderAndStatusIn(
                PaymentProvider.PAYOS,
                List.of(PaymentSessionStatus.CREATED, PaymentSessionStatus.PENDING),
                PageRequest.of(0, normalizedBatchSize, Sort.by(Sort.Direction.ASC, "createdAt")));
    }

    @Transactional
    public PaymentSession markSucceeded(Orders order, String providerTransactionId) {
        PaymentSession session = getOrCreateBankTransferSession(order);
        session.setStatus(PaymentSessionStatus.SUCCEEDED);
        session.setProviderTransactionId(providerTransactionId);
        session.setConfirmedAt(LocalDateTime.now());
        return paymentSessionRepository.save(session);
    }

    @Transactional
    public PaymentSession markSucceeded(PaymentSession session, PayOsWebhookRequest.PayOsWebhookData data) {
        session.setStatus(PaymentSessionStatus.SUCCEEDED);
        session.setProviderTransactionId(data != null ? data.getReference() : session.getProviderTransactionId());
        session.setProviderPaymentLinkId(data != null ? data.getPaymentLinkId() : session.getProviderPaymentLinkId());
        session.setConfirmedAt(LocalDateTime.now());
        return paymentSessionRepository.save(session);
    }

    @Transactional
    public PaymentSession syncPaymentSession(Orders order) {
        PaymentSession session = findLatestForOrder(order.getId());
        if (session == null) {
          return null;
        }

        if (!PaymentProvider.PAYOS.equals(session.getProvider())) {
            if ((PaymentSessionStatus.CREATED.equals(session.getStatus()) || PaymentSessionStatus.PENDING.equals(session.getStatus()))
                    && session.getExpiresAt() != null
                    && session.getExpiresAt().isBefore(LocalDateTime.now())) {
                session.setStatus(PaymentSessionStatus.EXPIRED);
                return paymentSessionRepository.save(session);
            }
            return session;
        }

        if (!(PaymentSessionStatus.CREATED.equals(session.getStatus()) || PaymentSessionStatus.PENDING.equals(session.getStatus()))) {
            return session;
        }

        String lookupId = session.getProviderPaymentLinkId() != null && !session.getProviderPaymentLinkId().isBlank()
                ? session.getProviderPaymentLinkId()
                : String.valueOf(session.getProviderOrderCode());

        PayOsService.PayOsPaymentInfoResponse response = payOsService.getPaymentLinkInformation(lookupId);
        String status = payOsService.resolveNormalizedStatus(response);
        log.info("payOS payment link info: orderId={}, providerOrderCode={}, payosStatus={}",
                order.getId(), session.getProviderOrderCode(), status);

        switch (status) {
            case "PAID" -> {
                session.setStatus(PaymentSessionStatus.SUCCEEDED);
                session.setConfirmedAt(LocalDateTime.now());
                if (!PaymentStatus.PAID.equals(order.getPaymentStatus())) {
                    order.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
                    order.setPaymentStatus(PaymentStatus.PAID);
                    if (order.getPaidAt() == null) {
                        order.setPaidAt(LocalDateTime.now());
                    }
                    if (OrderStatus.PENDING.equals(order.getStatus()) || OrderStatus.PENDING_PAYMENT.equals(order.getStatus())) {
                        order.setStatus(OrderStatus.CONFIRMED);
                    }
                    ordersRepository.save(order);
                }
            }
            case "CANCELLED" -> session.setStatus(PaymentSessionStatus.CANCELLED);
            case "PROCESSING" -> session.setStatus(PaymentSessionStatus.PENDING);
            case "PENDING" -> {
                if (session.getExpiresAt() != null && session.getExpiresAt().isBefore(LocalDateTime.now())) {
                    session.setStatus(PaymentSessionStatus.EXPIRED);
                } else {
                    session.setStatus(PaymentSessionStatus.PENDING);
                }
            }
            default -> log.info("payOS payment link returned unsupported status={}, keeping local session state", status);
        }

        return paymentSessionRepository.save(session);
    }

    @Transactional
    public PaymentSession cancelSession(Orders order, String cancellationReason) {
        PaymentSession session = findLatestForOrder(order.getId());
        if (session == null) {
            return null;
        }

        if (!(PaymentSessionStatus.CREATED.equals(session.getStatus()) || PaymentSessionStatus.PENDING.equals(session.getStatus()))) {
            return session;
        }

        if (!PaymentProvider.PAYOS.equals(session.getProvider()) || !payOsProperties.isCancelOnOrderCancel()) {
            session.setStatus(PaymentSessionStatus.CANCELLED);
            return paymentSessionRepository.save(session);
        }

        String lookupId = session.getProviderPaymentLinkId() != null && !session.getProviderPaymentLinkId().isBlank()
                ? session.getProviderPaymentLinkId()
                : String.valueOf(session.getProviderOrderCode());

        PayOsService.PayOsPaymentInfoResponse response = payOsService.cancelPaymentLink(lookupId, cancellationReason);
        String status = payOsService.resolveNormalizedStatus(response);
        log.info("payOS cancel payment link: orderId={}, providerOrderCode={}, payosStatus={}",
                order.getId(), session.getProviderOrderCode(), status);

        if ("PAID".equals(status)) {
            session.setStatus(PaymentSessionStatus.SUCCEEDED);
            session.setConfirmedAt(LocalDateTime.now());
            return paymentSessionRepository.save(session);
        }

        session.setStatus(PaymentSessionStatus.CANCELLED);
        return paymentSessionRepository.save(session);
    }

    public PaymentSessionResponse toResponse(PaymentSession session) {
        if (session == null) return null;

        return PaymentSessionResponse.builder()
                .sessionId(session.getId().toString())
                .provider(session.getProvider())
                .status(session.getStatus())
                .amount(session.getAmount())
                .reference(session.getReference())
                .bankName(bankTransferProperties.getBankName())
                .accountNumber(bankTransferProperties.getAccountNumber())
                .accountHolder(bankTransferProperties.getAccountHolder())
                .qrUrl(session.getQrUrl())
                .paymentUrl(session.getPaymentUrl())
                .providerTransactionId(session.getProviderTransactionId())
                .providerOrderCode(session.getProviderOrderCode())
                .providerPaymentLinkId(session.getProviderPaymentLinkId())
                .expiresAt(session.getExpiresAt())
                .confirmedAt(session.getConfirmedAt())
                .createdAt(session.getCreatedAt())
                .build();
    }

    private boolean isReusablePendingSession(PaymentSession session) {
        if (session == null) return false;
        if (!PaymentSessionStatus.CREATED.equals(session.getStatus())
                && !PaymentSessionStatus.PENDING.equals(session.getStatus())) {
            return false;
        }

        return session.getExpiresAt() == null || session.getExpiresAt().isAfter(LocalDateTime.now());
    }

    private PaymentSession createBankTransferSession(Orders order) {
        if (payOsService.isEnabledForBankTransfer()) {
            return createPayOsSession(order);
        }

        return paymentSessionRepository.save(buildManualBankTransferSession(order));
    }

    private PaymentSession createPayOsSession(Orders order) {
        long providerOrderCode = generateProviderOrderCode();
        PayOsService.PayOsCreatePaymentResponse response = payOsService.createPaymentLink(order, providerOrderCode);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(bankTransferProperties.getSessionExpiryMinutes());

        PaymentSession session = PaymentSession.builder()
                .order(order)
                .provider(PaymentProvider.PAYOS)
                .status(PaymentSessionStatus.PENDING)
                .amount(defaultAmount(order.getTotalPrice()))
                .reference(order.getPaymentReference())
                .qrUrl(payOsService.buildQrImageUrl(buildIntermediateSession(providerOrderCode, response)))
                .paymentUrl(response != null && response.data != null ? response.data.checkoutUrl : null)
                .providerTransactionId(null)
                .providerOrderCode(providerOrderCode)
                .providerPaymentLinkId(response != null && response.data != null ? response.data.paymentLinkId : null)
                .callbackToken(UUID.randomUUID().toString().replace("-", ""))
                .expiresAt(expiresAt)
                .build();

        return paymentSessionRepository.save(session);
    }

    private PaymentSession buildManualBankTransferSession(Orders order) {
        String reference = order.getPaymentReference();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(bankTransferProperties.getSessionExpiryMinutes());

        return PaymentSession.builder()
                .order(order)
                .provider(PaymentProvider.MANUAL_BANK_QR)
                .status(PaymentSessionStatus.PENDING)
                .amount(defaultAmount(order.getTotalPrice()))
                .reference(reference)
                .qrUrl(buildManualVietQrUrl(order.getTotalPrice(), reference))
                .paymentUrl(null)
                .callbackToken(UUID.randomUUID().toString().replace("-", ""))
                .expiresAt(expiresAt)
                .build();
    }

    private PaymentSession buildIntermediateSession(long providerOrderCode, PayOsService.PayOsCreatePaymentResponse response) {
        return PaymentSession.builder()
                .providerOrderCode(providerOrderCode)
                .providerPaymentLinkId(response != null && response.data != null ? response.data.paymentLinkId : null)
                .qrUrl(response != null && response.data != null ? response.data.qrCode : "")
                .build();
    }

    private String buildManualVietQrUrl(BigDecimal amount, String reference) {
        long normalizedAmount = defaultAmount(amount).longValue();
        return "https://img.vietqr.io/image/"
                + bankTransferProperties.getBankId()
                + "-"
                + bankTransferProperties.getAccountNumber()
                + "-compact2.png?amount="
                + normalizedAmount
                + "&addInfo="
                + reference
                + "&accountName="
                + bankTransferProperties.getAccountHolder().replace(" ", "%20");
    }

    private BigDecimal defaultAmount(BigDecimal amount) {
        return amount != null ? amount : BigDecimal.ZERO;
    }

    private long generateProviderOrderCode() {
        long candidate;
        do {
            candidate = System.currentTimeMillis() + ThreadLocalRandom.current().nextInt(100, 999);
        } while (paymentSessionRepository.existsByProviderOrderCode(candidate));
        return candidate;
    }
}
