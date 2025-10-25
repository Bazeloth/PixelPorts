# PixelPorts MVP - Simplified Roadmap
## "Dribbble for Emerging Designers"

**Timeline: Weeks 1-4**  
**Goal: 100-200 designers actively sharing work, simple interaction**

---

## Core Philosophy

✅ **Visual-first portfolio platform**  
✅ **Passive interaction (likes, simple comments)**  
✅ **Low friction — just upload and browse**  
✅ **For emerging designers building their portfolios**

### **How It's Different from Dribbble:**
**Dribbble:** Popular designers dominate → hard for newcomers to get seen  
**PixelPorts:** Discovery algorithm + curation structurally boost emerging designers

**Key mechanisms:**
- Engagement RATE matters (not absolute follower count)
- 50% of Featured = emerging designers
- 2x boost in Discover tab for <100 followers
- Dedicated "New Designers" tab

---

## Features to Build

### **Week 1: Core Upload & Browse**

**User Authentication:**
- [ ] Supabase + Google OAuth (LinkedIn later)
- [ ] Basic profile setup: name, bio, avatar, location, role
- [ ] Username selection (pixelports.com/profile/{username})

**Shot Upload (Image-First with Blocks):**
- [ ] **Cover image** (required) — simple crop tool or auto center-crop
- [ ] **Title** (required, 60 chars max)
- [ ] **Description** (optional, 500 chars max)
- [ ] **Tags/categories** (UI/UX, Branding, Web, Mobile, Illustration, etc.)
- [ ] **Content blocks** (flexible layout):
  - **Image block**: Single image with optional caption
  - **Image gallery block**: 2-4 images in a row with optional caption
  - **Text block - Heading**: Large heading text
  - **Text block - Plain**: Regular paragraph text
  - Add/remove/reorder blocks freely
  - Maximum 10 blocks per shot

**Image Handling:**
- [ ] Max 5MB per image
- [ ] Strip EXIF data
- [ ] Auto-generate sizes: thumbnail (400px), medium (800px), full (1600px)
- [ ] Optimize for fast loading
- [ ] Ensure OG images look great for social sharing

**Public Portfolio Pages:**
- [ ] `pixelports.com/profile/{username}`
- [ ] Grid of all shots
- [ ] Profile info: bio, avatar, location, role
- [ ] "Available for Hire" toggle
- [ ] Total likes count (across all shots)
- [ ] Shot count
- [ ] Following count / Followers count

---

### **Week 2: Homepage & Discovery**

**Hero Section:**
- [ ] One featured shot with large cover image
- [ ] Designer info + avatar
- [ ] "View Shot" CTA
- [ ] Rotates daily (manual curation for MVP)

**Main Shot Grid (Multi-Tiered Discovery):**
- [ ] Masonry or neat grid layout
- [ ] Show on hover:
  - Designer name + avatar
  - Like count
  - Comment count (if any)
  - 1-line description
- [ ] Click anywhere on card → go to shot detail page

**Discovery Tabs (Strategic for Emerging Designers):**
- [ ] **"Featured"** — Manual curation (default tab)
  - Hand-picked best work (50% emerging, 50% established)
  - Sets quality bar and culture
  - Updated 2-3x per week
  - Shows "Featured" badge on shot cards

- [ ] **"Trending"** — Algorithm based on engagement RATE
  - Formula: `(likes + comments * 3) / views * recency_boost`
  - Favors high engagement rate over absolute numbers
  - 100 likes from 1000 views beats 500 likes from 50k views
  - Levels playing field for emerging designers

- [ ] **"Discover"** — Algorithmic mix with emerging boost
  - Combines recency + engagement + diversity
  - 2x boost for designers with <100 followers
  - 1.5x boost for shots <48 hours old
  - Ensures variety (not just popular designers)

- [ ] **"New Designers"** — Spotlight new talent
  - Only shows shots from designers on platform <30 days
  - Sorted by recency
  - "New to PixelPorts" badge on cards
  - Encourages community to welcome newcomers

- [ ] **"Following"** — Personal feed (if logged in)
  - Only shows shots from designers you follow
  - Chronological order

**Category Filter:**
- [ ] Horizontal pills: All, UI/UX, Branding, Web, Mobile, Illustration
- [ ] Combine with tabs (e.g., "Trending Web designs")

**Curation Tools (Admin/Founder):**
- [ ] Featured section management:
  - Add/remove shots from Featured
  - Reorder Featured shots
  - See which shots have been Featured before (prevent repeats)
- [ ] "Trending" algorithm implementation:
  - Track views per shot (increment on page view)
  - Calculate engagement rate: `(likes + comments * 3) / max(views, 10)`
  - Apply recency boost: multiply by `1 / (days_since_upload + 1)`
  - Sort by score, refresh every 6 hours
- [ ] "Discover" algorithm implementation:
  - Base score: engagement rate + recency
  - Apply 2x multiplier for designers with <100 followers
  - Apply 1.5x multiplier for shots <48 hours old
  - Ensure diversity: limit 2 shots per designer in first 30 results
  - Refresh every hour

**Badges & Visual Indicators:**
- [ ] "Featured" badge (gold star icon)
- [ ] "New to PixelPorts" badge (designers <30 days, blue)
- [ ] "First Shot" badge (automatically applied to first upload, green)
- [ ] Show "Days on PixelPorts" on profile (instead of join date)
- [ ] Optional: Hide follower/like counts for first 7 days (reduce anxiety)

**Empty States (Supportive Messaging):**
- [ ] New visitors: "Discover amazing work from emerging designers around the world"
- [ ] Signed-in without shots: "Your first shot doesn't need to be perfect — show your journey, not just the destination"
- [ ] No results in filter: "No shots found. Try a different category."
- [ ] New Designers tab empty: "No new designers yet — be the first to join!"
- [ ] Following tab empty (new user): "Follow designers you admire to see their latest work here"

---

### **Week 3: Interaction & Engagement**

**Likes (❤️):**
- [ ] Heart button on shot cards (hover state)
- [ ] Heart button on shot detail page
- [ ] Show like count
- [ ] "You and 12 others liked this"
- [ ] User can see their liked shots in profile

**Comments (Simple, Freeform):**
- [ ] Single text input (no structure)
- [ ] Minimum 10 characters (prevent spam)
- [ ] Maximum 1000 characters
- [ ] Markdown support for bold/italic (optional)
- [ ] Show avatar + username + timestamp
- [ ] Nested replies (1 level deep only)
- [ ] Owner can delete comments on their shots

**Notifications (Basic):**
- [ ] Email notification when someone:
  - Likes your shot
  - Comments on your shot
  - Replies to your comment
  - Follows you
- [ ] In-app notification badge (simple count)
- [ ] Notification page: list of recent activity

**Social Features:**
- [ ] Follow/unfollow designers
- [ ] Following count / Followers count on profile
- [ ] "Following" tab on homepage

---

### **Week 4: Polish & Moderation**

**Moderation Essentials:**
- [ ] "Report shot" button (spam, inappropriate content)
- [ ] "Report comment" button
- [ ] Auto-hide after 3 unique reports (pending review)
- [ ] Basic admin panel:
  - View reported content
  - Hide/restore shots or comments
  - Ban users
  - View audit log
- [ ] Rate limiting:
  - Max 10 shots per day
  - Max 50 comments per day
  - Prevent rapid-fire uploads (1 per minute)

**Analytics (Simple Tracking):**
- [ ] Track events:
  - `user_signed_up`
  - `shot_uploaded`
  - `shot_liked`
  - `shot_viewed` (for engagement rate calculation)
  - `comment_created`
  - `user_followed`
  - `profile_viewed`
  - `tab_switched` (which discovery tab)
  - `featured_shot_clicked`
- [ ] Founder dashboard (internal only):
  - Daily signups (split by new vs established)
  - Daily uploads
  - Total likes given
  - Total comments
  - Total follows
  - Most liked shots (last 7 days)
  - Most active users (by uploads, likes, comments)
  - **Discovery metrics:**
    - Top 10 shots by engagement rate
    - % of Featured shots from emerging designers (<100 followers)
    - Tab usage breakdown (Featured vs Trending vs Discover vs New)
    - New designer activation rate (% who upload within 7 days)
    - Emerging designer visibility (% of views going to <100 follower accounts)

**Legal Pages:**
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Community Guidelines (simple: be respectful, no spam, no NSFW)

**Tracking & Privacy Compliance:**

**Do You Need a Cookie Banner?**
- **Legally:** Yes, EU law requires opt-in consent BEFORE tracking
- **Pragmatically:** Many MVPs start with implied consent and add proper banner later
- **Why:** Mixpanel uses cookies/localStorage to track users (requires consent under GDPR)

**Pragmatic Staged Approach (Recommended for MVP):**

**Phase 1: MVP Launch (Weeks 1-4, 0-100 users)**
- [ ] Privacy Policy mentions analytics usage
  - What data you collect (events, user profiles)
  - Why you collect it (improve product)
  - Who processes it (Mixpanel)
  - User rights (opt-out available)
- [ ] Simple implied consent notice (30 minutes to implement)
  - "We use cookies to improve your experience. [Learn more]"
  - Dismissible, shown on first visit
  - Track all users by default
- [ ] Honor opt-out requests (if user asks)

**Phase 2: Growing (100-200 users, ~1-2 months after launch)**
- [ ] Add proper cookie consent banner
  - Explicit opt-in required
  - Accept/Decline buttons
  - Don't track until user accepts
- [ ] Configure Mixpanel for opt-in tracking
- [ ] "Cookie Settings" link in footer
- [ ] Grandfather existing users (implied consent)

**Phase 3: Established (1000+ users or revenue)**
- [ ] Must be fully compliant (no shortcuts)
- [ ] Consider location-based consent (EU vs non-EU)
- [ ] Regular compliance audits

**Simple Implied Consent Notice (Phase 1):**

```jsx
// components/CookieNotice.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie_notice_dismissed');
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('cookie_notice_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span>
          We use cookies to analyze usage and improve PixelPorts.{' '}
          <Link href="/privacy" className="underline">
            Learn more
          </Link>
        </span>
        <button
          onClick={dismiss}
          className="ml-4 px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
```

**Mixpanel Setup (Phase 1 - Track by Default):**

```javascript
// lib/analytics.js
import mixpanel from 'mixpanel-browser';

const isDev = process.env.NODE_ENV !== "production";
const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Initialize immediately (no consent check for MVP)
if (token && !isDev) {
  mixpanel.init(token, {
    ignore_dnt: false, // Honor "Do Not Track"
    debug: isDev
  });
}

export const track = (event, properties = {}) => {
  if (isDev) {
    console.log('📊 [Mixpanel]', event, properties);
    return;
  }
  
  if (token) {
    mixpanel.track(event, properties);
  }
};
```

**Mixpanel Setup (Phase 2 - Opt-In Required):**

```javascript
// lib/analytics.js
import mixpanel from 'mixpanel-browser';

const isDev = process.env.NODE_ENV !== "production";
const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

// Initialize but don't track yet
if (token && !isDev) {
  mixpanel.init(token, {
    opt_out_tracking_by_default: true, // Wait for consent
    ignore_dnt: false
  });
}

// Call this after user accepts cookies
export const initTracking = () => {
  if (!isDev && token) {
    mixpanel.opt_in_tracking();
    mixpanel.track('Page Viewed');
  }
};

export const track = (event, properties = {}) => {
  if (isDev) {
    console.log('📊 [Mixpanel]', event, properties);
    return;
  }
  
  if (token) {
    mixpanel.track(event, properties);
  }
};
```

**Risk Assessment:**
- **0-100 users:** Very low risk (regulators target big companies)
- **100-1000 users:** Low risk (add proper banner to be safe)
- **1000+ users or revenue:** Medium-high risk (must be compliant)
- **VC funding:** High risk (investors check compliance)

**The Trade-off:**
- ✅ Ship faster (focus on product, not legal)
- ✅ Validate idea before investing in compliance
- ⚠️ Small legal risk during MVP phase
- ✅ Plan to add proper consent at 100-200 users

**Time Investment:**
- Phase 1 (implied consent notice): 30 minutes
- Phase 2 (proper cookie banner): 3-5 hours
- Phase 3 (full compliance audit): 1-2 days

**Important:** This is pragmatic MVP advice, not legal advice. Consult a lawyer if you're risk-averse, have VC funding, or operate in regulated industries.

---

## Seeding Strategy (Quality + Emerging Focus)

**Pre-Launch (Critical for Credibility):**
- [ ] Seed 30-50 visually stunning shots BEFORE launch
  - 20-30 shots: Your own work + emerging designer friends
  - 10-15 shots: Personally invite 5-10 established designers
  - Variety: UI/UX, branding, web, mobile, illustration
  - Mix of polished final work + process/WIP shots
- [ ] Set up Featured section with 12-15 hand-picked shots
  - 50% from emerging designers (<100 followers elsewhere)
  - 50% from established designers (quality signal)
  - Rotate weekly to showcase variety
- [ ] Seed initial engagement:
  - Leave 20-30 thoughtful comments on seeded shots
  - Distribute likes across all shots (create social proof)
  - Follow all seeded designers
- [ ] Set the bar: High visual quality, but VARIETY in polish level

**Week 1 Launch Strategy:**
- [ ] Invite 15-20 emerging designer friends personally
  - Send personal message: "I'm building a platform to support emerging designers — would love your feedback"
  - Offer to help them set up their first shot
- [ ] Invite 5-10 established designers (credibility boost)
  - Position: "Help us support the next generation of designers"
  - Ask for 1-3 shots to seed quality
- [ ] Post in 2-3 design communities (Reddit, Discord, Twitter)
  - Frame: "Built for emerging designers, by designers"
  - Share specific examples of Featured work
- [ ] Target: 50 signups, 25 uploads, 10 from established designers

**Week 2-4 (Community Building):**
- [ ] Engage daily: like, comment, welcome new designers
- [ ] Update Featured section 2-3x per week
  - Always include at least 50% emerging designers
  - Prioritize great work from newcomers (build confidence)
- [ ] Personal welcome messages to first 100 users
- [ ] Feature 1-2 "Designer Spotlights" per week on social
  - Focus on emerging designers with compelling stories
  - Ask: "What are you working on? What are you learning?"
- [ ] Encourage WIP/process shots in communications
- [ ] Target: 100+ signups, 60+ uploads, healthy mix of experience levels

---

## Success Metrics (Simplified)

### **Primary Metrics (Week 1-4):**

**Activation:**
- **Activated user** = uploaded ≥1 shot within 7 days
- Target: 40%+ of signups activate
- Target for emerging designers: 50%+ activate (they need it most)

**Engagement:**
- Average likes per shot: 3+ within 48h
- % of shots with ≥1 comment within 7 days: 20%+
- % of users who like ≥1 shot: 60%+
- % of users who follow ≥1 designer: 40%+

**Emerging Designer Support (Critical):**
- % of Featured shots from designers with <100 followers: 50%+
- % of total views going to designers with <100 followers: 30%+
- Engagement rate parity: emerging designers get similar like/view ratio as established
- "New Designers" tab CTR: 10%+ (people actually check it)

**Growth:**
- 100+ designers signed up
- 50+ shots uploaded
- Mix: 70% emerging (<100 followers elsewhere), 30% established
- 200+ likes given
- 30+ comments left
- 50+ follows

**Retention:**
- D7 return rate: 30%+ (user returns within 7 days)
- D30 return rate: 20%+
- Emerging designer retention: Track separately (goal: match or beat overall rate)

### **Secondary Metrics (Track but Don't Obsess):**
- Homepage → shot detail CTR: 15%+
- Time on site: 2+ minutes average
- Shots viewed per session: 3+
- % of visitors who sign up: 5%+
- Featured tab vs Trending vs Discover usage (aim for balanced usage)
- New designers getting at least 1 like within 24h: 60%+

---

## What Makes This "For Emerging Designers"?

### **Cultural Positioning:**
1. **No gatekeeping** — anyone can join (unlike Dribbble invites)
2. **Encourage process work** — not just polished final designs
3. **Celebrate learning** — "Show your journey, not just the destination"
4. **Lower stakes** — you don't need 100k followers to matter
5. **Community over competition** — supportive feedback culture

### **Structural Support (This is the Difference):**
1. **Discovery algorithm favors engagement RATE not absolute numbers**
  - 100 likes from 1000 views beats 500 likes from 50k views
  - Levels the playing field for new designers

2. **Featured section is 50% emerging designers**
  - Manual curation ensures quality
  - But explicitly highlights newcomers

3. **"Discover" tab has 2x boost for <100 followers**
  - Algorithm structurally supports discoverability
  - Not just lip service

4. **"New Designers" dedicated tab**
  - Celebrates newcomers explicitly
  - Encourages community to welcome them

5. **Badges celebrate milestones**
  - "First Shot" badge (automatic)
  - "New to PixelPorts" badge (<30 days)
  - Days on platform shown (not just follower count)

6. **Seeding strategy includes variety**
  - WIP shots, not just portfolio pieces
  - Process work gets Featured too
  - Sets tone: all stages of design welcome

### **The Key Difference from Dribbble:**
> **Dribbble:** Everyone CAN join, but popular designers dominate discovery  
> **PixelPorts:** Everyone CAN join, AND emerging designers get algorithmic support

Quality comes from curation + seeding, not from excluding people.

---

## Technical Stack (Recommended)

**Frontend:**
- React (Next.js for SSR/SEO)
- Tailwind CSS
- Vercel hosting

**Backend:**
- Supabase (auth, database, storage, real-time)
- PostgreSQL
- Row Level Security for permissions

**Storage:**
- Supabase Storage for images
- CDN for fast delivery

**Monitoring:**
- Mixpanel (event tracking, funnels, retention)
- Vercel Analytics (page views)

---

## Timeline Breakdown

### **Week 1: Foundation**
- Auth + profile setup
- Shot upload with block-based content
- Portfolio pages
- View tracking (for engagement rate)
- Deploy to production

### **Week 2: Discovery & Algorithms**
- Homepage with multi-tiered tabs
- Featured section with curation tools
- Trending algorithm (engagement rate based)
- Discover algorithm (with emerging boost)
- New Designers tab
- Category filtering
- Shot detail pages
- Badges (First Shot, New to PixelPorts, Featured)
- Seed initial content (30-50 shots)

### **Week 3: Interaction**
- Like functionality
- Comment system
- Follow/unfollow users
- Notifications (email + in-app)
- View tracking refinement

### **Week 4: Launch Prep**
- Moderation tools
- Legal pages (Terms, Privacy Policy, Community Guidelines)
- Simple cookie notice (implied consent - 30 mins)
- Analytics dashboard (with emerging designer metrics)
- Featured section curation (pick initial 12-15)
- Final testing + polish
- Personal invites to seed users
- **LAUNCH** 🚀

**Note:** Add proper cookie consent banner after 100-200 users (see Tracking & Privacy section)

---

## After MVP (Phase 2 Ideas)

**Only build these if MVP gets traction:**
- Collections (save favorites)
- Advanced search
- LinkedIn OAuth
- Designer showcase (weekly/monthly)
- Hiring board ("Available for Hire" page)
- Portfolio customization (colors, layout)
- Export portfolio as PDF
- Mobile app

---

## Compliance Upgrade Path

**As your platform grows, upgrade your privacy compliance:**

### **✅ MVP Launch (0-100 users)**
- Simple implied consent notice
- Privacy Policy
- Track by default
- Time: 30 minutes

### **⚠️ At 100-200 users (~1-2 months)**
- Add proper cookie consent banner
- Opt-in required before tracking
- Configure Mixpanel for consent
- Time: 3-5 hours

### **🔒 At 1000+ users or revenue**
- Full compliance audit
- Consider location-based consent (EU vs non-EU)
- Review data retention policies
- Consider legal consultation
- Time: 1-2 days

**Key triggers for upgrading:**
- Hitting 100-200 active users
- Generating revenue
- Raising VC funding
- Receiving GDPR complaints
- Expanding to EU market specifically

---

## The Focus

**"Let designers show their work and interact naturally."**

Build simple, beautiful, and fast. If people upload and engage → you win.

Start with the essentials. Add features based on what users actually need. 🎯