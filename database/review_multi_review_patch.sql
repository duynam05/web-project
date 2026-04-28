ALTER TABLE `review`
  DROP INDEX `uk_review_book_user`;

ALTER TABLE `review`
  MODIFY `status` varchar(32) NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN `customer_reply` varchar(2000) DEFAULT NULL AFTER `admin_reply`,
  ADD COLUMN `customer_replied_at` datetime(6) DEFAULT NULL AFTER `replied_at`;
