# PixelPorts MVP - Updated Roadmap with Business Model
## "Portfolio Platform for Emerging Designers"

**Timeline: Weeks 1-4**  
**Goal: 100-200 designers, 5-10 Pro users, sustainable foundation**

---

## Business Model

### **Designer Freemium from Day One**

**Free Tier (Forever):**
- Unlimited uploads
- Portfolio page (`pixelports.com/profile/{username}`)
- Full discovery (Featured, Trending, Discover, New Designers)
- All community features (likes, comments, follows)
- Basic analytics (total views, total likes)
- **This is genuinely useful on its own**

**Pro Tier ($6-8/month):**
- **Advanced analytics** (who viewed, from where, traffic sources, engagement trends)
- **Custom domain** (`yourname.com` points to PixelPorts backend)
- **Portfolio customization** (colors, layout, curated collections)
- **PDF export** (auto-generated portfolio)
- **Priority Featured consideration** (reviewed first by curation team)
- **"Available for Hire"** badge + priority placement
- **Remove branding** footer

**Target conversion: 5-10% of active designers**

### **Why This Works**

**For Free Users:**
- Complete, functional portfolio immediately
- Full discovery features (never gated)
- Professional profile to share with recruiters
- Zero ongoing costs

**For Pro Users:**
- Tools for serious job seekers
- Competitive advantages during job hunt
- Insights into portfolio effectiveness
- Professional polish and branding

**Key Positioning:**
- "Free forever for emerging designers"
- "Pro is for serious job seekers who want extra tools"
- "We charge for insights and polish, never for visibility"

### **Three-Phase Timeline**

**Phase 1 (Months 1-6): Designer Growth**
- Launch free + Pro simultaneously
- Early adopter pricing: $4/month for first 500 users
- **Goal:** 500-1,000 designers, 25-50 Pro users
- **Revenue:** $1,200-4,800/year (covers hosting)

**Phase 2 (Months 6-18): Product-Market Fit**
- Hit 3,000-5,000 designers
- Standard pricing: $8/month
- **Goal:** 150-350 Pro users (7% conversion)
- **Revenue:** $14,400-33,600/year (modest founder income)

**Phase 3 (Months 18-24): Add Recruiter Layer**
- Launch hiring marketplace
- Recruiter subscriptions: $99-149/month
- Job board: $149-299 per listing
- **Revenue:** $200k+/year (sustainable business)

---

## Core Philosophy

**Visual-first portfolio platform**  
**Passive interaction (likes, simple comments)**  
**Low friction - just upload and browse**  
**For emerging designers building their portfolios**

### **The Real Problem We're Solving:**

**Research Finding:** Portfolios suffer from a **discovery problem**, not just a quality problem.

**2024 Designer Reality:**
- Only 49.5% of designers find roles within 3 months
- Entry-level positions receive 1,000+ applications
- 70% of freelancers WITH portfolio sites land clients vs. 30% without
- Popular designers dominate existing platforms - newcomers invisible
- Networking & referrals are how designers GET work - but you need visibility first

**The Core Issue:** Quality work exists, but the *right people* never see it. Emerging designers are stuck in a catch-22: can't get noticed without a network, can't build a network without being noticed.

### **How It's Different from Dribbble:**
**Dribbble:** Popular designers dominate - hard for newcomers to get seen  
**PixelPorts:** Discovery algorithm + curation structurally boost emerging designers

**Key mechanisms:**
- Engagement RATE matters (not absolute follower count)
- 50% of Featured = emerging designers
- 2x boost in Discover tab for <100 followers
- Dedicated "New Designers" tab
- Fast performance (competitors lose users at 20+ second load times)
- Built-in portfolio analytics (designers currently fly blind)
- Freemium model that never gates visibility

**Why This Matters:** Referrals drive 70% of design work, but you need VISIBILITY to build that network. PixelPorts makes emerging designers visible from day one, with optional Pro tools for serious job seekers.

---

## Features to Build

### **Week 1: Core Upload & Browse**

**User Authentication:**
- [ ] Supabase + Google OAuth (LinkedIn later)
- [ ] Basic profile setup: name, bio, avatar, location, role
- [ ] Username selection (pixelports.com/profile/{username})
- [ ] **Pro tier flag** in user table (boolean, defaults to false)

**Shot Upload (Flexible: Simple Shots to Full Case Studies):**

**The Philosophy:**
> "Upload as much or as little context as you want. Quick shot? Done in 30 seconds. Want to show your process? Add galleries and descriptions. Building a case study? Use text and image blocks."

**All uploads include:**
- [ ] **Cover image** (required) - simple crop tool or auto center-crop
- [ ] **Title** (required, 60 chars max)
- [ ] **Description** (optional, 500 chars max)
- [ ] **Tags/categories** (UI/UX, Branding, Web, Mobile, Illustration, etc.)

**Optional content blocks (add as many as you want):**
- [ ] **Content blocks** (flexible layout):
  - **Image block**: Single image with optional caption
  - **Image gallery block**: 2-4 images in a row with optional caption
  - **Text block - Heading**: Large heading text
  - **Text block - Plain**: Regular paragraph text
  - Add/remove/reorder blocks freely
  - Maximum 10 blocks per shot

**Upload Examples to Show Users:**

**Simple Shot (30 seconds):**
- Cover image: Final dashboard design
- Title: "Analytics Dashboard"
- (Published. That's it.)

**Shot with Process (3-5 minutes):**
- Cover image: Final dashboard
- Title: "Analytics Dashboard Design"
- Image gallery block: "Early explorations" (3 sketches)
- Image gallery block: "Iterations" (3 versions)
- Text block: "I focused on data hierarchy and readability"

**Mini Case Study (15-30 minutes):**
- Cover image: Final dashboard
- Title: "Analytics Dashboard for SaaS Platform"
- Text heading: "The Problem"
- Text paragraph: "Users couldn't understand their data..."
- Image gallery: "Research findings" (3 screenshots)
- Text heading: "The Solution"
- Image gallery: "Design iterations"
- Text heading: "Impact"
- Text paragraph: "Increased engagement by 40%..."

**Upload Flow Messaging:**
- Default: Cover + title (can publish immediately)
- After publishing: "Want to add more? Show your process with image galleries or describe your thinking"
- Suggested blocks: "Add iterations" / "Add description" / "Add impact"
- No pressure: "Add as much or as little context as you want"

**Image Handling (CRITICAL FOR PERFORMANCE):**
- [ ] Max 5MB per image
- [ ] Strip EXIF data
- [ ] Auto-generate sizes: thumbnail (400px), medium (800px), full (1600px)
- [ ] Optimize for fast loading (research shows 20+ sec load times kill portfolios)
- [ ] **Target: <2 second page load** (competitive advantage vs. Figma portfolios)
- [ ] Ensure OG images look great for social sharing
- [ ] Progressive image loading with placeholders

**Public Portfolio Pages:**
- [ ] `pixelports.com/profile/{username}`
- [ ] Grid of all shots
- [ ] Profile info: bio, avatar, location, role
- [ ] "Available for Hire" toggle (Free tier)
- [ ] **"Available for Hire" badge** (Pro tier only - visible on profile)
- [ ] **Basic stats (Free tier)**: Total likes, shot count
- [ ] **Pro badge** if user has Pro tier
- [ ] Following count / Followers count
- [ ] **Simple share button** (copy link, Twitter, LinkedIn) - easy sharing = visibility

**Stripe Integration (Pro Subscriptions):**
- [ ] Stripe Checkout integration
- [ ] Subscription management (upgrade, downgrade, cancel)
- [ ] Webhook handling (subscription created, updated, cancelled)
- [ ] Pro status updates in real-time
- [ ] Billing portal link (manage subscription, update payment)

**Pricing Page:**
- [ ] `/pricing` route
- [ ] Feature comparison: Free vs Pro
- [ ] Clear CTAs: "Start Free" and "Upgrade to Pro"
- [ ] Early adopter messaging: "$4/month for first 500 users"
- [ ] FAQ section:
  - "Can I downgrade anytime?" (Yes)
  - "What happens if I cancel Pro?" (Keep all your work, lose Pro features)
  - "Do I need Pro to be discovered?" (No, discovery is always free)

---

### **Week 2: Homepage & Discovery**

**Hero Section:**
- [ ] One featured shot with large cover image
- [ ] Designer info + avatar
- [ ] **Show Pro badge** if designer has Pro
- [ ] "View Shot" CTA
- [ ] Rotates daily (manual curation for MVP)

**Main Shot Grid (Multi-Tiered Discovery):**
- [ ] Masonry or neat grid layout
- [ ] Show on hover:
  - Designer name + avatar
  - Like count
  - Comment count (if any)
  - 1-line description
  - **Pro badge** (if applicable)
- [ ] Click anywhere on card - go to shot detail page

**Discovery Tabs (Strategic for Emerging Designers):**
- [ ] **"Featured"** - Manual curation (default tab)
  - Hand-picked best work (50% emerging, 50% established)
  - Sets quality bar and culture
  - Updated 2-3x per week
  - Shows "Featured" badge on shot cards
  - **Pro users reviewed first** (priority consideration)
  - **Research insight:** Manual curation combats "generic portfolio" problem

- [ ] **"Trending"** - Algorithm based on engagement RATE
  - Formula: `(likes + comments * 3) / views * recency_boost`
  - Favors high engagement rate over absolute numbers
  - 100 likes from 1000 views beats 500 likes from 50k views
  - Levels playing field for emerging designers
  - **Research insight:** This solves the "popular designer dominance" problem

- [ ] **"Discover"** - Algorithmic mix with emerging boost
  - Combines recency + engagement + diversity
  - 2x boost for designers with <100 followers
  - 1.5x boost for shots <48 hours old
  - Ensures variety (not just popular designers)
  - **Research insight:** Addresses "getting seen by right people" frustration

- [ ] **"New Designers"** - Spotlight new talent
  - Only shows shots from designers on platform <30 days
  - Sorted by recency
  - "New to PixelPorts" badge on cards
  - Encourages community to welcome newcomers
  - **Research insight:** Helps break the catch-22 of needing network to get network

- [ ] **"Following"** - Personal feed (if logged in)
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
  - **Filter: Review Pro users first** (priority consideration)
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
- [ ] **"Process Shown" badge** (shots with 3+ content blocks, purple)
- [ ] **"Pro" badge** (small, tasteful indicator on profiles/cards)
- [ ] Show "Days on PixelPorts" on profile (instead of join date)
- [ ] Optional: Hide follower/like counts for first 7 days (reduce anxiety)

**Empty States (Supportive Messaging):**
- [ ] New visitors: "Discover amazing work from emerging designers around the world"
- [ ] Signed-in without shots: "Your first shot doesn't need to be perfect - show your journey, not just the destination. Start with a simple upload and add context later if you want."
- [ ] No results in filter: "No shots found. Try a different category."
- [ ] New Designers tab empty: "No new designers yet - be the first to join!"
- [ ] Following tab empty (new user): "Follow designers you admire to see their latest work here"

---

### **Week 3: Interaction & Engagement**

**Likes:**
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
- [ ] **Research insight:** Comments = social proof for emerging designers

**Notifications (Basic):**
- [ ] Email notification when someone:
  - Likes your shot
  - Comments on your shot
  - Replies to your comment
  - Follows you
  - **Pro users: Weekly digest of profile views** (if Pro)
- [ ] In-app notification badge (simple count)
- [ ] Notification page: list of recent activity

**Social Features:**
- [ ] Follow/unfollow designers
- [ ] Following count / Followers count on profile
- [ ] "Following" tab on homepage

**Basic Analytics (Free Tier):**
- [ ] Simple stats dashboard in user settings:
  - Total profile views (last 30 days)
  - Total likes (all time)
  - Total comments (all time)
  - Shot count
  - Follower count
  - Most liked shot (title + count)
- [ ] Per-shot basic stats:
  - View count
  - Like count
  - Comment count
- [ ] **CTA to Pro tier:** "Want to see who's viewing your work and where they're coming from? Upgrade to Pro"

**Advanced Analytics (Pro Tier Only):**
- [ ] Advanced dashboard in user settings:
  - **Traffic sources breakdown** (Featured tab, Discover, Trending, Direct, External)
  - **Geographic data** (aggregated: "12 views from San Francisco, 8 from London")
  - **Engagement rate** (your rate vs platform average)
  - **View trends over time** (chart showing last 30 days)
  - **Top performing shots** (ranked by engagement rate)
  - **Profile viewer insights** (anonymous aggregate: "3 views from design agencies this week")
  - **Best days/times** for posting (when your work gets most engagement)
- [ ] Per-shot advanced stats:
  - Views over time (chart)
  - Traffic sources
  - Where viewers came from
  - Average time on page
  - Click-through rate (if links in description)
- [ ] Export analytics as CSV

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
  - Max 10 shots per day (Free tier)
  - **Unlimited uploads per day** (Pro tier)
  - Max 50 comments per day
  - Prevent rapid-fire uploads (1 per minute)

**Analytics (Simple Tracking):**
- [ ] Track events:
  - `user_signed_up`
  - `user_upgraded_to_pro` (critical conversion event)
  - `user_downgraded_from_pro`
  - `shot_uploaded`
  - `shot_liked`
  - `shot_viewed` (for engagement rate calculation)
  - `comment_created`
  - `user_followed`
  - `profile_viewed`
  - `tab_switched` (which discovery tab)
  - `featured_shot_clicked`
  - `share_button_clicked` (track viral sharing)
  - `pricing_page_viewed`
  - `upgrade_button_clicked`
- [ ] Founder dashboard (internal only):
  - Daily signups (split by new vs established)
  - **Pro conversion metrics:**
    - Total Pro users
    - Pro conversion rate (%)
    - Monthly recurring revenue (MRR)
    - Churn rate (Pro cancellations)
    - Average time to upgrade (days from signup)
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
  - **Performance metrics:**
    - Average page load time
    - Average shots viewed per session
    - Homepage - shot detail CTR
    - Share button usage
  - **Content metrics:**
    - % of shots with 0 blocks (simple shots)
    - % of shots with 3+ blocks (process shown)
    - Average blocks per shot

**Pro Tier Features (Finalize):**
- [ ] **Custom domain setup:**
  - DNS configuration instructions
  - CNAME record validation
  - SSL certificate auto-provision
  - Custom domain management in settings
- [ ] **Portfolio customization:**
  - Color picker (primary color)
  - Layout options (grid density)
  - Show/hide elements (follower count, like counts)
- [ ] **PDF export:**
  - Auto-generate portfolio PDF
  - Include selected shots or all shots
  - Clean layout with branding
  - Download button in settings
- [ ] **Remove branding:**
  - Hide "Powered by PixelPorts" footer
  - Clean, professional look

**Legal Pages:**
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Community Guidelines (simple: be respectful, no spam, no NSFW)
- [ ] **Refund Policy** (for Pro subscriptions)

---

## Seeding Strategy (Quality + Emerging Focus)

**Pre-Launch (Critical for Credibility):**
- [ ] Seed 30-50 visually stunning shots BEFORE launch
  - 20-30 shots: Your own work + emerging designer friends
  - 10-15 shots: Personally invite 5-10 established designers
  - Variety: UI/UX, branding, web, mobile, illustration
  - **Mix content depth:** 50% simple shots, 30% shots with process, 20% mini case studies
  - Shows that all upload styles are welcome
- [ ] Set up Featured section with 12-15 hand-picked shots
  - 50% from emerging designers (<100 followers elsewhere)
  - 50% from established designers (quality signal)
  - **Include both simple shots and process-heavy shots**
  - Rotate weekly to showcase variety
- [ ] Seed initial engagement:
  - Leave 20-30 thoughtful comments on seeded shots
  - Distribute likes across all shots (create social proof)
  - Follow all seeded designers
- [ ] Set the bar: High visual quality, but VARIETY in polish level and depth

**Week 1 Launch Strategy:**
- [ ] Invite 15-20 emerging designer friends personally
  - Send personal message: "I'm building a platform to support emerging designers - would love your feedback"
  - Offer to help them set up their first shot
  - **Show them:** "Upload can be quick (30 sec) or detailed (case study)"
  - **Pitch insight:** "You need visibility to build your network. We give you that from day one."
- [ ] Invite 5-10 established designers (credibility boost)
  - Position: "Help us support the next generation of designers"
  - Ask for 1-3 shots to seed quality
  - **Offer free Pro tier** for early supporter established designers
- [ ] Post in 2-3 design communities (Reddit, Discord, Twitter)
  - Frame: "Built for emerging designers, by designers"
  - Share specific examples of Featured work
  - **Address pain point:** "Tired of 20-second portfolio load times? Us too."
  - **Emphasize:** "Free forever, with optional Pro tools for job seekers"
- [ ] Target: 50 signups, 25 uploads, 10 from established designers

**Week 2-4 (Community Building):**
- [ ] Engage daily: like, comment, welcome new designers
- [ ] Update Featured section 2-3x per week
  - Always include at least 50% emerging designers
  - Prioritize great work from newcomers (build confidence)
  - **Feature variety:** Simple shots, process shots, case studies
- [ ] Personal welcome messages to first 100 users
- [ ] Feature 1-2 "Designer Spotlights" per week on social
  - Focus on emerging designers with compelling stories
  - Ask: "What are you working on? What are you learning?"
- [ ] Encourage WIP/process shots in communications
- [ ] **Soft Pro tier promotion:**
  - Offer early adopter discount ($4/month)
  - Don't push hard, just make it available
  - Let quality of Pro features speak for itself
- [ ] Target: 100+ signups, 60+ uploads, 3-5 Pro conversions, healthy mix of experience levels

---

## Success Metrics (Updated with Pro Tier)

### **Primary Metrics (Week 1-4):**

**Activation:**
- **Activated user** = uploaded â‰¥1 shot within 7 days
- Target: 40%+ of signups activate
- Target for emerging designers: 50%+ activate (they need it most)

**Pro Conversion (Critical New Metric):**
- **Pro conversion rate**: % of active users who upgrade to Pro
- Target (Month 1): 3-5% (challenging in first month)
- Target (Month 3-6): 5-7% (as value becomes clear)
- Target (Month 6-12): 7-10% (mature product)
- **Time to upgrade**: Average days from signup to Pro upgrade
- Target: <14 days (if they upgrade, they do it quickly)

**Engagement:**
- Average likes per shot: 3+ within 48h
- % of shots with â‰¥1 comment within 7 days: 20%+
- % of users who like â‰¥1 shot: 60%+
- % of users who follow â‰¥1 designer: 40%+

**Content Variety (New Metric):**
- % of shots that are simple (0-1 blocks): 40-50%
- % of shots with process (2-3 blocks): 30-40%
- % of shots that are mini case studies (4+ blocks): 10-20%
- Goal: Healthy mix, not all one type

**Emerging Designer Support (Critical):**
- % of Featured shots from designers with <100 followers: 50%+
- % of total views going to designers with <100 followers: 30%+
- Engagement rate parity: emerging designers get similar like/view ratio as established
- "New Designers" tab CTR: 10%+ (people actually check it)
- **New metric (research-backed):** New designers getting profile views within 24h: 70%+

**Growth:**
- 100+ designers signed up
- 50+ shots uploaded
- Mix: 70% emerging (<100 followers elsewhere), 30% established
- **5-10 Pro users** (at $4/month = $20-40/month MRR)
- 200+ likes given
- 30+ comments left
- 50+ follows

**Retention:**
- D7 return rate: 30%+ (user returns within 7 days)
- D30 return rate: 20%+
- Emerging designer retention: Track separately (goal: match or beat overall rate)
- **Pro retention:** >90% monthly (minimal churn)

**Performance (Competitive Advantage):**
- Average page load time: <2 seconds
- Homepage load time: <1.5 seconds
- Time to interactive: <3 seconds
- **Why:** Figma portfolios average 20 seconds - we must be dramatically faster

**Revenue (New):**
- MRR (Monthly Recurring Revenue): $20-40 in Month 1
- Target Year 1: $400/month (50 Pro users at $8/month)
- Churn rate: <10% monthly

### **Secondary Metrics (Track but Don't Obsess):**
- Homepage - shot detail CTR: 15%+
- Time on site: 2+ minutes average
- Shots viewed per session: 3+
- % of visitors who sign up: 5%+
- Featured tab vs Trending vs Discover usage (aim for balanced usage)
- New designers getting at least 1 like within 24h: 60%+
- Share button usage: 10%+ of shot views result in share
- **Pricing page views:** Track interest in Pro tier
- **Upgrade button clicks:** Conversion funnel metric

---

## What Makes This "For Emerging Designers"?

### **Cultural Positioning:**
1. **No gatekeeping** - anyone can join (unlike Dribbble invites)
2. **Encourage all types of work** - simple shots, process work, case studies all welcome
3. **Celebrate learning** - "Show your journey, not just the destination"
4. **Lower stakes** - you don't need 100k followers to matter
5. **Community over competition** - supportive feedback culture
6. **Never gate visibility** - discovery is free, we charge for insights and polish

### **Structural Support (This is the Difference):**
1. **Discovery algorithm favors engagement RATE not absolute numbers**
  - 100 likes from 1000 views beats 500 likes from 50k views
  - Levels the playing field for new designers
  - **Research-backed:** Solves #1 designer frustration (being seen by right people)

2. **Featured section is 50% emerging designers**
  - Manual curation ensures quality
  - But explicitly highlights newcomers
  - **Research-backed:** Combats "generic portfolio" fatigue

3. **"Discover" tab has 2x boost for <100 followers**
  - Algorithm structurally supports discoverability
  - Not just lip service
  - **Research-backed:** Addresses visibility gap

4. **"New Designers" dedicated tab**
  - Celebrates newcomers explicitly
  - Encourages community to welcome them
  - **Research-backed:** Breaks the network catch-22

5. **Badges celebrate milestones and variety**
  - "First Shot" badge (automatic)
  - "New to PixelPorts" badge (<30 days)
  - "Process Shown" badge (3+ content blocks)
  - Days on platform shown (not just follower count)

6. **Seeding strategy includes variety**
  - Simple shots, process shots, case studies
  - WIP work gets Featured too
  - Sets tone: all stages and styles of work welcome

7. **Performance as feature**
  - <2 second load times
  - Instant interactions
  - **Research-backed:** 20-second Figma loads lose designers

8. **Ethical freemium model**
  - Free tier is genuinely complete (unlimited uploads, full discovery)
  - Pro tier enhances with insights and polish, never gates visibility
  - Transparent pricing, no dark patterns
  - **Research-backed:** Designers will pay for portfolio analytics and job-seeking tools

### **The Key Difference from Dribbble:**
> **Dribbble:** Everyone CAN join, but popular designers dominate discovery + Pro required for basic features
> **PixelPorts:** Everyone CAN join, emerging designers get algorithmic support, AND free tier is genuinely complete

**Research Validation:**
- 49.5% of designers take 3+ months to find work
- The problem isn't portfolio quality - it's visibility
- Referrals drive 70% of work, but you need visibility to build network
- We structurally solve the visibility problem
- Designers desperately need analytics but don't have them

Quality comes from curation + seeding, not from excluding people or gating features.

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
- CDN for fast delivery (critical for <2s load times)

**Payments:**
- Stripe (subscriptions, billing portal)
- Webhook handling for real-time updates

**Monitoring:**
- PostHog or Mixpanel (event tracking, especially Pro conversions)
- Vercel Analytics (page views)
- Performance monitoring (Web Vitals, Core Web Vitals)

---

## Timeline Breakdown

### **Week 1: Foundation**
- Auth + profile setup
- Shot upload with flexible block-based content
- Portfolio pages (with Pro badge support)
- View tracking (for engagement rate)
- **Stripe integration** (Pro subscriptions)
- **Pricing page**
- Performance optimization (image compression, CDN setup)
- Deploy to production

### **Week 2: Discovery & Algorithms**
- Homepage with multi-tiered tabs
- Featured section with curation tools (Pro priority)
- Trending algorithm (engagement rate based)
- Discover algorithm (with emerging boost)
- New Designers tab
- Category filtering
- Shot detail pages
- Badges (First Shot, New to PixelPorts, Featured, Process Shown, Pro)
- Seed initial content (30-50 shots, variety of depth)
- Share buttons (easy viral growth)

### **Week 3: Interaction & Analytics**
- Like functionality
- Comment system
- Follow/unfollow users
- Notifications (email + in-app)
- **Basic analytics dashboard** (free tier)
- **Advanced analytics dashboard** (Pro tier only)
- View tracking refinement
- Performance monitoring (track load times)

### **Week 4: Launch Prep & Pro Polish**
- Moderation tools
- Legal pages (including refund policy)
- **Pro tier features finalization:**
  - Custom domain setup
  - Portfolio customization
  - PDF export
  - Remove branding
- Analytics dashboard (with Pro conversion metrics)
- Featured section curation (pick initial 12-15)
- Final testing + polish
- Load time optimization (<2s target)
- Personal invites to seed users
- **Early adopter messaging** ($4/month for first 500 users)
- **LAUNCH**

---

## After MVP (Phase 2-3 - Three-Phase Strategy)

### **Phase 2 (Months 6-18): Scale Designer Base**

**Goals:**
- 3,000-5,000 active designers
- 150-350 Pro users (7% conversion at $8/month)
- Revenue: $14,400-33,600/year
- Strong engagement and retention metrics

**Focus:**
- Improve Pro features based on feedback
- Optimize conversion funnel
- Community building and curation
- Performance optimization
- Marketing and growth

**New Features (Based on Demand):**
- **Enhanced Pro Analytics:**
  - Deeper insights into viewer behavior
  - Competitor benchmarking
  - A/B testing for portfolio optimization

- **Curated Collections (Pro Feature):**
  - Create multiple collections: `pixelports.com/profile/username/ux-work`
  - Audience-specific portfolios
  - Custom URLs for different job applications

- **Social Proof Tools:**
  - Testimonials on shots
  - "Worked with" connections
  - Client badges

- **Export & Sharing:**
  - Enhanced PDF export templates
  - Portfolio widgets for embedding
  - Social media preview optimization

### **Phase 3 (Months 18-24): Add Recruiter Layer**

**Goals:**
- Launch hiring marketplace
- 100+ recruiters at $99-149/month
- 50+ job posts per month at $149-299
- Combined revenue: $200k+/year
- Sustainable, scalable business

**Recruiter Features:**
- **Recruiter Starter** ($99/month):
  - Advanced search and filters
  - View all designer portfolios
  - 20 direct messages/month
  - Basic analytics

- **Recruiter Pro** ($149/month):
  - Everything in Starter
  - Unlimited messages
  - Candidate tracking
  - Advanced analytics
  - Priority support

- **Job Board:**
  - Post jobs ($149-299 per listing)
  - Featured placement options
  - Application management
  - Analytics on posts

**Designer Benefits (Still Free):**
- "Available for Hire" aggregation
- Job alerts (email notifications)
- Application tracking
- More visibility opportunities

### **Lower Priority Features (Build Only If Traction):**
- Advanced portfolio customization (full theming)
- Mobile app
- Team accounts
- Video uploads
- Live collaboration tools
- Designer events/webinars

---

## The Focus

**"Let designers show their work and get discovered by the right people - with optional Pro tools for serious job seekers."**

**Research Validates:**
- The problem is discovery, not quality
- Emerging designers have great work, but no visibility
- Networking drives 70% of opportunities, but you need to be seen first
- Current platforms favor popularity over engagement quality
- Designers desperately need portfolio analytics
- Freemium can work if free tier is genuinely valuable

Build simple, beautiful, and FAST (<2s loads). Focus on structural advantages for emerging designers. Make money sustainably without gating core value. If people upload, get seen, upgrade to Pro for insights, and build networks - you win.

Start with the essentials. Add features based on what users actually need.

---

## Key Research Insights Summary

**What We Learned:**
1. **Discovery problem** > quality problem
2. Designers need **visibility to build networks** (catch-22)
3. **Performance matters**: 20s Figma loads lose users
4. **Designers lack portfolio analytics** (flying blind)
5. **Referrals drive work** but require initial visibility
6. **Generic portfolios fatigue recruiters** (curation helps)
7. Only **49.5% find work in 3 months** (market is brutal)
8. Designers want **audience-specific customization**
9. **Freemium can work** if free tier solves core problem
10. **Recruiters come AFTER designer growth** (18-24 months)

**Our Solution:**
- Engagement RATE algorithm (not popularity)
- Structural emerging designer boost (2x multiplier)
- Manual curation (50% emerging in Featured)
- Fast performance (<2s loads)
- Flexible uploads (simple shots to case studies)
- **Ethical freemium:** Free tier = complete, Pro tier = insights & polish
- **Three-phase monetization:** Designers first, then Pro tier, then recruiters

**Financial Validation:**
- Year 1: $5k/year (covers hosting)
- Year 2: $34k/year (part-time founder income)
- Year 3: $244k/year (sustainable business with recruiter layer)

**Validation:**
- 70% of freelancers with portfolios land clients
- But only if the RIGHT people see them
- We solve the "right people" problem structurally
- And we provide the analytics designers desperately need