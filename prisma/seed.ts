import "dotenv/config";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

function encrypt(plain: string) {
  const key = createHash("sha256").update(process.env.VAULT_KEY!).digest();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString("base64");
}
const code = (n = 6) =>
  Array.from(randomBytes(n), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");

type V = { label: string; price: number; compare?: number; stock?: number };
type P = {
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  type: "CURRENCY" | "ITEM" | "ACCOUNT" | "SERVICE" | "LICENSE_KEY";
  deliveryMode?: "INSTANT" | "MANUAL";
  requiredInput?: "UNIQUE_ID" | "CREDENTIALS" | "NONE";
  deliveryHours: number;
  image: string;
  badge?: string;
  featured?: boolean;
  variants: V[];
  account?: { level: number; winRate: number; coins: string; cash: number; cues: string[]; rings: string[] };
};

const catalog: { slug: string; name: string; tagline: string; description: string; icon: string; products: P[] }[] = [
  {
    slug: "coins-cash",
    name: "Coins & Cash Top-Up",
    tagline: "From 1M to 10B+ coins, delivered fast",
    description:
      "Top up your 8 Ball Pool balance with coin packs, cash bundles, Golden Shots and scratch card refills. Just enter your Miniclip Unique ID.",
    icon: "Coins",
    products: [
      {
        slug: "8-ball-pool-coins",
        name: "8 Ball Pool Coins",
        shortDesc: "Coin packs from 1 Million to 10 Billion, sent to your Unique ID.",
        description:
          "Get the coins you need to play high-stakes tables like Berlin, Venice and beyond. Choose a pack, enter your Miniclip Unique ID and our team delivers straight to your profile. Bulk packs come with the best per-million price.",
        type: "CURRENCY",
        deliveryHours: 2,
        image: "coins",
        badge: "Best Seller",
        featured: true,
        variants: [
          { label: "1M Coins", price: 199 },
          { label: "5M Coins", price: 799, compare: 995 },
          { label: "10M Coins", price: 1399, compare: 1990 },
          { label: "50M Coins", price: 5999, compare: 9950 },
          { label: "100M Coins", price: 10999, compare: 19900 },
          { label: "500M Coins", price: 44999, compare: 99500 },
          { label: "1B Coins", price: 79999, compare: 199000 },
          { label: "5B Coins", price: 349999 },
          { label: "10B Coins", price: 649999 },
        ],
      },
      {
        slug: "8-ball-pool-cash",
        name: "8 Ball Pool Cash",
        shortDesc: "Cash bundles from 50 to 5,000+ for cues, boxes and Pool Pass.",
        description:
          "Cash unlocks premium cues, Victory Boxes and the Pool Pass. From micro-packs to bulk bundles, all delivered by our team to your Unique ID.",
        type: "CURRENCY",
        deliveryHours: 3,
        image: "cash",
        featured: true,
        variants: [
          { label: "50 Cash", price: 299 },
          { label: "250 Cash", price: 1199, compare: 1495 },
          { label: "500 Cash", price: 2199, compare: 2990 },
          { label: "1,000 Cash", price: 3999, compare: 5980 },
          { label: "2,500 Cash", price: 8999, compare: 14950 },
          { label: "5,000 Cash", price: 16999, compare: 29900 },
        ],
      },
      {
        slug: "golden-shot-bundle",
        name: "Golden Shot Bundles",
        shortDesc: "Bulk Golden Shot plays for big prize chances.",
        description: "Stock up on Golden Shot attempts and go for the big prizes. Delivered in bulk to your account.",
        type: "CURRENCY",
        deliveryHours: 4,
        image: "golden",
        variants: [
          { label: "25 Golden Shots", price: 499 },
          { label: "100 Golden Shots", price: 1699, compare: 1996 },
          { label: "500 Golden Shots", price: 7499, compare: 9980 },
        ],
      },
      {
        slug: "scratch-card-refill",
        name: "Scratch Card Refills",
        shortDesc: "Scratch & win refill packs.",
        description: "Refill your scratch cards and chase coins, cash and cue pieces.",
        type: "CURRENCY",
        deliveryHours: 4,
        image: "scratch",
        variants: [
          { label: "20 Scratchers", price: 399 },
          { label: "100 Scratchers", price: 1599, compare: 1995 },
        ],
      },
    ],
  },
  {
    slug: "cues-unlocks",
    name: "Cue Sticks & Unlocks",
    tagline: "Legendary and maxed cues",
    description:
      "Unlock legendary cues such as Archangel, Mandora, Valkyrie and Firestorm, or upgrade the cues you already own to max stats.",
    icon: "Wand",
    products: [
      {
        slug: "archangel-cue",
        name: "Archangel Cue (Legendary)",
        shortDesc: "The iconic legendary cue, fully unlocked.",
        description:
          "One of the most sought-after legendary cues in 8 Ball Pool with top-tier Force, Aim, Spin and Time stats. Delivered via secure account service.",
        type: "ITEM",
        requiredInput: "CREDENTIALS",
        deliveryHours: 24,
        image: "cue",
        badge: "Legendary",
        featured: true,
        variants: [
          { label: "Level 1 Unlock", price: 3999 },
          { label: "Maxed (Level 10)", price: 8999, compare: 11999 },
        ],
      },
      {
        slug: "mandora-cue",
        name: "Mandora Cue (Legendary)",
        shortDesc: "Mandora legendary cue with unique recharge perk.",
        description: "Unlock the Mandora legendary cue. Choose a base unlock or fully maxed version.",
        type: "ITEM",
        requiredInput: "CREDENTIALS",
        deliveryHours: 24,
        image: "cue",
        badge: "Legendary",
        variants: [
          { label: "Level 1 Unlock", price: 3499 },
          { label: "Maxed (Level 10)", price: 7999 },
        ],
      },
      {
        slug: "valkyrie-cue",
        name: "Valkyrie Cue (Legendary)",
        shortDesc: "Valkyrie legendary cue unlock.",
        description: "Fly through the tables with the Valkyrie legendary cue.",
        type: "ITEM",
        requiredInput: "CREDENTIALS",
        deliveryHours: 24,
        image: "cue",
        variants: [
          { label: "Level 1 Unlock", price: 3299 },
          { label: "Maxed (Level 10)", price: 7499 },
        ],
      },
      {
        slug: "firestorm-cue",
        name: "Firestorm Cue (Legendary)",
        shortDesc: "Firestorm legendary cue unlock.",
        description: "Bring the heat with the Firestorm legendary cue.",
        type: "ITEM",
        requiredInput: "CREDENTIALS",
        deliveryHours: 24,
        image: "cue",
        variants: [
          { label: "Level 1 Unlock", price: 2999 },
          { label: "Maxed (Level 10)", price: 6999 },
        ],
      },
      {
        slug: "legendary-cue-upgrade",
        name: "Legendary Cue Upgrade Service",
        shortDesc: "We grind your existing cue to max stats.",
        description:
          "Already own a legendary cue? Our team grinds pieces and upgrades it level by level until it is fully maxed.",
        type: "SERVICE",
        requiredInput: "CREDENTIALS",
        deliveryHours: 72,
        image: "upgrade",
        variants: [
          { label: "+1 Level", price: 1499 },
          { label: "+3 Levels", price: 3999 },
          { label: "Full Max", price: 9999 },
        ],
      },
    ],
  },
  {
    slug: "accounts",
    name: "Account Marketplace",
    tagline: "Maxed and starter accounts",
    description:
      "Ready-made 8 Ball Pool profiles: Level 150 maxed accounts with legendary cues and rare rings, or starter accounts loaded with coins and cash.",
    icon: "UserRound",
    products: [
      {
        slug: "maxed-account-level-150",
        name: "Maxed Account: Level 150 Elite",
        shortDesc: "Level 150, 12B coins, 9 legendary cues, rare rings.",
        description:
          "A fully maxed profile with a high win rate, rare rings and a stacked legendary cue collection. Full ownership transfer with email change support.",
        type: "ACCOUNT",
        requiredInput: "NONE",
        deliveryHours: 6,
        image: "account",
        badge: "1 of 1",
        featured: true,
        variants: [{ label: "Full Account", price: 49999, stock: 1 }],
        account: {
          level: 150,
          winRate: 71.4,
          coins: "12.4B",
          cash: 8200,
          cues: ["Archangel", "Mandora", "Valkyrie", "Firestorm", "Galaxy", "Atlantis", "Kraken", "Phoenix", "Thor"],
          rings: ["Berlin", "Venice", "Shanghai", "Las Vegas", "Jakarta"],
        },
      },
      {
        slug: "pro-account-level-100",
        name: "Pro Account: Level 100",
        shortDesc: "Level 100, 3B coins, 5 legendary cues.",
        description: "A strong mid-to-late game account with plenty of coins and a solid cue collection.",
        type: "ACCOUNT",
        requiredInput: "NONE",
        deliveryHours: 6,
        image: "account",
        variants: [{ label: "Full Account", price: 19999, stock: 1 }],
        account: {
          level: 100,
          winRate: 64.2,
          coins: "3.1B",
          cash: 2400,
          cues: ["Archangel", "Firestorm", "Galaxy", "Kraken", "Phoenix"],
          rings: ["Berlin", "Venice", "Shanghai"],
        },
      },
      {
        slug: "starter-cash-account",
        name: "Starter Account: 1B Coins + 1,000 Cash",
        shortDesc: "Fresh account loaded with coins & cash.",
        description: "A fresh profile pre-loaded with billions of coins and cash. A great way to start strong.",
        type: "ACCOUNT",
        requiredInput: "NONE",
        deliveryHours: 2,
        image: "account",
        variants: [
          { label: "1B Coins + 1,000 Cash", price: 6999, stock: 12 },
          { label: "5B Coins + 3,000 Cash", price: 21999, stock: 4 },
        ],
      },
    ],
  },
  {
    slug: "boosting",
    name: "Rank & Ring Boosting",
    tagline: "Pro players climb for you",
    description:
      "Professional boosters raise your league tier, complete ring collections and improve your win rate.",
    icon: "TrendingUp",
    products: [
      {
        slug: "league-rank-boost",
        name: "League Rank Boost",
        shortDesc: "Bronze → Grandmaster by verified pro boosters.",
        description:
          "Choose your target league and a vetted pro booster plays for you. Includes live progress updates on your order tracker.",
        type: "SERVICE",
        requiredInput: "CREDENTIALS",
        deliveryHours: 72,
        image: "boost",
        badge: "Popular",
        featured: true,
        variants: [
          { label: "Bronze → Silver", price: 1499 },
          { label: "Silver → Gold", price: 2499 },
          { label: "Gold → Platinum", price: 3999 },
          { label: "Platinum → Diamond", price: 5999 },
          { label: "Diamond → Grandmaster", price: 9999 },
        ],
      },
      {
        slug: "ring-collection-service",
        name: "Ring Collection Service",
        shortDesc: "Country, tournament & limited event rings.",
        description: "Complete specific city rings, tournament rings, or limited-time event rings.",
        type: "SERVICE",
        requiredInput: "CREDENTIALS",
        deliveryHours: 48,
        image: "ring",
        variants: [
          { label: "1 City Ring", price: 1999 },
          { label: "Tournament Ring", price: 2999 },
          { label: "Limited Event Ring", price: 4499 },
        ],
      },
      {
        slug: "win-rate-boost",
        name: "Win Rate Boost",
        shortDesc: "Raise your win rate with pro-played matches.",
        description: "A pro player plays matches on your account to raise your overall win percentage.",
        type: "SERVICE",
        requiredInput: "CREDENTIALS",
        deliveryHours: 96,
        image: "boost",
        variants: [
          { label: "+5% Win Rate", price: 2999 },
          { label: "+10% Win Rate", price: 5499 },
        ],
      },
    ],
  },
  {
    slug: "vip-access",
    name: "VIP Tools & Access Keys",
    tagline: "VIP memberships & license keys",
    description:
      "VIP memberships give you priority delivery, members-only deals and a private support channel. License keys are delivered instantly.",
    icon: "KeyRound",
    products: [
      {
        slug: "vip-membership",
        name: "GlobalPool VIP Membership",
        shortDesc: "Priority delivery, VIP discounts & private support.",
        description:
          "VIP members get priority in the fulfillment queue, an extra 5% off every order, double loyalty points and access to the private VIP support group. Your activation key is delivered instantly.",
        type: "LICENSE_KEY",
        deliveryMode: "INSTANT",
        requiredInput: "NONE",
        deliveryHours: 0,
        image: "key",
        badge: "Instant",
        featured: true,
        variants: [
          { label: "1 Month", price: 999 },
          { label: "3 Months", price: 2499, compare: 2997 },
          { label: "12 Months", price: 7999, compare: 11988 },
        ],
      },
    ],
  },
];

const blog = [
  {
    slug: "how-to-get-legendary-cues-in-8-ball-pool",
    title: "How to Get Legendary Cues in 8 Ball Pool (2026 Guide)",
    excerpt: "Every legit way to unlock legendary cues, from Legendary Boxes and Pool Pass to events.",
    category: "Guides",
    readMinutes: 7,
    body: `Legendary cues are the most powerful cues in 8 Ball Pool. Each has max-tier stats plus a special recharge perk. Here is every way to get one.

## 1. Legendary Boxes
Legendary Boxes contain pieces for one random legendary cue collection. Collect all the pieces of a cue to unlock it, then keep collecting to level it up.

## 2. Pool Pass rewards
The premium Pool Pass track often includes legendary boxes and cue pieces. Finish the season to get the most value.

## 3. Limited-time events
Watch for events with themed cues. Completing event milestones can award a full cue.

## 4. Spin & Win and scratchers
These are random, but a steady daily habit adds up over time.

## Pro tip
Focus on **one** collection at a time. Spreading pieces across many cues slows down your first maxed legendary.

> Want to skip the grind? See our [Cue Sticks & Unlocks](/store/cues-unlocks) section.`,
  },
  {
    slug: "fastest-way-to-earn-billions-of-coins",
    title: "Fastest Way to Earn Billions of Coins in 8 Ball Pool",
    excerpt: "Table selection, tournaments and bankroll management to grow your coins quickly.",
    category: "Coins",
    readMinutes: 6,
    body: `Growing from millions to billions of coins comes down to **table selection** and **bankroll discipline**.

## Choose the right table
Only play tables where the entry fee is under 5% of your balance. A losing streak won't wipe you out.

## Tournaments beat 1v1
Tournaments pay out several times the entry fee. If your win rate is above 55%, they're the fastest way to grow.

## Daily free coins
Claim the daily spin, watch videos and use the free coin rewards every day. Over a month that adds up to millions.

## Level up your cue
A higher cue level gives you more aim guideline and time. That directly raises your win rate at high-stakes tables.

> Need a jump start? Browse [coin packs](/store/coins-cash).`,
  },
  {
    slug: "8-ball-pool-league-guide-bronze-to-grandmaster",
    title: "8 Ball Pool Leagues Explained: Bronze to Grandmaster",
    excerpt: "How the league system works and tips for climbing each tier.",
    category: "Ranks",
    readMinutes: 5,
    body: `The league system groups you with players of similar skill. Each week the top players move up a tier.

## Tiers
Bronze → Silver → Gold → Platinum → Diamond → Grandmaster.

## How to climb
- Play consistently during the week
- Avoid tilting after losses
- Use your strongest cue

> Short on time? Our [League Rank Boost](/product/league-rank-boost) uses vetted pro players.`,
  },
  {
    slug: "how-to-find-your-miniclip-unique-id",
    title: "How to Find Your 8 Ball Pool Unique ID",
    excerpt: "Your Unique ID is needed for every top-up. Here is where to find it on mobile and web.",
    category: "Help",
    readMinutes: 2,
    body: `Your **Unique ID** is a 10-digit number tied to your profile.

## On mobile
1. Open 8 Ball Pool
2. Tap your profile avatar (top-left)
3. Your Unique ID is shown under your name, e.g. \`123-456-789-0\`

## On web
Open your profile and look under your display name.

Copy it carefully. You'll paste it at checkout.`,
  },
  {
    slug: "how-to-keep-your-8-ball-pool-account-secure",
    title: "How to Keep Your 8 Ball Pool Account Secure",
    excerpt: "Link your account, use strong passwords and avoid phishing.",
    category: "Safety",
    readMinutes: 4,
    body: `Your account is valuable, so protect it.

## Link a login method
Link your account to a Miniclip, Google or Facebook login so you can always recover it.

## Use a unique password
Never reuse passwords across games or sites.

## Change your password after any service
If you've shared your login for a boosting service, **change your password as soon as the order is complete**. We delete all stored credentials automatically within 72 hours.

## Beware of "free coins" generators
They are scams designed to steal your login.`,
  },
];

const faqs = [
  ["How long does delivery take?", "Most coin and cash orders are delivered within 1 to 4 hours. Boosting and cue services show an estimated delivery time on each product page. You can follow your order live on the Track Order page.", "Orders"],
  ["What do I need to provide?", "For coins and cash top-ups, just your Miniclip Unique ID. Cue unlocks and boosting services need login access, which we encrypt and delete automatically after completion.", "Orders"],
  ["How do I track my order?", "Use the Track Order page with your Order ID (e.g. GPS-AB12CD) and the email or Unique ID used at checkout.", "Orders"],
  ["Is my login information safe?", "Credentials are encrypted with AES-256, can only be seen by the booster assigned to your order, and are deleted automatically 72 hours after completion. We still recommend changing your password afterwards.", "Security"],
  ["What payment methods do you accept?", "We are adding card and crypto payment options. Checkout currently creates your order and our team confirms payment with you.", "Payments"],
  ["Do you offer refunds?", "If we can't deliver your order, you get a full refund. See our Refund Policy for details on partial deliveries and replacements.", "Payments"],
  ["How does the loyalty program work?", "You earn 10 points for every $1 spent, plus tier multipliers. 100 points = $1 off a future order.", "Rewards"],
  ["How do referrals work?", "Share your referral link. When someone you refer places an order, you earn commission as loyalty points.", "Rewards"],
  ["Can my account get banned?", "Buying virtual items from third parties may break the game publisher's terms of service. Please read our Terms before ordering.", "Security"],
];

const reviewers = [
  ["Ahmed K.", "AE"], ["Sophie L.", "GB"], ["Lucas M.", "DE"], ["Priya S.", "IN"], ["Omar F.", "SA"],
  ["Jake R.", "US"], ["Elif Y.", "TR"], ["Marco B.", "IT"], ["Hassan A.", "PK"], ["Chloe D.", "FR"],
];
const reviewBodies = [
  "Coins arrived in under an hour. Smooth process and great support.",
  "Booster got me to Diamond in 2 days, with updates the whole way. Legit.",
  "Third order now, always fast. The tracker is really handy.",
  "Support answered at 3am. Delivered exactly what I paid for.",
  "Great prices on bulk coins compared to other sites.",
  "Account was exactly as described. Email change went smoothly.",
];

async function main() {
  console.log("Seeding…");
  // Clean (order matters for FKs)
  await db.auditLog.deleteMany();
  await db.ledgerEntry.deleteMany();
  await db.orderEvent.deleteMany();
  await db.orderCredential.deleteMany();
  await db.payment.deleteMany();
  await db.licenseKey.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.accountListing.deleteMany();
  await db.productVariant.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.savedGameId.deleteMany();
  await db.supportTicket.deleteMany();
  await db.user.deleteMany();
  await db.banner.deleteMany();
  await db.flashSale.deleteMany();
  await db.coupon.deleteMany();
  await db.blogPost.deleteMany();
  await db.faqItem.deleteMany();

  const pw = await bcrypt.hash("Password123!", 10);
  const admin = await db.user.create({ data: { email: "admin@globalpool.test", name: "Store Admin", passwordHash: pw, role: "ADMIN", referralCode: code(8) } });
  const booster = await db.user.create({ data: { email: "booster@globalpool.test", name: "Pro Booster", passwordHash: pw, role: "BOOSTER", referralCode: code(8) } });
  await db.user.create({ data: { email: "support@globalpool.test", name: "Support Agent", passwordHash: pw, role: "SUPPORT", referralCode: code(8) } });
  const customer = await db.user.create({
    data: { email: "player@globalpool.test", name: "Ahmed Khan", passwordHash: pw, referralCode: "AHMED2026", points: 1240, lifetimeSpend: 182_00 },
  });

  const variantIds: { id: string; label: string; price: number; productName: string }[] = [];
  const productIds: string[] = [];
  for (const [ci, cat] of catalog.entries()) {
    const c = await db.category.create({
      data: { slug: cat.slug, name: cat.name, tagline: cat.tagline, description: cat.description, icon: cat.icon, sortOrder: ci },
    });
    for (const p of cat.products) {
      const prod = await db.product.create({
        data: {
          slug: p.slug,
          name: p.name,
          shortDesc: p.shortDesc,
          description: p.description,
          categoryId: c.id,
          type: p.type,
          deliveryMode: p.deliveryMode ?? "MANUAL",
          requiredInput: p.requiredInput ?? "UNIQUE_ID",
          deliveryHours: p.deliveryHours,
          image: p.image,
          badge: p.badge,
          featured: p.featured ?? false,
          metaTitle: `Buy ${p.name} | Fast & Secure`,
          metaDesc: p.shortDesc,
          variants: {
            create: p.variants.map((v, i) => ({ label: v.label, priceCents: v.price, compareCents: v.compare, stock: v.stock ?? -1, sortOrder: i })),
          },
          account: p.account ? { create: p.account } : undefined,
        },
        include: { variants: true },
      });
      productIds.push(prod.id);
      for (const v of prod.variants) variantIds.push({ id: v.id, label: v.label, price: v.priceCents, productName: p.name });
      if (p.type === "LICENSE_KEY") {
        for (const v of prod.variants) {
          await db.licenseKey.createMany({
            data: Array.from({ length: 10 }, () => ({ variantId: v.id, keyEnc: encrypt(`VIP-${code(4)}-${code(4)}-${code(4)}`) })),
          });
        }
      }
    }
  }

  // Reviews (seed sample testimonials, marked unverified)
  for (let i = 0; i < 24; i++) {
    const [author, country] = reviewers[i % reviewers.length];
    await db.review.create({
      data: {
        productId: productIds[i % productIds.length],
        author,
        country,
        rating: i % 7 === 0 ? 4 : 5,
        body: reviewBodies[i % reviewBodies.length],
        verified: false,
        createdAt: new Date(Date.now() - i * 36e5 * 7),
      },
    });
  }

  // Demo orders for the customer account
  const statuses = ["COMPLETED", "COMPLETED", "PROCESSING", "PAID"] as const;
  for (let i = 0; i < 4; i++) {
    const v = variantIds[i * 3];
    const created = new Date(Date.now() - (i + 1) * 36e5 * 5);
    await db.order.create({
      data: {
        trackingId: `GPS-${code(6)}`,
        userId: customer.id,
        email: customer.email,
        country: "AE",
        gameUniqueId: "123-456-789-0",
        subtotalCents: v.price,
        totalCents: v.price,
        status: statuses[i],
        paymentMethod: "manual",
        assignedToId: statuses[i] === "PROCESSING" ? booster.id : null,
        createdAt: created,
        items: { create: { variantId: v.id, name: `${v.productName}: ${v.label}`, quantity: 1, unitCents: v.price } },
        events: {
          create: [
            { status: "PENDING_PAYMENT", message: "Order placed", createdAt: created },
            { status: "PAID", message: "Payment confirmed", createdAt: new Date(created.getTime() + 6e5) },
            ...(statuses[i] !== "PAID" ? [{ status: "PROCESSING" as const, message: "A team member is working on your order", createdAt: new Date(created.getTime() + 12e5) }] : []),
            ...(statuses[i] === "COMPLETED" ? [{ status: "COMPLETED" as const, message: "Delivered. Enjoy!", createdAt: new Date(created.getTime() + 36e5) }] : []),
          ],
        },
      },
    });
  }

  await db.banner.createMany({
    data: [
      { title: "Billions of Coins. Minutes Away.", subtitle: "Top up any 8 Ball Pool account worldwide. Fast delivery, 24/7 support.", ctaLabel: "Shop Coins", ctaHref: "/store/coins-cash", theme: "emerald", sortOrder: 0 },
      { title: "Climb to Grandmaster", subtitle: "Vetted pro boosters with live progress tracking.", ctaLabel: "Start Boosting", ctaHref: "/store/boosting", theme: "violet", sortOrder: 1 },
      { title: "Legendary Cues, Maxed", subtitle: "Archangel, Mandora, Valkyrie and more, unlocked for you.", ctaLabel: "View Cues", ctaHref: "/store/cues-unlocks", theme: "amber", sortOrder: 2 },
    ],
  });

  const now = Date.now();
  await db.flashSale.createMany({
    data: [
      { title: "Weekend Coin Rush", subtitle: "Extra savings on all coin packs", percentOff: 15, productSlug: "8-ball-pool-coins", startsAt: new Date(now - 36e5), endsAt: new Date(now + 36e5 * 48) },
      { title: "Boost Week", subtitle: "League boosts discounted", percentOff: 10, productSlug: "league-rank-boost", startsAt: new Date(now - 36e5), endsAt: new Date(now + 36e5 * 72) },
    ],
  });
  await db.coupon.createMany({ data: [{ code: "WELCOME10", percentOff: 10 }, { code: "VIP20", percentOff: 20, maxUses: 100 }] });

  await db.blogPost.createMany({ data: blog.map((b, i) => ({ ...b, publishedAt: new Date(now - i * 36e5 * 24 * 4) })) });
  await db.faqItem.createMany({ data: faqs.map(([question, answer, category], i) => ({ question, answer, category, sortOrder: i })) });

  await db.auditLog.create({ data: { actorId: admin.id, action: "seed", target: "database" } });
  console.log("Done. Logins (password: Password123!): admin@, booster@, support@, player@globalpool.test");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
