-- AlterTable
ALTER TABLE `balance_lines` MODIFY `amount` DECIMAL(12, 2) NOT NULL;

-- AlterTable
ALTER TABLE `invoices` MODIFY `amount` DECIMAL(12, 2) NOT NULL,
    MODIFY `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    MODIFY `taxRate` DECIMAL(5, 2) NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `barcode` TEXT NULL,
    ADD COLUMN `purchasePrice` DECIMAL(12, 2) NULL,
    ADD COLUMN `shelf` TEXT NULL,
    ADD COLUMN `supplier` TEXT NULL,
    MODIFY `price` DECIMAL(12, 2) NOT NULL;

-- AlterTable
ALTER TABLE `service_jobs` MODIFY `labor` DECIMAL(12, 2) NULL;

-- CreateTable
CREATE TABLE `stock_movements` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reversedAt` DATETIME(3) NULL,

    INDEX `stock_movements_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `username` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(256) NOT NULL,
    `failures` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sessions` (
    `tokenHash` VARCHAR(64) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `admin_sessions_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`tokenHash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `stock_movements` ADD CONSTRAINT `stock_movements_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_username_fkey` FOREIGN KEY (`username`) REFERENCES `admins`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;
