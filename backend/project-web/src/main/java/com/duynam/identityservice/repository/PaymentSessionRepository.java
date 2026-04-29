package com.duynam.identityservice.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;

import com.duynam.identityservice.entity.PaymentSession;

public interface PaymentSessionRepository extends JpaRepository<PaymentSession, UUID> {

    boolean existsByProviderOrderCode(Long providerOrderCode);

    @Query("""
            select ps
            from PaymentSession ps
            where ps.order.id = :orderId
              and ps.createdAt = (
                select max(innerPs.createdAt)
                from PaymentSession innerPs
                where innerPs.order.id = :orderId
              )
            """)
    Optional<PaymentSession> findLatestByOrderId(UUID orderId);

    @Query("""
            select ps
            from PaymentSession ps
            where ps.order.id in :orderIds
              and ps.createdAt = (
                select max(innerPs.createdAt)
                from PaymentSession innerPs
                where innerPs.order.id = ps.order.id
              )
            """)
    List<PaymentSession> findLatestByOrderIds(Collection<UUID> orderIds);

    @Query("""
            select ps
            from PaymentSession ps
            where ps.providerOrderCode = :providerOrderCode
              and ps.createdAt = (
                select max(innerPs.createdAt)
                from PaymentSession innerPs
                where innerPs.providerOrderCode = :providerOrderCode
              )
            """)
    Optional<PaymentSession> findLatestByProviderOrderCode(Long providerOrderCode);

    @EntityGraph(attributePaths = {"order"})
    List<PaymentSession> findByProviderAndStatusIn(String provider, Collection<String> statuses, Pageable pageable);
}
