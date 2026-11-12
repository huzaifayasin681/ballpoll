-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'SUPPORT', 'BOOSTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CURRENCY', 'ITEM', 'ACCOUNT', 'SERVICE', 'LICENSE_KEY');

-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('INSTANT', 'MANUAL');

-- CreateEnum
CREATE TYPE "RequiredInput" AS ENUM ('UNIQUE_ID', 'CREDENTIALS', 'NONE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'COMPLETED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('EARN_PURCHASE', 'REDEEM', 'REFERRAL_COMMISSION', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'ANSWERED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "lifetimeSpend" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedGameId" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedGameId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "deliveryMode" "DeliveryMode" NOT NULL DEFAULT 'MANUAL',
    "requiredInput" "RequiredInput" NOT NULL DEFAULT 'UNIQUE_ID',
    "deliveryHours" INTEGER NOT NULL DEFAULT 24,
    "region" TEXT NOT NULL DEFAULT 'Global',
    "image" TEXT NOT NULL,
    "badge" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "compareCents" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT -1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountListing" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "winRate" DOUBLE PRECISION NOT NULL,
    "coins" TEXT NOT NULL,
    "cash" INTEGER NOT NULL,
    "cues" TEXT[],
    "rings" TEXT[],
    "sold" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AccountListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseKey" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "keyEnc" TEXT NOT NULL,
    "orderItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicenseKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashSale" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL,
    "productSlug" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FlashSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percentOff" INTEGER NOT NULL,
    "maxUses" INTEGER,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'emerald',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "gameUniqueId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "fxRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "subtotalCents" INTEGER NOT NULL,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "couponCode" TEXT,
    "pointsUsed" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentMethod" TEXT,
    "assignedToId" TEXT,
    "staffNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCents" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCredential" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "loginEnc" TEXT NOT NULL,
    "secretEnc" TEXT NOT NULL,
    "purgeAfter" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "points" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "author" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "readMinutes" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "trackingId" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "SavedGameId_userId_uniqueId_key" ON "SavedGameId"("userId", "uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AccountListing_productId_key" ON "AccountListing"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "LicenseKey_orderItemId_key" ON "LicenseKey"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Order_trackingId_key" ON "Order"("trackingId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderCredential_orderId_key" ON "OrderCredential"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "Payment"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedGameId" ADD CONSTRAINT "SavedGameId_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountListing" ADD CONSTRAINT "AccountListing_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseKey" ADD CONSTRAINT "LicenseKey_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCredential" ADD CONSTRAINT "OrderCredential_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
