ALTER TABLE `review_reply`
  ADD COLUMN IF NOT EXISTS `parent_reply_id` binary(16) DEFAULT NULL AFTER `review_id`,
  ADD INDEX `idx_review_reply_parent_reply_id` (`parent_reply_id`),
  ADD CONSTRAINT `fk_review_reply_parent_reply`
    FOREIGN KEY (`parent_reply_id`) REFERENCES `review_reply` (`id`) ON DELETE CASCADE;
