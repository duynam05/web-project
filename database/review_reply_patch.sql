CREATE TABLE IF NOT EXISTS `review_reply` (
  `id` binary(16) NOT NULL,
  `review_id` binary(16) NOT NULL,
  `parent_reply_id` binary(16) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_review_reply_review_id` (`review_id`),
  KEY `idx_review_reply_parent_reply_id` (`parent_reply_id`),
  KEY `idx_review_reply_user_id` (`user_id`),
  CONSTRAINT `fk_review_reply_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reply_parent_reply` FOREIGN KEY (`parent_reply_id`) REFERENCES `review_reply` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reply_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
