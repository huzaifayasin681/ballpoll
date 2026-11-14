import "server-only";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/crypto";
import type { PrismaClient } from "@/generated/prisma/client";

type AnyRecord = Record<string, any>;

const INITIAL_PW_HASH = bcrypt.hashSync("Password123!", 8);

function createSeedStore() {
  const now = Date.now();
  const categories: AnyRecord[] = [];
  const products: AnyRecord[] = [];
  const variants: AnyRecord[] = [];
  const accounts: AnyRecord[] = [];
  const licenseKeys: AnyRecord[] = [];
  const reviews: AnyRecord[] = [];
  const orders: AnyRecord[] = [];
  const orderItems: AnyRecord[] = [];
  const orderEvents: AnyRecord[] = [];
  const orderCredentials: AnyRecord[] = [];
  const payments: AnyRecord[] = [];
  const ledgerEntries: AnyRecord[] = [];
  const savedGameIds: AnyRecord[] = [];
  const supportTickets: AnyRecord[] = [];
  const auditLogs: AnyRecord[] = [];

  const users: AnyRecord[] = [
    {
      id: "usr_admin",
      email: "admin@globalpool.test",
      name: "Store Admin",
      passwordHash: INITIAL_PW_HASH,
      googleId: null,
      role: "ADMIN",
      currency: "USD",
      referralCode: "ADMIN888",
      referredById: null,
      points: 0,
      lifetimeSpend: 0,
      createdAt: new Date(now - 86400000 * 30),
      updatedAt: new Date(now),
    },
    {
      id: "usr_booster",
      email: "booster@globalpool.test",
      name: "Pro Booster",
      passwordHash: INITIAL_PW_HASH,
      googleId: null,
      role: "BOOSTER",
      currency: "USD",
      referralCode: "BOOST888",
      referredById: null,
      points: 0,
      lifetimeSpend: 0,
      createdAt: new Date(now - 86400000 * 25),
      updatedAt: new Date(now),
    },
    {
      id: "usr_support",
      email: "support@globalpool.test",
      name: "Support Agent",
      passwordHash: INITIAL_PW_HASH,
      googleId: null,
      role: "SUPPORT",
      currency: "USD",
      referralCode: "SUPP8888",
      referredById: null,
      points: 0,
      lifetimeSpend: 0,
      createdAt: new Date(now - 86400000 * 20),
      updatedAt: new Date(now),
    },
    {
      id: "usr_customer",
      email: "player@globalpool.test",
      name: "Ahmed Khan",
      passwordHash: INITIAL_PW_HASH,
      googleId: null,
      role: "CUSTOMER",
      currency: "USD",
      referralCode: "AHMED2026",
      referredById: null,
      points: 1240,
      lifetimeSpend: 18200,
      createdAt: new Date(now - 86400000 * 14),
      updatedAt: new Date(now),
    },
  ];

  const catalogData = [
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
        {
          slug: "gamer-starter-combo",
          name: "Gamer Starter Combo",
          shortDesc: "500M Coins + 5 Legendary Cues + 100 Cash — Save 40% all-in-one bundle.",
          description:
            "Save 40% over separate purchases with our all-in-one starter bundle: 500M Pool Coins, 5 unlocked Legendary Cues, and 100 Cash delivered safely via encrypted vault.",
          type: "SERVICE",
          deliveryMode: "MANUAL",
          requiredInput: "CREDENTIALS",
          deliveryHours: 6,
          image: "combo_bundle",
          badge: "Save 40%",
          featured: false,
          variants: [{ label: "500M Coins + 5 Legendary Cues + 100 Cash", price: 2999, compare: 4999 }],
        },
        {
          slug: "king-master-bundle",
          name: "King Master Bundle",
          shortDesc: "2 Billion Coins + All 20 Cues + 1 Venice/Berlin Ring — complete pro loadout.",
          description:
            "Our flagship combo package saving 40%: 2 Billion Coins, all 20 Legendary Cues unlocked for max perks, plus 1 full hand-played Venice or Berlin Championship Ring.",
          type: "SERVICE",
          deliveryMode: "MANUAL",
          requiredInput: "CREDENTIALS",
          deliveryHours: 24,
          image: "combo_bundle",
          badge: "40% OFF · VIP",
          featured: false,
          variants: [{ label: "2 Billion Coins + All 20 Cues + 1 Venice/Berlin Ring", price: 14999, compare: 24999 }],
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
          slug: "starter-cue-box",
          name: "Starter Cue Box",
          shortDesc: "Random Legendary Cue Unlock (3 Boxes) — jumpstart your collection.",
          description:
            "Open 3 Legendary Surprise Boxes on your 8 Ball Pool account to unlock random Legendary Cue pieces and build Force, Aim, Spin & Time stats with Coin-Back perks. Delivered via AES-256 encrypted login vault.",
          type: "ITEM",
          requiredInput: "CREDENTIALS",
          deliveryHours: 6,
          image: "cue",
          badge: "3 Boxes",
          variants: [{ label: "Random Legendary Cue Unlock (3 Boxes)", price: 999, compare: 1499 }],
        },
        {
          slug: "ultimate-collector-pack",
          name: "Ultimate Collector Pack",
          shortDesc: "All 20 Legendary Cues Unlocked with Coin-Back Guarantee.",
          description:
            "Unlock the entire 20/20 Legendary Cue collection on your 8 Ball Pool account (Archon, Archangel, Valkyrie, Mandora, Firestorm & more). Max out Force, Aim, Spin & Time potential with up to 100% Coin-Back Guarantee and zero recharge fees.",
          type: "ITEM",
          requiredInput: "CREDENTIALS",
          deliveryHours: 24,
          image: "cue_maxed",
          badge: "20/20 Cues",
          variants: [{ label: "All 20 Legendary Cues Unlocked", price: 14999, compare: 19999 }],
        },
        {
          slug: "max-level-upgrade",
          name: "Max Level Upgrade",
          shortDesc: "Upgrade All Existing Cues to Level 5 Max — max Force, Aim, Spin & Time.",
          description:
            "Upgrade every existing Legendary Cue in your inventory to Level 5 Max so you hit maximum Force, Aim, Spin, and Time stats plus full Coin-Back Guarantee.",
          type: "SERVICE",
          requiredInput: "CREDENTIALS",
          deliveryHours: 48,
          image: "upgrade",
          badge: "Level 5 Max",
          variants: [{ label: "Upgrade All Existing Cues to Level 5 Max", price: 6999, compare: 8999 }],
        },
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
          slug: "high-tier-ring-grinding",
          name: "High-Tier Rings",
          shortDesc: "Berlin / Rome / Mumbai Ring Grinding — hand-played per-ring completion.",
          description:
            "Verified global pro players hand-grind high-stakes Berlin, Rome, or Mumbai championship rings on your account. Zero bots, AES-256 encrypted login vault, and real-time progress tracking.",
          type: "SERVICE",
          requiredInput: "CREDENTIALS",
          deliveryHours: 48,
          image: "ring",
          badge: "Per Ring",
          variants: [
            { label: "Berlin Ring (Per Ring)", price: 4999, compare: 5999 },
            { label: "Rome Ring (Per Ring)", price: 3499, compare: 4499 },
            { label: "Mumbai Ring (Per Ring)", price: 2499, compare: 2999 },
          ],
        },
        {
          slug: "venice-elite-ring-package",
          name: "Elite Package",
          shortDesc: "Venice Pro Table Ring + Leaderboard Topping — complete elite dominance.",
          description:
            "Book a dedicated top-tier pro booster for Venice Pro Table Ring grinding paired with weekly country/world leaderboard topping. Hand-played 100% safely with live status updates.",
          type: "SERVICE",
          requiredInput: "CREDENTIALS",
          deliveryHours: 48,
          image: "boost_pro",
          badge: "Venice Elite",
          variants: [{ label: "Venice Pro Table Ring + Leaderboard Topping", price: 11999, compare: 14999 }],
        },
        {
          slug: "account-level-progression",
          name: "Level Progression",
          shortDesc: "Account Level Boost (Level 1 to 150+) — safe hand-leveled XP progression.",
          description:
            "Hand-played account leveling from Level 1 up to 150+ by vetted global pro players. Gain massive XP, trophy road milestones, and match rewards safely.",
          type: "SERVICE",
          requiredInput: "CREDENTIALS",
          deliveryHours: 72,
          image: "boost_pro",
          badge: "Level 150+",
          variants: [
            { label: "Level 1 → 50 Boost", price: 2999, compare: 3999 },
            { label: "Level 50 → 100 Boost", price: 5999, compare: 7999 },
            { label: "Level 1 → 150+ Full Max", price: 12999, compare: 16999 },
          ],
        },
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
        {
          slug: "weekly-pass-key",
          name: "Weekly Pass",
          shortDesc: "7 Days Pro Aim Assist & Long Guideline Key — instant automated activation.",
          description:
            "Unlock extended aim guidelines, multi-rail angle overlays and anti-detection updates for 7 full days. Your activation license key is delivered automatically the moment payment clears.",
          type: "LICENSE_KEY",
          deliveryMode: "INSTANT",
          requiredInput: "NONE",
          deliveryHours: 0,
          image: "key",
          badge: "7-Day Key",
          featured: false,
          variants: [{ label: "7 Days Pro Aim Assist & Long Guideline Key", price: 1499, compare: 1999 }],
        },
        {
          slug: "monthly-vip-key",
          name: "Monthly VIP Key",
          shortDesc: "30 Days Full Features + Cushion Line Prediction with automated updates.",
          description:
            "Full 30-day VIP access including extended guidelines, precision multi-cushion bank shot line predictions, auto-play assist controls and continuous compatibility updates. Instant license delivery.",
          type: "LICENSE_KEY",
          deliveryMode: "INSTANT",
          requiredInput: "NONE",
          deliveryHours: 0,
          image: "assist_tools",
          badge: "30-Day VIP",
          featured: false,
          variants: [{ label: "30 Days Full Features + Cushion Line Prediction", price: 3499, compare: 4999 }],
        },
        {
          slug: "ultimate-season-pass",
          name: "Ultimate Season Pass",
          shortDesc: "Lifetime / Latest Anti-Ban Update + 24/7 Support with priority builds.",
          description:
            "Our highest tier assist package covering ongoing latest anti-ban protection updates, full cushion & trick-shot trajectory engine, instant key replacement protection and dedicated 24/7 VIP support.",
          type: "LICENSE_KEY",
          deliveryMode: "INSTANT",
          requiredInput: "NONE",
          deliveryHours: 0,
          image: "assist_tools",
          badge: "Lifetime Pass",
          featured: false,
          variants: [{ label: "Lifetime / Latest Anti-Ban Update + 24/7 Support", price: 8999, compare: 12999 }],
        },
      ],
    },
  ];

  let pIdx = 0;
  let vIdx = 0;
  catalogData.forEach((cat, ci) => {
    const catId = `cat_${ci + 1}`;
    categories.push({
      id: catId,
      slug: cat.slug,
      name: cat.name,
      tagline: cat.tagline,
      description: cat.description,
      icon: cat.icon,
      sortOrder: ci,
    });
    for (const p of cat.products as any[]) {
      pIdx++;
      const prodId = `prod_${pIdx}`;
      products.push({
        id: prodId,
        slug: p.slug,
        name: p.name,
        shortDesc: p.shortDesc,
        description: p.description,
        categoryId: catId,
        type: p.type,
        deliveryMode: p.deliveryMode ?? "MANUAL",
        requiredInput: p.requiredInput ?? "UNIQUE_ID",
        deliveryHours: p.deliveryHours,
        region: "Global",
        image: p.image,
        badge: p.badge ?? null,
        featured: p.featured ?? false,
        isActive: true,
        metaTitle: `Buy ${p.name} | Fast & Secure`,
        metaDesc: p.shortDesc,
        createdAt: new Date(now - pIdx * 3600000),
        updatedAt: new Date(now),
      });
      if (p.account) {
        accounts.push({
          id: `acc_${pIdx}`,
          productId: prodId,
          ...p.account,
          sold: false,
        });
      }
      p.variants.forEach((v: any, vi: number) => {
        vIdx++;
        const varId = `var_${vIdx}`;
        variants.push({
          id: varId,
          productId: prodId,
          label: v.label,
          priceCents: v.price,
          compareCents: v.compare ?? null,
          stock: v.stock ?? -1,
          isActive: true,
          sortOrder: vi,
        });
        if (p.type === "LICENSE_KEY") {
          for (let k = 0; k < 5; k++) {
            licenseKeys.push({
              id: `key_${varId}_${k}`,
              variantId: varId,
              keyEnc: encrypt(`VIP-DEMO-${varId.toUpperCase()}-${k + 1}`),
              orderItemId: null,
              createdAt: new Date(now),
            });
          }
        }
      });
    }
  });

  const reviewers = [
    ["Ahmed K.", "AE"],
    ["Sophie L.", "GB"],
    ["Lucas M.", "DE"],
    ["Priya S.", "IN"],
    ["Omar F.", "SA"],
    ["Jake R.", "US"],
    ["Elif Y.", "TR"],
    ["Marco B.", "IT"],
    ["Hassan A.", "PK"],
    ["Chloe D.", "FR"],
  ];
  const reviewBodies = [
    "Coins arrived in under an hour. Smooth process and great support.",
    "Booster got me to Diamond in 2 days, with updates the whole way. Legit.",
    "Third order now, always fast. The tracker is really handy.",
    "Support answered at 3am. Delivered exactly what I paid for.",
    "Great prices on bulk coins compared to other sites.",
    "Account was exactly as described. Email change went smoothly.",
  ];
  for (let i = 0; i < 24; i++) {
    const [author, country] = reviewers[i % reviewers.length];
    reviews.push({
      id: `rev_${i + 1}`,
      productId: products[i % products.length].id,
      userId: null,
      author,
      country,
      rating: i % 7 === 0 ? 4 : 5,
      body: reviewBodies[i % reviewBodies.length],
      verified: false,
      approved: true,
      createdAt: new Date(now - i * 36e5 * 7),
    });
  }

  const statuses = ["COMPLETED", "COMPLETED", "PROCESSING", "PAID"];
  for (let i = 0; i < 4; i++) {
    const v = variants[i * 3];
    const prod = products.find((p) => p.id === v.productId)!;
    const created = new Date(now - (i + 1) * 36e5 * 5);
    const ordId = `ord_demo_${i + 1}`;
    orders.push({
      id: ordId,
      trackingId: `GPS-DEMO0${i + 1}`,
      userId: "usr_customer",
      email: "player@globalpool.test",
      country: "AE",
      gameUniqueId: "123-456-789-0",
      currency: "USD",
      fxRate: 1,
      subtotalCents: v.priceCents,
      discountCents: 0,
      totalCents: v.priceCents,
      couponCode: null,
      pointsUsed: 0,
      status: statuses[i],
      paymentMethod: "manual",
      assignedToId: statuses[i] === "PROCESSING" ? "usr_booster" : null,
      staffNote: null,
      createdAt: created,
      updatedAt: created,
    });
    orderItems.push({
      id: `oi_demo_${i + 1}`,
      orderId: ordId,
      variantId: v.id,
      name: `${prod.name}: ${v.label}`,
      quantity: 1,
      unitCents: v.priceCents,
    });
    orderEvents.push(
      { id: `oe_${i}_1`, orderId: ordId, status: "PENDING_PAYMENT", message: "Order placed", createdAt: created },
      { id: `oe_${i}_2`, orderId: ordId, status: "PAID", message: "Payment confirmed", createdAt: new Date(created.getTime() + 6e5) },
    );
    if (statuses[i] !== "PAID") {
      orderEvents.push({
        id: `oe_${i}_3`,
        orderId: ordId,
        status: "PROCESSING",
        message: "A team member is working on your order",
        createdAt: new Date(created.getTime() + 12e5),
      });
    }
    if (statuses[i] === "COMPLETED") {
      orderEvents.push({
        id: `oe_${i}_4`,
        orderId: ordId,
        status: "COMPLETED",
        message: "Delivered. Enjoy!",
        createdAt: new Date(created.getTime() + 36e5),
      });
    }
  }

  const flashSales: AnyRecord[] = [
    {
      id: "sale_1",
      title: "Weekend Coin Rush",
      subtitle: "Extra savings on all coin packs",
      percentOff: 15,
      productSlug: "8-ball-pool-coins",
      startsAt: new Date(now - 36e5),
      endsAt: new Date(now + 36e5 * 48),
      isActive: true,
    },
    {
      id: "sale_2",
      title: "Boost Week",
      subtitle: "League boosts discounted",
      percentOff: 10,
      productSlug: "league-rank-boost",
      startsAt: new Date(now - 36e5),
      endsAt: new Date(now + 36e5 * 72),
      isActive: true,
    },
  ];

  const coupons: AnyRecord[] = [
    { id: "cpn_1", code: "WELCOME10", percentOff: 10, maxUses: null, uses: 0, expiresAt: null, isActive: true },
    { id: "cpn_2", code: "VIP20", percentOff: 20, maxUses: 100, uses: 0, expiresAt: null, isActive: true },
  ];

  const blogPosts: AnyRecord[] = [
    {
      id: "blog_1",
      slug: "how-to-get-legendary-cues-in-8-ball-pool",
      title: "How to Get Legendary Cues in 8 Ball Pool (2026 Guide)",
      excerpt: "Every legit way to unlock legendary cues, from Legendary Boxes and Pool Pass to events.",
      category: "Guides",
      readMinutes: 7,
      published: true,
      publishedAt: new Date(now - 86400000 * 2),
      updatedAt: new Date(now),
      body: `Legendary cues are the most powerful cues in 8 Ball Pool. Each has max-tier stats plus a special recharge perk. Here is every way to get one.\n\n## 1. Legendary Boxes\nLegendary Boxes contain pieces for one random legendary cue collection. Collect all the pieces of a cue to unlock it, then keep collecting to level it up.\n\n## 2. Pool Pass rewards\nThe premium Pool Pass track often includes legendary boxes and cue pieces. Finish the season to get the most value.\n\n## 3. Limited-time events\nWatch for events with themed cues. Completing event milestones can award a full cue.\n\n## 4. Spin & Win and scratchers\nThese are random, but a steady daily habit adds up over time.\n\n## Pro tip\nFocus on **one** collection at a time. Spreading pieces across many cues slows down your first maxed legendary.\n\n> Want to skip the grind? See our [Cue Sticks & Unlocks](/store/cues-unlocks) section.`,
    },
    {
      id: "blog_2",
      slug: "fastest-way-to-earn-billions-of-coins",
      title: "Fastest Way to Earn Billions of Coins in 8 Ball Pool",
      excerpt: "Table selection, tournaments and bankroll management to grow your coins quickly.",
      category: "Coins",
      readMinutes: 6,
      published: true,
      publishedAt: new Date(now - 86400000 * 6),
      updatedAt: new Date(now),
      body: `Growing from millions to billions of coins comes down to **table selection** and **bankroll discipline**.\n\n## Choose the right table\nOnly play tables where the entry fee is under 5% of your balance. A losing streak won't wipe you out.\n\n## Tournaments beat 1v1\nTournaments pay out several times the entry fee. If your win rate is above 55%, they're the fastest way to grow.\n\n## Daily free coins\nClaim the daily spin, watch videos and use the free coin rewards every day. Over a month that adds up to millions.\n\n## Level up your cue\nA higher cue level gives you more aim guideline and time. That directly raises your win rate at high-stakes tables.\n\n> Need a jump start? Browse [coin packs](/store/coins-cash).`,
    },
    {
      id: "blog_3",
      slug: "8-ball-pool-league-guide-bronze-to-grandmaster",
      title: "8 Ball Pool Leagues Explained: Bronze to Grandmaster",
      excerpt: "How the league system works and tips for climbing each tier.",
      category: "Ranks",
      readMinutes: 5,
      published: true,
      publishedAt: new Date(now - 86400000 * 10),
      updatedAt: new Date(now),
      body: `The league system groups you with players of similar skill. Each week the top players move up a tier.\n\n## Tiers\nBronze → Silver → Gold → Platinum → Diamond → Grandmaster.\n\n## How to climb\n- Play consistently during the week\n- Avoid tilting after losses\n- Use your strongest cue\n\n> Short on time? Our [League Rank Boost](/product/league-rank-boost) uses vetted pro players.`,
    },
    {
      id: "blog_4",
      slug: "how-to-find-your-miniclip-unique-id",
      title: "How to Find Your 8 Ball Pool Unique ID",
      excerpt: "Your Unique ID is needed for every top-up. Here is where to find it on mobile and web.",
      category: "Help",
      readMinutes: 2,
      published: true,
      publishedAt: new Date(now - 86400000 * 14),
      updatedAt: new Date(now),
      body: `Your **Unique ID** is a 10-digit number tied to your profile.\n\n## On mobile\n1. Open 8 Ball Pool\n2. Tap your profile avatar (top-left)\n3. Your Unique ID is shown under your name, e.g. \`123-456-789-0\`\n\n## On web\nOpen your profile and look under your display name.\n\nCopy it carefully. You'll paste it at checkout.`,
    },
    {
      id: "blog_5",
      slug: "how-to-keep-your-8-ball-pool-account-secure",
      title: "How to Keep Your 8 Ball Pool Account Secure",
      excerpt: "Link your account, use strong passwords and avoid phishing.",
      category: "Safety",
      readMinutes: 4,
      published: true,
      publishedAt: new Date(now - 86400000 * 18),
      updatedAt: new Date(now),
      body: `Your account is valuable, so protect it.\n\n## Link a login method\nLink your account to a Miniclip, Google or Facebook login so you can always recover it.\n\n## Use a unique password\nNever reuse passwords across games or sites.\n\n## Change your password after any service\nIf you've shared your login for a boosting service, **change your password as soon as the order is complete**. We delete all stored credentials automatically within 72 hours.\n\n## Beware of "free coins" generators\nThey are scams designed to steal your login.`,
    },
  ];

  const faqData = [
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
  const faqItems: AnyRecord[] = faqData.map(([question, answer, category], i) => ({
    id: `faq_${i + 1}`,
    question,
    answer,
    category,
    sortOrder: i,
  }));

  return {
    categories,
    products,
    variants,
    accounts,
    licenseKeys,
    reviews,
    orders,
    orderItems,
    orderEvents,
    orderCredentials,
    payments,
    ledgerEntries,
    savedGameIds,
    supportTickets,
    auditLogs,
    users,
    flashSales,
    coupons,
    blogPosts,
    faqItems,
  };
}

const g = globalThis as unknown as { __fallbackStore?: ReturnType<typeof createSeedStore> };
function store() {
  if (!g.__fallbackStore) g.__fallbackStore = createSeedStore();
  return g.__fallbackStore;
}

let seq = 1000;
const uid = (prefix: string) => `${prefix}_${Date.now()}_${++seq}`;

function attachProductRelations(p: AnyRecord, include?: AnyRecord) {
  const s = store();
  const out = { ...p };
  if (include?.category) {
    out.category = s.categories.find((c) => c.id === p.categoryId) ?? null;
  }
  if (include?.variants) {
    let vs = s.variants.filter((v) => v.productId === p.id);
    if (typeof include.variants === "object" && include.variants.where?.isActive !== undefined) {
      vs = vs.filter((v) => v.isActive === include.variants.where.isActive);
    }
    vs.sort((a, b) => a.sortOrder - b.sortOrder);
    out.variants = vs;
  }
  if (include?.account) {
    out.account = s.accounts.find((a) => a.productId === p.id) ?? null;
  }
  if (include?.reviews) {
    let rs = s.reviews.filter((r) => r.productId === p.id);
    if (typeof include.reviews === "object" && include.reviews.where?.approved !== undefined) {
      rs = rs.filter((r) => r.approved === include.reviews.where.approved);
    }
    rs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (typeof include.reviews === "object" && include.reviews.take) {
      rs = rs.slice(0, include.reviews.take);
    }
    out.reviews = rs;
  }
  return out;
}

function attachOrderRelations(o: AnyRecord, includeOrSelect?: AnyRecord) {
  const s = store();
  const out = { ...o };
  const inc = includeOrSelect;
  if (!inc) return out;
  if (inc.user) {
    out.user = s.users.find((u) => u.id === o.userId) ?? null;
  }
  if (inc.assignedTo) {
    out.assignedTo = s.users.find((u) => u.id === o.assignedToId) ?? null;
  }
  if (inc.credential) {
    out.credential = s.orderCredentials.find((c) => c.orderId === o.id) ?? null;
  }
  if (inc.events) {
    const evs = s.orderEvents.filter((e) => e.orderId === o.id);
    evs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    out.events = evs;
  }
  if (inc.items) {
    let its = s.orderItems.filter((i) => i.orderId === o.id).map((i) => {
      const itemOut = { ...i };
      const itemInc = typeof inc.items === "object" ? inc.items.include : undefined;
      if (itemInc?.licenseKey) {
        itemOut.licenseKey = s.licenseKeys.find((k) => k.orderItemId === i.id) ?? null;
      }
      if (itemInc?.variant) {
        const v = s.variants.find((x) => x.id === i.variantId);
        if (v) {
          itemOut.variant = {
            ...v,
            product: s.products.find((p) => p.id === v.productId) ?? null,
          };
        }
      }
      return itemOut;
    });
    if (typeof inc.items === "object" && inc.items.take) {
      its = its.slice(0, inc.items.take);
    }
    out.items = its;
  }
  return out;
}

function applyNumOp(current: number, val: any): number {
  if (typeof val === "number") return val;
  if (val && typeof val === "object") {
    if (typeof val.increment === "number") return current + val.increment;
    if (typeof val.decrement === "number") return current - val.decrement;
  }
  return current;
}

export const fallbackDb = {
  category: {
    findMany: async (args?: AnyRecord) => {
      const s = store();
      const list = [...s.categories].sort((a, b) => a.sortOrder - b.sortOrder);
      return list.map((c) => {
        if (args?.include?._count) {
          const count = s.products.filter((p) => p.categoryId === c.id && p.isActive).length;
          return { ...c, _count: { products: count } };
        }
        return { ...c };
      });
    },
  },
  product: {
    findMany: async (args?: AnyRecord) => {
      const s = store();
      let list = [...s.products];
      const w = args?.where;
      if (w) {
        if (w.isActive !== undefined) list = list.filter((p) => p.isActive === w.isActive);
        if (w.featured !== undefined) list = list.filter((p) => p.featured === w.featured);
        if (w.slug?.in) list = list.filter((p) => w.slug.in.includes(p.slug));
        if (w.type) list = list.filter((p) => p.type === w.type);
        if (w.region) list = list.filter((p) => p.region === w.region);
        if (w.category?.slug) {
          const cat = s.categories.find((c) => c.slug === w.category.slug);
          list = cat ? list.filter((p) => p.categoryId === cat.id) : [];
        }
        if (w.deliveryHours) {
          if (w.deliveryHours.lte !== undefined) list = list.filter((p) => p.deliveryHours <= w.deliveryHours.lte);
          if (w.deliveryHours.gt !== undefined) list = list.filter((p) => p.deliveryHours > w.deliveryHours.gt);
        }
        if (w.OR) {
          const q = (w.OR[0]?.name?.contains ?? "").toLowerCase();
          if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q));
        }
      }
      return list.map((p) => attachProductRelations(p, args?.include));
    },
    findUnique: async (args: AnyRecord) => {
      const s = store();
      const p = s.products.find((x) => (args.where.id ? x.id === args.where.id : x.slug === args.where.slug));
      return p ? attachProductRelations(p, args.include) : null;
    },
    update: async (args: AnyRecord) => {
      const s = store();
      const p = s.products.find((x) => x.id === args.where.id);
      if (!p) throw new Error("Product not found");
      Object.assign(p, args.data, { updatedAt: new Date() });
      return { ...p };
    },
  },
  productVariant: {
    findMany: async (args?: AnyRecord) => {
      const s = store();
      let list = [...s.variants];
      const w = args?.where;
      if (w) {
        if (w.id?.in) list = list.filter((v) => w.id.in.includes(v.id));
        if (w.isActive !== undefined) list = list.filter((v) => v.isActive === w.isActive);
      }
      return list.map((v) => {
        const prod = s.products.find((p) => p.id === v.productId)!;
        return args?.include?.product ? { ...v, product: prod } : { ...v };
      });
    },
    update: async (args: AnyRecord) => {
      const s = store();
      const v = s.variants.find((x) => x.id === args.where.id);
      if (!v) throw new Error("Variant not found");
      if (args.data.priceCents !== undefined) v.priceCents = applyNumOp(v.priceCents, args.data.priceCents);
      if (args.data.stock !== undefined) v.stock = applyNumOp(v.stock, args.data.stock);
      if (args.data.isActive !== undefined) v.isActive = args.data.isActive;
      return { ...v };
    },
  },
  accountListing: {
    updateMany: async (args: AnyRecord) => {
      const s = store();
      let count = 0;
      for (const a of s.accounts) {
        if (!args.where?.productId || a.productId === args.where.productId) {
          Object.assign(a, args.data);
          count++;
        }
      }
      return { count };
    },
  },
  licenseKey: {
    findFirst: async (args: AnyRecord) => {
      const s = store();
      return (
        s.licenseKeys.find(
          (k) => k.variantId === args.where?.variantId && (args.where.orderItemId === null ? k.orderItemId === null : true),
        ) ?? null
      );
    },
    update: async (args: AnyRecord) => {
      const s = store();
      const k = s.licenseKeys.find((x) => x.id === args.where.id);
      if (k) Object.assign(k, args.data);
      return k;
    },
    createMany: async (args: AnyRecord) => {
      const s = store();
      for (const d of args.data) {
        s.licenseKeys.push({ id: uid("key"), orderItemId: null, createdAt: new Date(), ...d });
      }
      return { count: args.data.length };
    },
  },
  flashSale: {
    findMany: async () => {
      const s = store();
      const now = new Date();
      return s.flashSales.filter((f) => f.isActive && f.startsAt <= now && f.endsAt > now);
    },
  },
  coupon: {
    findMany: async () => store().coupons.filter((c) => c.isActive),
    findUnique: async (args: AnyRecord) => store().coupons.find((c) => c.code === args.where.code) ?? null,
    update: async (args: AnyRecord) => {
      const c = store().coupons.find((x) => x.code === args.where.code);
      if (c && args.data.uses) c.uses = applyNumOp(c.uses, args.data.uses);
      return c;
    },
  },
  review: {
    findMany: async (args?: AnyRecord) => {
      const s = store();
      let list = s.reviews.filter((r) => (args?.where?.approved !== undefined ? r.approved === args.where.approved : true));
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      if (args?.take) list = list.slice(0, args.take);
      return list.map((r) => ({
        ...r,
        product: s.products.find((p) => p.id === r.productId) ?? { name: "8 Ball Pool Coins", slug: "8-ball-pool-coins" },
      }));
    },
    aggregate: async () => {
      const s = store();
      const app = s.reviews.filter((r) => r.approved);
      const avg = app.length ? app.reduce((sum, r) => sum + r.rating, 0) / app.length : 5;
      return { _avg: { rating: avg }, _count: app.length };
    },
    create: async (args: AnyRecord) => {
      const s = store();
      const rev = { id: uid("rev"), approved: true, createdAt: new Date(), ...args.data };
      s.reviews.unshift(rev);
      return rev;
    },
  },
  blogPost: {
    findMany: async () => [...store().blogPosts].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
    findUnique: async (args: AnyRecord) => store().blogPosts.find((b) => b.slug === args.where.slug) ?? null,
  },
  faqItem: {
    findMany: async () => [...store().faqItems].sort((a, b) => a.sortOrder - b.sortOrder),
  },
  order: {
    findMany: async (args?: AnyRecord) => {
      const s = store();
      let list = [...s.orders];
      const w = args?.where;
      if (w) {
        if (w.userId) list = list.filter((o) => o.userId === w.userId);
        if (w.assignedToId) list = list.filter((o) => o.assignedToId === w.assignedToId);
        if (w.status) {
          if (typeof w.status === "string") list = list.filter((o) => o.status === w.status);
          else if (w.status.in) list = list.filter((o) => w.status.in.includes(o.status));
        }
      }
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      if (args?.take) list = list.slice(0, args.take);
      return list.map((o) => attachOrderRelations(o, args?.include ?? args?.select));
    },
    findUnique: async (args: AnyRecord) => {
      const s = store();
      const o = s.orders.find((x) => (args.where.id ? x.id === args.where.id : x.trackingId === args.where.trackingId));
      return o ? attachOrderRelations(o, args.include ?? args.select) : null;
    },
    count: async (args?: AnyRecord) => {
      const s = store();
      if (!args?.where) return s.orders.length;
      if (args.where.status) return s.orders.filter((o) => o.status === args.where.status).length;
      return s.orders.length;
    },
    create: async (args: AnyRecord) => {
      const s = store();
      const d = args.data;
      const ordId = uid("ord");
      const now = new Date();
      const ord: AnyRecord = {
        id: ordId,
        trackingId: d.trackingId,
        userId: d.userId ?? null,
        email: d.email,
        country: d.country ?? null,
        gameUniqueId: d.gameUniqueId ?? null,
        currency: d.currency ?? "USD",
        fxRate: d.fxRate ?? 1,
        subtotalCents: d.subtotalCents,
        discountCents: d.discountCents ?? 0,
        totalCents: d.totalCents,
        couponCode: d.couponCode ?? null,
        pointsUsed: d.pointsUsed ?? 0,
        status: d.status ?? "PENDING_PAYMENT",
        paymentMethod: d.paymentMethod ?? "manual",
        assignedToId: null,
        staffNote: null,
        createdAt: now,
        updatedAt: now,
      };
      s.orders.unshift(ord);
      if (d.items?.create) {
        const itemsArr = Array.isArray(d.items.create) ? d.items.create : [d.items.create];
        for (const it of itemsArr) {
          s.orderItems.push({ id: uid("oi"), orderId: ordId, ...it });
        }
      }
      if (d.events?.create) {
        const evArr = Array.isArray(d.events.create) ? d.events.create : [d.events.create];
        for (const ev of evArr) {
          s.orderEvents.push({ id: uid("oe"), orderId: ordId, createdAt: now, ...ev });
        }
      }
      if (d.credential?.create) {
        s.orderCredentials.push({ id: uid("cred"), orderId: ordId, createdAt: now, purgeAfter: null, ...d.credential.create });
      }
      return ord;
    },
    update: async (args: AnyRecord) => {
      const o = store().orders.find((x) => x.id === args.where.id);
      if (!o) throw new Error("Order not found");
      Object.assign(o, args.data, { updatedAt: new Date() });
      return { ...o };
    },
    updateMany: async (args: AnyRecord) => {
      let count = 0;
      for (const o of store().orders) {
        if (args.where?.email && o.email === args.where.email && o.userId === null) {
          Object.assign(o, args.data);
          count++;
        }
      }
      return { count };
    },
    groupBy: async () => {
      const counts: Record<string, number> = {};
      for (const o of store().orders) counts[o.status] = (counts[o.status] ?? 0) + 1;
      return Object.entries(counts).map(([status, _count]) => ({ status, _count }));
    },
    aggregate: async () => {
      const paid = store().orders.filter((o) => ["PAID", "PROCESSING", "COMPLETED"].includes(o.status));
      const sum = paid.reduce((acc, o) => acc + o.totalCents, 0);
      return { _sum: { totalCents: sum } };
    },
  },
  orderItem: {
    count: async (args: AnyRecord) => {
      const s = store();
      return s.orderItems.filter((i) => {
        if (args.where?.orderId && i.orderId !== args.where.orderId) return false;
        const hasKey = s.licenseKeys.some((k) => k.orderItemId === i.id);
        return !hasKey;
      }).length;
    },
  },
  orderEvent: {
    create: async (args: AnyRecord) => {
      const ev = { id: uid("oe"), createdAt: new Date(), ...args.data };
      store().orderEvents.push(ev);
      return ev;
    },
  },
  orderCredential: {
    updateMany: async (args: AnyRecord) => {
      let count = 0;
      for (const c of store().orderCredentials) {
        if (!args.where?.orderId || c.orderId === args.where.orderId) {
          Object.assign(c, args.data);
          count++;
        }
      }
      return { count };
    },
    deleteMany: async (args: AnyRecord) => {
      const s = store();
      const before = s.orderCredentials.length;
      s.orderCredentials = s.orderCredentials.filter((c) => {
        if (args.where?.orderId) return c.orderId !== args.where.orderId;
        if (args.where?.purgeAfter?.lte) return !(c.purgeAfter && c.purgeAfter <= args.where.purgeAfter.lte);
        return true;
      });
      return { count: before - s.orderCredentials.length };
    },
  },
  payment: {
    findUnique: async (args: AnyRecord) => store().payments.find((p) => p.externalId === args.where.externalId) ?? null,
    create: async (args: AnyRecord) => {
      const p = { id: uid("pay"), createdAt: new Date(), ...args.data };
      store().payments.push(p);
      return p;
    },
  },
  ledgerEntry: {
    findMany: async (args: AnyRecord) =>
      store()
        .ledgerEntries.filter((l) => l.userId === args.where?.userId)
        .slice(0, args.take ?? 20),
    create: async (args: AnyRecord) => {
      const l = { id: uid("led"), createdAt: new Date(), ...args.data };
      store().ledgerEntries.unshift(l);
      return l;
    },
  },
  user: {
    findUnique: async (args: AnyRecord) => {
      const s = store();
      return (
        s.users.find((u) => {
          if (args.where.id) return u.id === args.where.id;
          if (args.where.email) return u.email === args.where.email;
          if (args.where.referralCode) return u.referralCode === args.where.referralCode;
          return false;
        }) ?? null
      );
    },
    findFirst: async (args: AnyRecord) => {
      const s = store();
      if (args.where?.OR) {
        return s.users.find((u) => args.where.OR.some((cond: AnyRecord) => (cond.googleId && u.googleId === cond.googleId) || (cond.email && u.email === cond.email))) ?? null;
      }
      return null;
    },
    findMany: async (args?: AnyRecord) => {
      let list = [...store().users];
      if (args?.where?.role?.in) list = list.filter((u) => args.where.role.in.includes(u.role));
      return list;
    },
    create: async (args: AnyRecord) => {
      const now = new Date();
      const u = {
        id: uid("usr"),
        name: null,
        passwordHash: null,
        googleId: null,
        role: "CUSTOMER",
        currency: "USD",
        referredById: null,
        points: 0,
        lifetimeSpend: 0,
        createdAt: now,
        updatedAt: now,
        ...args.data,
      };
      store().users.push(u);
      return u;
    },
    update: async (args: AnyRecord) => {
      const u = store().users.find((x) => x.id === args.where.id);
      if (!u) throw new Error("User not found");
      if (args.data.points !== undefined) u.points = applyNumOp(u.points, args.data.points);
      if (args.data.lifetimeSpend !== undefined) u.lifetimeSpend = applyNumOp(u.lifetimeSpend, args.data.lifetimeSpend);
      if (args.data.role !== undefined) u.role = args.data.role;
      if (args.data.googleId !== undefined) u.googleId = args.data.googleId;
      u.updatedAt = new Date();
      return { ...u };
    },
    count: async (args?: AnyRecord) => {
      if (args?.where?.referredById) return store().users.filter((u) => u.referredById === args.where.referredById).length;
      return store().users.length;
    },
  },
  savedGameId: {
    findMany: async (args: AnyRecord) => store().savedGameIds.filter((g) => g.userId === args.where?.userId),
    upsert: async (args: AnyRecord) => {
      const s = store();
      const existing = s.savedGameIds.find(
        (g) => g.userId === args.where.userId_uniqueId.userId && g.uniqueId === args.where.userId_uniqueId.uniqueId,
      );
      if (existing) {
        Object.assign(existing, args.update);
        return existing;
      }
      const item = { id: uid("gid"), createdAt: new Date(), ...args.create };
      s.savedGameIds.push(item);
      return item;
    },
    deleteMany: async (args: AnyRecord) => {
      const s = store();
      s.savedGameIds = s.savedGameIds.filter((g) => !(g.id === args.where.id && g.userId === args.where.userId));
      return { count: 1 };
    },
  },
  supportTicket: {
    findMany: async () => [...store().supportTickets].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    create: async (args: AnyRecord) => {
      const t = { id: uid("tkt"), status: "OPEN", createdAt: new Date(), ...args.data };
      store().supportTickets.unshift(t);
      return t;
    },
    update: async (args: AnyRecord) => {
      const t = store().supportTickets.find((x) => x.id === args.where.id);
      if (t) Object.assign(t, args.data);
      return t;
    },
  },
  auditLog: {
    findMany: async () =>
      store().auditLogs.map((a) => ({
        ...a,
        actor: store().users.find((u) => u.id === a.actorId) ?? { email: "admin@globalpool.test", role: "ADMIN" },
      })),
    create: async (args: AnyRecord) => {
      const log = { id: uid("aud"), createdAt: new Date(), ...args.data };
      store().auditLogs.unshift(log);
      return log;
    },
  },
  $transaction: async (fn: (tx: any) => Promise<any>) => fn(fallbackDb),
} as unknown as PrismaClient;
