-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.45 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for bookstore1
CREATE DATABASE IF NOT EXISTS `bookstore1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bookstore1`;

-- Dumping structure for table bookstore1.book
CREATE TABLE IF NOT EXISTS `book` (
  `id` binary(16) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `rating` double NOT NULL,
  `stock` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.book: ~19 rows (approximately)
INSERT INTO `book` (`id`, `author`, `category`, `image`, `price`, `rating`, `stock`, `title`) VALUES
	(_binary 0x019df0df12107197aaf8deda0bc1d161, 'DALE CARNEGIE', 'Sách tự lực', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968972/books/zojaigglfimqppigs0tf.jpg', 76000.00, 4.9, 20, 'Đắc Nhân Tâm'),
	(_binary 0x019df0e409f170269e05d46e851bcb6a, 'Robert Kiyosaki, Sharon L. Lechter', 'Tài chính cá nhân, Phi hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968887/books/gg9tsceyllgmxfvzcxhn.jpg', 30000.00, 5, 16, 'Cha Giàu Cha Nghèo'),
	(_binary 0x019df0e528e073f095b7e323701b6c1e, 'Tô Hoài', 'Văn học thiếu nhi, Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968956/books/vrzolxwtgjcjzcpbveqa.jpg', 128000.00, 5, 20, 'Dế Mèn Phiêu Lưu Ký'),
	(_binary 0x019df0e7129e721db6e7932311dd9c1f, 'Melanie Barnes', 'Cuộc sống', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969320/books/mlnkvt0tax1ey0ytyaxn.jpg', 50000.00, 4.5, 20, 'Sống Chậm'),
	(_binary 0x019df0e8084e716c821b1c75a7ad1570, 'Daniel Kahneman', 'Phi hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969453/books/rdomsygvkk3mkhe89fud.jpg', 215000.00, 4.9, 20, 'Tư Duy Nhanh Và Chậm'),
	(_binary 0x019df0e9075472a5b658b278349afc48, 'Paulo Coelho', 'Tiểu thuyết, Kịch, Nhiệm vụ, Hư cấu kỳ ảo, Tiểu thuyết giáo dục, Tiểu thuyết phiêu lưu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969156/books/g4zdd5ynieoy6d3ohnan.jpg', 228000.00, 5, 20, 'Nhà Giả Kim'),
	(_binary 0x019df0ee8bba72eabdea11d49ce98054, 'Nam Cao', 'Truyện ngắn, Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968908/books/evpjgd5mrnlvvqosvyue.png', 36000.00, 5, 20, 'Chí Phèo'),
	(_binary 0x019df0f33a917091838790aabc35b3b3, 'Vũ Trọng Phụng', 'Tiểu thuyết, Châm biếm, Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969286/books/zyi0kvysyu3jyxjwgwy7.jpg', 52000.00, 5, 20, 'Số Đỏ'),
	(_binary 0x019df0f4430172aa9a0a0a4421aeccaf, 'Vũ Trọng Phụng', 'Tiểu thuyết', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969058/books/jimar2j8e7hn00mucupg.jpg', 57000.00, 5, 20, 'Làm Đĩ'),
	(_binary 0x019df0f52fa8735580e06743a8a5a1e9, 'Ngô Tất Tố', 'Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969348/books/i21kl1zlf9csecp54jmu.jpg', 35000.00, 5, 20, 'Tắt Đèn'),
	(_binary 0x019df0f662ec738b8ad9a370fa14ef64, 'Nguyễn Ngọc Tư', 'Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968873/books/qcd1zjsihsjmyuq8biyo.jpg', 66000.00, 5, 20, 'Cánh Đồng Bất Tận'),
	(_binary 0x019df0fcc5dd7262a5992ee74361c76d, 'Nguyên Hồng', 'Hư cấu tiểu sử, Tiểu thuyết trong nhà', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969252/books/bg37vdekzp1r98yhki9a.jpg', 60000.00, 5, 20, 'Những Ngày Thơ Ấu'),
	(_binary 0x019df0fdb5c472fdbf2ce578a43fff57, 'Nguyễn Du', 'Truyện thơ', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969372/books/lol5v5rki2bbgvhkpzzq.jpg', 51000.00, 5, 20, 'Truyện Kiều'),
	(_binary 0x019df0ffd6e972c5b204c8ff7b7b2805, 'Hồ Chí Minh', 'Nhật ký', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969194/books/hlefhbexbwyngafl8pls.png', 60000.00, 5, 20, 'Nhật Ký Trong Tù'),
	(_binary 0x019df10106987213bd8c0e8097f366e9, 'Phùng Quán', 'Tiểu thuyết, Tiểu thuyết chiến tranh', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969480/books/six70mzuxbb9nwteod5k.jpg', 68000.00, 5, 20, 'Tuổi Thơ Dữ Dội'),
	(_binary 0x019df103d45e73b1ac1c4aa1b8dd70c8, 'Nguyễn Nhật Ánh', 'Truyện dài', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969123/books/ag2innzk7ffmdqns8kxj.jpg', 104000.00, 5, 20, 'Mắt Biếc'),
	(_binary 0x019df104cb2370499d34e37d90aaa08c, 'Thạch Lam', 'Hư cấu', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969013/books/zehaxmfxeuj5tt3elm6c.jpg', 54000.00, 5, 20, 'Gió Lạnh Đầu Mùa'),
	(_binary 0x019df1065ced71ccb9a0a7a675e980ec, 'Nguyễn Tuân', 'Tập tùy bút, truyện ngắn', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969510/books/oeolni8znl8urirsn0is.jpg', 148750.00, 5, 20, 'Vang Bóng Một Thời'),
	(_binary 0x019df5c11a3e73bebb6a70f02d024ba4, 'nam', 'nam', 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777969082/books/jthpsct9afreezryikuv.jpg', 2000.00, 5, 38, 'Lập trình python');

-- Dumping structure for table bookstore1.cart_item
CREATE TABLE IF NOT EXISTS `cart_item` (
  `id` binary(16) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `book_id` binary(16) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_book` (`user_id`,`book_id`),
  KEY `FKis5hg85qbs5d91etr4mvd4tx6` (`book_id`),
  CONSTRAINT `FKis5hg85qbs5d91etr4mvd4tx6` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  CONSTRAINT `FKjnaj4sjyqjkr4ivemf9gb25w` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.cart_item: ~0 rows (approximately)
INSERT INTO `cart_item` (`id`, `image`, `price`, `quantity`, `title`, `book_id`, `user_id`) VALUES
	(_binary 0xd1c9db2226cb43f6b10a247b8b3d2900, 'https://res.cloudinary.com/dwuzfsijt/image/upload/v1777968873/books/qcd1zjsihsjmyuq8biyo.jpg', 66000.00, 1, 'Cánh Đồng Bất Tận', _binary 0x019df0f662ec738b8ad9a370fa14ef64, '64fa7c45-a939-4421-8349-20520935c7d6');

-- Dumping structure for table bookstore1.invalidated_token
CREATE TABLE IF NOT EXISTS `invalidated_token` (
  `id` varchar(255) NOT NULL,
  `expiry_time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.invalidated_token: ~29 rows (approximately)
INSERT INTO `invalidated_token` (`id`, `expiry_time`) VALUES
	('01d0c7f4-0996-4edd-912c-b5ec7607bc8a', '2026-05-27 07:28:15.000000'),
	('106d488f-26fd-47ee-9d44-8d953ae07334', '2026-04-20 18:54:35.000000'),
	('206baaae-295c-4adb-b58b-2b73fad66e6f', '2026-04-22 10:27:35.000000'),
	('28b5117c-971d-4752-aace-aeb1e3f8eb62', '2026-04-20 19:29:22.000000'),
	('3c67c157-ea1a-4536-a4ba-0d813502fdca', '2026-04-21 06:32:50.000000'),
	('41f09222-6348-4547-b023-e9d99d437115', '2026-04-22 17:05:55.000000'),
	('43240011-c215-4ce6-92eb-41d408686cc9', '2026-05-26 07:06:03.000000'),
	('47991225-93dc-4537-b2d8-c3d3cef1a703', '2026-04-22 17:21:00.000000'),
	('56b78c43-e3d1-4a89-a6ce-52447b858887', '2026-04-20 18:31:46.000000'),
	('5923de33-0d24-4788-aff2-0c5e18084cac', '2026-04-22 17:16:47.000000'),
	('5ebc2e69-bf4f-4b04-b491-afbcdf5fc0c5', '2026-04-22 10:27:08.000000'),
	('613b78f3-8818-4265-b513-7d42fa5dd948', '2026-04-22 02:27:13.000000'),
	('79f7b969-4363-419a-a289-0656a6706e0b', '2026-04-22 12:44:53.000000'),
	('7dcb2202-1f31-4272-977a-07654ce3155f', '2026-04-20 13:14:33.000000'),
	('8ac5f4e4-d907-4567-a66b-dbccb059392a', '2026-04-25 16:52:56.000000'),
	('8e0eb444-adb5-4bf2-bb0d-66c6412da6f5', '2026-04-22 12:46:57.000000'),
	('a3a9791e-8a2c-4e5b-9189-bc5383435a8a', '2026-04-20 13:16:29.000000'),
	('aa5353f9-5dd0-459e-85df-12f176f174c0', '2026-04-22 17:23:20.000000'),
	('ae29531a-9c9c-4b35-bb4e-c17dd1fe2259', '2026-04-20 13:12:21.000000'),
	('cc02a09b-a829-4a7a-9aef-4cb814d4471f', '2026-04-20 18:53:23.000000'),
	('cfde0eb1-5a67-4187-9243-5b369480d470', '2026-04-22 17:03:04.000000'),
	('d536ba94-00db-49cf-bdc0-99a4541a7084', '2026-04-20 19:05:31.000000'),
	('da245452-c944-4521-86cd-ea7663c11d48', '2026-04-20 18:51:15.000000'),
	('e7815508-1aeb-4c8b-ac5d-1a03b307f137', '2026-04-21 06:53:43.000000'),
	('ee671448-ab3b-44db-9118-c7a328fe8c6f', '2026-04-17 16:02:18.000000'),
	('f155807b-1e00-41ea-b2d7-5446d09cb968', '2026-04-22 21:09:31.000000'),
	('f6a120a4-f011-43b2-b6cb-124ef7dca7db', '2026-04-17 19:29:43.000000'),
	('fa949a88-2834-45c3-9731-817207590edf', '2026-04-22 11:14:55.000000'),
	('fbf0316b-d7c2-4aea-b7ff-837bfad32477', '2026-04-20 19:14:42.000000');

-- Dumping structure for table bookstore1.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` binary(16) NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(32) DEFAULT NULL,
  `payment_reference` varchar(64) DEFAULT NULL,
  `payment_status` varchar(32) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.orders: ~30 rows (approximately)
INSERT INTO `orders` (`id`, `address`, `created_at`, `latitude`, `longitude`, `paid_at`, `payment_method`, `payment_reference`, `payment_status`, `phone`, `status`, `total_price`, `user_id`) VALUES
	(_binary 0x108df3213fe744f6b660436356347137, '123 Nguyen Trai, Q1', '2026-04-22 03:07:01.523565', 10.7769, 106.7009, '2026-04-22 03:07:41.028369', 'ONLINE', 'PAY-EC2651675E7B', 'PAID', '0912345678', 'CONFIRMED', 847000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0x10fd7cbfcc904a0cba7c9b97b55e10b5, 'A', '2026-04-22 11:10:34.576207', NULL, NULL, '2026-04-22 11:10:34.653264', 'ONLINE', 'PAY-E4CFAF906176', 'REFUNDED', '0123456789', 'CANCELLED', 199000.00, '8a52c7ee-5b10-4739-91a4-276689836ce0'),
	(_binary 0x15513c7461bc483c8758d3455d0fe127, 'a', '2026-04-29 04:29:28.021915', NULL, NULL, NULL, 'BANK_TRANSFER', 'DH-15513C74', 'PENDING', '0123456789', 'PENDING_PAYMENT', 7000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0x2a6ee379a7b04aec99cbd3e6578c41d6, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 12:10:38.614398', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 199000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0x2ad83a3382b34e7c9e01b668bb8a48e8, 'A', '2026-04-22 09:29:36.811946', NULL, NULL, '2026-04-22 09:29:36.883521', 'ONLINE', 'PAY-D299ADEE7C8E', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x37deed4b1aa74bdc8722730aaa9c58f9, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 13:00:16.199391', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 597000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0x3cb846a008a946a7a6845be404fecb41, 'A', '2026-04-22 08:33:07.755172', NULL, NULL, '2026-04-22 08:33:07.865761', 'ONLINE', 'PAY-94F1FA717A33', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x3de6e14fce1049e9b21f6d0dbbf337ff, 'A', '2026-04-22 09:51:56.134147', NULL, NULL, '2026-04-22 09:51:56.220687', 'ONLINE', 'PAY-975BD9D1C482', 'REFUNDED', '0123456789', 'CANCELLED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x3ff0dad734da47f494afa3aa214415e9, 'A', '2026-04-22 10:28:47.357631', NULL, NULL, '2026-04-22 10:28:47.442175', 'ONLINE', 'PAY-8F1582147FAB', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x4f71bd21affb49e1b853b49b7bf12222, 'a', '2026-05-22 03:06:45.903520', NULL, NULL, '2026-05-22 03:06:46.155709', 'ONLINE', 'PAY-DABCEA6BAF97', 'REFUNDED', '0123456789', 'CANCELLED', 3000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0x55242053caf340b1b2bff2f9686e06fd, 'A', '2026-04-22 09:27:05.125098', NULL, NULL, '2026-04-22 09:27:05.206921', 'ONLINE', 'PAY-218C3F4D66AE', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x57704f345c284bf9ba0e944e10cdccc1, 'a', '2026-04-23 07:52:00.198941', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0368619745', 'PENDING', 398000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0x5ecd023c467640b3b655ca65ddda5d09, 'abc', '2026-04-29 02:41:39.168247', NULL, NULL, NULL, 'BANK_TRANSFER', 'DH-5ECD023C', 'PENDING', '0368619745', 'PENDING_PAYMENT', 398000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0x6555c235709e447481cf0c279a121d48, 'A', '2026-04-22 08:23:31.034298', NULL, NULL, '2026-04-22 08:23:31.305576', 'ONLINE', 'PAY-C298F54E59F7', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x728085e1673d4661b582581154b5c748, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 13:53:56.539061', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 1494000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0x78a540a7702646619634259234e0743b, 'A', '2026-04-22 08:35:01.810838', NULL, NULL, '2026-04-22 08:35:02.025247', 'ONLINE', 'PAY-BD3C6C1E3B2C', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x8e03577f60b6407582c8004581c3e331, 'A', '2026-04-22 08:31:42.250213', NULL, NULL, '2026-04-22 08:31:42.342214', 'ONLINE', 'PAY-6BD98037D881', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x9877536d4e07464d9b7ea7d951741da9, 'A', '2026-04-22 08:22:56.128486', NULL, NULL, '2026-04-22 08:22:56.243205', 'ONLINE', 'PAY-275ECD75AB46', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0x9b4b13781c1c4dd3aba1dce4e42644f1, 'a', '2026-04-23 13:51:55.722427', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 249000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0xacea9ebb83024fb5864a78db4da9f3a4, 'A', '2026-04-22 08:40:18.845058', NULL, NULL, '2026-04-22 08:40:18.961830', 'ONLINE', 'PAY-7C03974C5804', 'PAID', '0123456789', 'SHIPPING', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0xb23c565adf484b27a4a3516f8e3b4c6b, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 12:35:43.975941', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 1393000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0xb687ba21aef44e6692cfc037dde988ec, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 12:26:52.809043', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 796000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0xb9688d6aebe6410cbd8cdcdfebface83, 'A', '2026-04-22 11:12:26.884722', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'SHIPPING', 796000.00, '8a52c7ee-5b10-4739-91a4-276689836ce0'),
	(_binary 0xbdb50118d55f4d089a8f117873d6cd86, 'a', '2026-05-22 12:47:45.339440', NULL, NULL, '2026-05-22 12:47:45.505406', 'ONLINE', 'PAY-9955597C149D', 'PAID', '0123456789', 'CONFIRMED', 3000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0xbe9e8fadf0744dd8b655107f1a142d51, 'Cầu Ninh Đa, Ninh Hòa, Phường Ninh Hòa, Khánh Hòa, Việt Nam', '2026-04-23 13:46:54.876873', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 249000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0xc61630026b5441f2abc73689166aa964, 'Tỉnh Ninh Bình, Việt Nam', '2026-04-23 12:12:31.064826', NULL, NULL, NULL, 'COD', NULL, 'UNPAID', '0123456789', 'PENDING', 398000.00, '2e77e0c6-6968-4edd-8125-6119d83f9a81'),
	(_binary 0xcbfc37ee607a4acbaaeaff4998c4c842, 'A', '2026-04-22 08:09:54.193210', NULL, NULL, '2026-04-22 08:09:54.469677', 'ONLINE', 'PAY-2EF0149AEA8A', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0xd29577c77b1f4e4aab2df582268e147f, 'A', '2026-04-22 09:26:41.708664', NULL, NULL, '2026-04-22 09:26:41.846716', 'ONLINE', 'PAY-B8D6822F0C1B', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2'),
	(_binary 0xdc52109236b44deda1f4b8154221d87c, 'a', '2026-04-29 02:56:20.113210', NULL, NULL, NULL, 'BANK_TRANSFER', 'DH-DC521092', 'PENDING', '0123456789', 'PENDING_PAYMENT', 7000.00, '64fa7c45-a939-4421-8349-20520935c7d6'),
	(_binary 0xe3353cb257534ba3839986a4221f10db, 'A', '2026-04-22 08:26:58.166887', NULL, NULL, '2026-04-22 08:26:58.267743', 'ONLINE', 'PAY-C09CA4F19E0B', 'PAID', '0123456789', 'CONFIRMED', 199000.00, '99ac3f13-77c3-41c9-b381-163c2cc111a2');

-- Dumping structure for table bookstore1.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` binary(16) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `quantity` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `book_id` binary(16) NOT NULL,
  `order_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqscqcme08spiyt2guyqdj72eh` (`book_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKqscqcme08spiyt2guyqdj72eh` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.order_items: ~0 rows (approximately)

-- Dumping structure for table bookstore1.payment_session
CREATE TABLE IF NOT EXISTS `payment_session` (
  `id` binary(16) NOT NULL,
  `order_id` binary(16) NOT NULL,
  `provider` varchar(32) NOT NULL,
  `status` varchar(32) NOT NULL,
  `amount` decimal(19,2) NOT NULL,
  `reference` varchar(64) NOT NULL,
  `qr_url` varchar(512) DEFAULT NULL,
  `payment_url` varchar(512) DEFAULT NULL,
  `provider_transaction_id` varchar(64) DEFAULT NULL,
  `provider_order_code` bigint DEFAULT NULL,
  `provider_payment_link_id` varchar(64) DEFAULT NULL,
  `callback_token` varchar(128) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payment_session_callback_token` (`callback_token`),
  KEY `idx_payment_session_order_id_created_at` (`order_id`,`created_at`),
  KEY `idx_payment_session_provider_order_code` (`provider_order_code`),
  CONSTRAINT `fk_payment_session_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.payment_session: ~0 rows (approximately)

-- Dumping structure for table bookstore1.permission
CREATE TABLE IF NOT EXISTS `permission` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.permission: ~0 rows (approximately)

-- Dumping structure for table bookstore1.review
CREATE TABLE IF NOT EXISTS `review` (
  `id` binary(16) NOT NULL,
  `book_id` binary(16) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `content` varchar(2000) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL,
  `verified_purchase` bit(1) NOT NULL DEFAULT b'0',
  `admin_reply` varchar(2000) DEFAULT NULL,
  `customer_reply` varchar(2000) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `replied_at` datetime(6) DEFAULT NULL,
  `customer_replied_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_review_book_id` (`book_id`),
  KEY `idx_review_user_id` (`user_id`),
  KEY `idx_review_status` (`status`),
  CONSTRAINT `fk_review_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.review: ~3 rows (approximately)
INSERT INTO `review` (`id`, `book_id`, `user_id`, `rating`, `content`, `status`, `verified_purchase`, `admin_reply`, `customer_reply`, `created_at`, `updated_at`, `replied_at`, `customer_replied_at`) VALUES
	(_binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0x81afb1e4981a48e481554e27d1978d9f, '64fa7c45-a939-4421-8349-20520935c7d6', 4, 'a', 'APPROVED', b'0', NULL, NULL, '2026-04-28 08:52:07.035809', '2026-04-28 13:20:15.601864', NULL, NULL),
	(_binary 0x82e5708ae76d48bb8fee73422b582d21, _binary 0x81afb1e4981a48e481554e27d1978d9f, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 3, 'b', 'APPROVED', b'0', NULL, 'c', '2026-04-28 08:19:41.841191', '2026-04-28 08:22:00.933638', NULL, '2026-04-28 08:22:00.917826'),
	(_binary 0xb390b20f8c154c48b8ab2bc139eaff12, _binary 0x282b835a6128445e941a3ed91a21b210, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 4, 'a', 'APPROVED', b'0', NULL, NULL, '2026-04-28 13:03:02.913739', '2026-04-28 13:20:00.096167', NULL, NULL),
	(_binary 0xd43d664c16d040a5ac80ad03b69a3ed8, _binary 0x019df0f662ec738b8ad9a370fa14ef64, '64fa7c45-a939-4421-8349-20520935c7d6', 5, 'hay', 'APPROVED', b'0', NULL, NULL, '2026-05-23 08:54:33.065780', '2026-05-23 08:54:33.065780', NULL, NULL);

-- Dumping structure for table bookstore1.review_reply
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
  KEY `idx_review_reply_user_id` (`user_id`),
  KEY `idx_review_reply_parent_reply_id` (`parent_reply_id`),
  CONSTRAINT `fk_review_reply_parent_reply` FOREIGN KEY (`parent_reply_id`) REFERENCES `review_reply` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reply_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reply_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.review_reply: ~14 rows (approximately)
INSERT INTO `review_reply` (`id`, `review_id`, `parent_reply_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
	(_binary 0x25f442d74f8c4ccea602f7183cac1346, _binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0x520afbfd4aed4e6a907a2234fe213e47, '6ec7989f-eddc-498f-be66-ee8973ec88ed', 'cảm ơn bạn', '2026-04-28 09:37:48.018401', '2026-04-28 09:37:48.018401'),
	(_binary 0x317688b7b7934051bfe29a100c650627, _binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0x520afbfd4aed4e6a907a2234fe213e47, '6ec7989f-eddc-498f-be66-ee8973ec88ed', 'abc', '2026-04-28 12:31:02.031985', '2026-04-28 12:31:02.031985'),
	(_binary 0x340fa132280d44989064459132a5ee84, _binary 0x82e5708ae76d48bb8fee73422b582d21, _binary 0x80f203396c754c64a483a80800436c19, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 'ok', '2026-04-28 12:29:07.932286', '2026-04-28 12:29:07.932286'),
	(_binary 0x42bff5e2f91b476c931801f06d9e3a0b, _binary 0x82e5708ae76d48bb8fee73422b582d21, _binary 0x80f203396c754c64a483a80800436c19, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 'abc', '2026-04-28 12:45:06.118115', '2026-04-28 12:45:06.118115'),
	(_binary 0x4654aa7ec3a949589a26dab4e06c5222, _binary 0x547adbc44aa0442690cf6bde98d4ce20, NULL, '6ec7989f-eddc-498f-be66-ee8973ec88ed', 'cẳm ơn', '2026-04-28 13:20:21.416997', '2026-04-28 13:20:21.416997'),
	(_binary 0x520afbfd4aed4e6a907a2234fe213e47, _binary 0x547adbc44aa0442690cf6bde98d4ce20, NULL, '64fa7c45-a939-4421-8349-20520935c7d6', 'c', '2026-04-28 08:52:27.802608', '2026-04-28 08:52:27.802608'),
	(_binary 0x80f203396c754c64a483a80800436c19, _binary 0x82e5708ae76d48bb8fee73422b582d21, NULL, '64fa7c45-a939-4421-8349-20520935c7d6', 'e', '2026-04-28 08:48:37.700316', '2026-04-28 08:49:52.634450'),
	(_binary 0x9fbb8c248b774349b9af39df3364f9e3, _binary 0x82e5708ae76d48bb8fee73422b582d21, _binary 0x340fa132280d44989064459132a5ee84, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 'abc', '2026-04-28 12:44:56.083065', '2026-04-28 12:44:56.083065'),
	(_binary 0xbb012d1d1c624db5b4f28d9f0620f75d, _binary 0xb390b20f8c154c48b8ab2bc139eaff12, NULL, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 'b', '2026-04-28 13:03:08.085186', '2026-04-28 13:03:08.085186'),
	(_binary 0xbe913eaa909f4b348766079dae239448, _binary 0xb390b20f8c154c48b8ab2bc139eaff12, _binary 0xbb012d1d1c624db5b4f28d9f0620f75d, '2e77e0c6-6968-4edd-8125-6119d83f9a81', 'c', '2026-04-28 13:03:11.879987', '2026-04-28 13:03:11.879987'),
	(_binary 0xc2c94442ece5485babb8711d13bb6baf, _binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0xd9d0b9941b404c0abe2c8273b9137572, '6ec7989f-eddc-498f-be66-ee8973ec88ed', 'cảm ơn bạn', '2026-04-28 09:38:05.553941', '2026-04-28 09:38:05.553941'),
	(_binary 0xd9d0b9941b404c0abe2c8273b9137572, _binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0xdbc39da8afa2469686ddd7c6d4aac4c0, '64fa7c45-a939-4421-8349-20520935c7d6', 'e', '2026-04-28 08:55:37.811090', '2026-04-28 08:55:37.811090'),
	(_binary 0xdbc39da8afa2469686ddd7c6d4aac4c0, _binary 0x547adbc44aa0442690cf6bde98d4ce20, _binary 0x520afbfd4aed4e6a907a2234fe213e47, '64fa7c45-a939-4421-8349-20520935c7d6', 'c', '2026-04-28 08:55:34.667073', '2026-04-28 08:55:34.667073'),
	(_binary 0xf13b16c1467f45c5821d6d2d53ce2fb2, _binary 0xb390b20f8c154c48b8ab2bc139eaff12, _binary 0xbb012d1d1c624db5b4f28d9f0620f75d, '6ec7989f-eddc-498f-be66-ee8973ec88ed', 'cảm ơn', '2026-04-28 13:20:11.959332', '2026-04-28 13:20:11.959332');

-- Dumping structure for table bookstore1.role
CREATE TABLE IF NOT EXISTS `role` (
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.role: ~2 rows (approximately)
INSERT INTO `role` (`name`, `description`) VALUES
	('ADMIN', 'Admin role'),
	('USER', 'User role');

-- Dumping structure for table bookstore1.role_permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_name` varchar(255) NOT NULL,
  `permissions_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_name`,`permissions_name`),
  KEY `FKf5aljih4mxtdgalvr7xvngfn1` (`permissions_name`),
  CONSTRAINT `FKcppvu8fk24eqqn6q4hws7ajux` FOREIGN KEY (`role_name`) REFERENCES `role` (`name`),
  CONSTRAINT `FKf5aljih4mxtdgalvr7xvngfn1` FOREIGN KEY (`permissions_name`) REFERENCES `permission` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.role_permissions: ~0 rows (approximately)

-- Dumping structure for table bookstore1.system_settings
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` bigint NOT NULL,
  `new_review` bit(1) NOT NULL,
  `office_address` varchar(255) DEFAULT NULL,
  `periodic_email` bit(1) NOT NULL,
  `stock_alert` bit(1) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `support_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.system_settings: ~1 rows (approximately)
INSERT INTO `system_settings` (`id`, `new_review`, `office_address`, `periodic_email`, `stock_alert`, `store_name`, `support_phone`) VALUES
	(1, b'0', 'Hà Nội', b'1', b'0', 'BookStore', '0368619745');

-- Dumping structure for table bookstore1.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','DISABLED') DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `two_factor_enabled` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.user: ~18 rows (approximately)
INSERT INTO `user` (`id`, `address`, `dob`, `email`, `full_name`, `password`, `phone`, `status`, `bio`, `two_factor_enabled`) VALUES
	('2e77e0c6-6968-4edd-8125-6119d83f9a81', 'ninh bình', NULL, 'user4@gmail.com', 'Trịnh Duy Nam', '$2a$10$Bncs7rFwCbz48TjQiCCx8evy38TGg.WcE54eYL6q0GyeGSwcHavN.', '0123456788', 'ACTIVE', NULL, NULL),
	('4d06d5f1-7265-4efb-9d94-6be865fa5f88', 'A', NULL, 'user6@gmail.com', 'Trịnh Duy Nam', '$2a$10$oc8zI2MX8ZfY7C9u35Hc3OVMLz0gdMUdq2yqcA0PABOSoEZc3NHVK', '0123456789', 'ACTIVE', NULL, NULL),
	('5f273efa-c691-456a-baeb-7375e4785390', NULL, '2001-05-20', 'user12@example.com', 'duy nam', '$2a$10$iAqmdconxlIGy5WskzxyquPVpQb3C2X1f/sU2wIzdN8dSVqGEo3O.', NULL, 'ACTIVE', NULL, NULL),
	('61fbbe9b-4b29-4afc-960c-a864d64098d8', NULL, NULL, 'user@gmail.com', 'Trịnh Duy Nam', '$2a$10$KFF.mPja0wRYU/ygS1TnfOmAnRD5.I7/iuIRSHoqjKaQPHA.lvFCe', NULL, 'ACTIVE', NULL, NULL),
	('64fa7c45-a939-4421-8349-20520935c7d6', 'a', NULL, 'a@gmail.com', 'A', '$2a$10$7Hz9g8F1qlu.p0NqNbnO/eIRFZEngPfthGXBRLVe0.JbshFik0yDi', '0123456789', 'ACTIVE', NULL, NULL),
	('66ee5a06-182a-45c7-a19c-9a5bd1f3dd5a', NULL, '2000-01-15', 'user1@gmail.com', 'Nguyen Van A', '$2a$10$EF24PgPdWcgJcrG9R.pBleTDBw2bkdQSkOrsBjd1IQ/VdNLKPbWbi', NULL, 'ACTIVE', NULL, NULL),
	('6ec7989f-eddc-498f-be66-ee8973ec88ed', 'Test Address', NULL, 'admin@admin.com', 'ADMIN', '$2a$10$jLGGhxxs2Nd5v85BIHm67OmQ8DrFYGVymefGxLMNHdBqq5d9fYJ4y', '0123456789', 'ACTIVE', 'đây là admin', b'0'),
	('7e22ba4b-295a-4f89-b667-809b4e3d5c95', NULL, '2000-01-15', 'user10@gmail.com', 'Nguyen Van A', '$2a$10$PDQ0hu2v5EjHJsj2M/Ye3OnH82uELzlqzkPyR8PEiqB7eFiTssO1S', NULL, 'ACTIVE', NULL, NULL),
	('8a52c7ee-5b10-4739-91a4-276689836ce0', 'A', NULL, 't@gmail.com', 'Trịnh Duy Nam', '$2a$10$PIFfhCDp099tx4UG5wWoMeHbr3PmieiKrb/3jA9iblrSwQVT/Dwke', '0123456789', 'ACTIVE', NULL, NULL),
	('9093a5bb-10d4-4a68-ab8e-d6bf86399221', NULL, NULL, 'o@gmail.com', 'abc', '$2a$10$dDHL4aSmhYdVdYHc9ZELo.bhRlAW7BAytjILMmA/8IlYdTa2Xt0qK', NULL, 'ACTIVE', NULL, NULL),
	('99ac3f13-77c3-41c9-b381-163c2cc111a2', 'A', NULL, 'user9@gmail.com', 'Trịnh Duy Nam', '$2a$10$XERJ8AqFRut51LEdeHozsunb8O5XrYRxFtNVbJAh.IUQgW5KNs6V2', '0123456789', 'ACTIVE', NULL, NULL),
	('abf5a6bc-186a-4755-b853-d43d83e7fcc0', NULL, NULL, 'a@edu.epu', 'Duy Nam', '$2a$10$.9pjyhnsCBIT5frGMC0.3.bjMKv7T9uOueg3muTHr7aMhh67FSFRK', NULL, 'ACTIVE', NULL, NULL),
	('b9a20bc0-1442-467c-a031-c59dc780ed22', NULL, NULL, 'c@gmail.com', 'Trịnh Duy Nam', '$2a$10$XfTkmx4tN/EQz149RDjt3OUIlQEjO27G4sqq03HjNBaKxQ2e45neq', NULL, 'ACTIVE', NULL, NULL),
	('bc13023d-168d-43cd-9ea3-563643983fb5', '78', NULL, 'b@gmail.com', 'Duy nam', '$2a$10$a4yqcwaGD8VyfDZXPykO5OXZ4zRNjewp3vZkrjDYFDr07x0mUJAiW', '', 'ACTIVE', NULL, NULL),
	('c24bb53b-3bee-46d9-8c93-d68a4f59607f', NULL, '2000-01-15', 'user3@gmail.com', 'Nguyen Van A', '$2a$10$FjtHLHfKF1v8xqPRUAggcuEAg.adLNNtCW9XTMwylTnBFSMG/VAKy', NULL, 'ACTIVE', NULL, NULL),
	('d08419cc-852d-4f17-8c69-cf08baa158a2', NULL, '2001-05-20', 'user8@example.com', 'duy nam', '$2a$10$3/sflMxPnz0LBAsnRlxVI.d/7A3fL1eazEN6sV2YezjAFdwuZCk32', NULL, 'ACTIVE', NULL, NULL),
	('f622aea4-3041-4373-a5f3-f7e78958a314', NULL, '2000-01-15', 'user2@gmail.com', 'Nguyen Van A', '$2a$10$p2rep0fsO8guWP6va4xYIeUILGwmYIjmrG/FFNZNUYTwixpY1vUtW', NULL, 'ACTIVE', NULL, NULL),
	('fb7aada3-5057-49b7-b3dc-cdf6dfe2fd62', NULL, '2000-01-15', 'user7@gmail.com', 'Nguyen Van A', '$2a$10$Tbuyco51VRRMPvtbzZgCJunPqL5VK.45Y.e/l8mGw.8YSqCuuWegG', NULL, 'ACTIVE', NULL, NULL);

-- Dumping structure for table bookstore1.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` varchar(255) NOT NULL,
  `roles_name` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`,`roles_name`),
  KEY `FK6pmbiap985ue1c0qjic44pxlc` (`roles_name`),
  CONSTRAINT `FK55itppkw3i07do3h7qoclqd4k` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK6pmbiap985ue1c0qjic44pxlc` FOREIGN KEY (`roles_name`) REFERENCES `role` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table bookstore1.user_roles: ~18 rows (approximately)
INSERT INTO `user_roles` (`user_id`, `roles_name`) VALUES
	('2e77e0c6-6968-4edd-8125-6119d83f9a81', 'USER'),
	('4d06d5f1-7265-4efb-9d94-6be865fa5f88', 'USER'),
	('5f273efa-c691-456a-baeb-7375e4785390', 'USER'),
	('61fbbe9b-4b29-4afc-960c-a864d64098d8', 'USER'),
	('64fa7c45-a939-4421-8349-20520935c7d6', 'USER'),
	('66ee5a06-182a-45c7-a19c-9a5bd1f3dd5a', 'USER'),
	('6ec7989f-eddc-498f-be66-ee8973ec88ed', 'ADMIN'),
	('7e22ba4b-295a-4f89-b667-809b4e3d5c95', 'USER'),
	('8a52c7ee-5b10-4739-91a4-276689836ce0', 'USER'),
	('9093a5bb-10d4-4a68-ab8e-d6bf86399221', 'USER'),
	('99ac3f13-77c3-41c9-b381-163c2cc111a2', 'USER'),
	('abf5a6bc-186a-4755-b853-d43d83e7fcc0', 'USER'),
	('b9a20bc0-1442-467c-a031-c59dc780ed22', 'USER'),
	('bc13023d-168d-43cd-9ea3-563643983fb5', 'USER'),
	('c24bb53b-3bee-46d9-8c93-d68a4f59607f', 'USER'),
	('d08419cc-852d-4f17-8c69-cf08baa158a2', 'USER'),
	('f622aea4-3041-4373-a5f3-f7e78958a314', 'USER'),
	('fb7aada3-5057-49b7-b3dc-cdf6dfe2fd62', 'USER');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
