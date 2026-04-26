ALTER TABLE `user`
  ADD COLUMN `bio` varchar(1000) DEFAULT NULL,
  ADD COLUMN `two_factor_enabled` bit(1) DEFAULT b'0';

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` bigint NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `support_phone` varchar(255) DEFAULT NULL,
  `office_address` varchar(255) DEFAULT NULL,
  `periodic_email` bit(1) NOT NULL DEFAULT b'1',
  `stock_alert` bit(1) NOT NULL DEFAULT b'1',
  `new_review` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `system_settings` (`id`, `store_name`, `support_phone`, `office_address`, `periodic_email`, `stock_alert`, `new_review`)
VALUES (1, 'BookStore', '', '', b'1', b'1', b'0')
ON DUPLICATE KEY UPDATE `id` = `id`;
