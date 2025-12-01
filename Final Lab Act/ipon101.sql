-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 03:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ipon101`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `userId`) VALUES
(4, 'Travel', 3),
(5, 'Travel', 4),
(6, 'Food', 5),
(7, 'Travel', 5),
(8, 'Allowance', 5),
(9, 'Clothes', 5),
(10, 'Part-Time Job', 5);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT 0.00,
  `type` enum('income','expense') DEFAULT 'expense',
  `categoryId` int(11) DEFAULT NULL,
  `transactionDate` date DEFAULT curdate(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `description`, `amount`, `type`, `categoryId`, `transactionDate`, `createdAt`, `userId`) VALUES
(1, 'Baon', 400.00, 'income', 4, '2025-11-24', '2025-11-24 07:54:50', 3),
(2, 'UST Tricycle', 20.00, 'expense', 4, '2025-11-24', '2025-11-24 07:55:06', 3),
(3, 'Allowance', 600.00, 'income', 5, '2025-11-24', '2025-11-24 08:00:32', 4),
(4, 'Salad', 250.00, 'expense', 6, '2025-12-01', '2025-12-01 12:49:40', 5),
(5, 'Tapsilog', 100.00, 'expense', 6, '2025-12-01', '2025-12-01 13:17:09', 5),
(7, 'Weekly Budget', 3000.00, 'income', 8, '2025-12-01', '2025-12-01 13:18:04', 5),
(8, 'Sweatshirt', 450.00, 'expense', 9, '2025-12-01', '2025-12-01 13:18:32', 5),
(9, 'Tank Top', 200.00, 'expense', 9, '2025-12-02', '2025-12-01 13:36:27', 5),
(10, 'Grab', 278.00, 'expense', 7, '2025-11-30', '2025-12-01 13:37:36', 5),
(11, 'Coffee', 180.00, 'expense', 6, '2025-12-03', '2025-12-01 13:38:59', 5),
(12, 'Bus', 40.00, 'expense', 7, '2025-12-02', '2025-12-01 13:39:20', 5),
(13, 'Salary', 500.00, 'income', 10, '2025-12-01', '2025-12-01 13:55:39', 5),
(14, 'Salary', 500.00, 'income', 10, '2025-12-02', '2025-12-01 13:55:53', 5),
(15, 'Salary (Half-Day)', 300.00, 'income', 10, '2025-12-03', '2025-12-01 13:56:13', 5),
(16, 'Egg Tray', 120.00, 'expense', 6, '2025-12-02', '2025-12-01 13:56:42', 5),
(17, 'Grab', 350.00, 'expense', 7, '2025-12-02', '2025-12-01 13:56:54', 5),
(18, 'Salary', 2000.00, 'income', 10, '2025-12-09', '2025-12-01 14:08:19', 5),
(19, 'Shorts', 500.00, 'expense', 9, '2025-12-10', '2025-12-01 14:08:28', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `createdAt`) VALUES
(3, 'tyrone', 'tyrone@gmail.com', '$2a$10$01vEXdYNmKwM6kCHcHQGcOcOlbJB/PKtc/.svKYQ0yfAa5UzSNGPu', '2025-11-24 07:45:29'),
(4, 'kenny', 'kenny@gmail.com', '$2a$10$XfM2.xHZhj4Q5ZKM7fjcVOQQEX6nrm/wsj4heycyX.6T9WkImp/rq', '2025-11-24 07:55:26'),
(5, 'nix', 'nix@gmail.com', '$2a$10$Z2JbkX8J67PwvBjDZ5QVReBpHHxXt0RWHP34TDTpnoxEyrPpeDYcG', '2025-12-01 12:45:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_categories_userId` (`userId`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `idx_transactions_userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
