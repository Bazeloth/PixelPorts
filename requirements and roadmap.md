## Phase 1: MVP - Get Traction
**Timeline: Weeks 1-4**  
**Goal: 200-500 designers with portfolios, strong activation**

### Features to Build

**Core Portfolio:**
- [ ] User authentication (Supabase + Google/LinkedIn OAuth)
- [ ] Basic profile setup (name, bio, avatar, location, role)
- [ ] Profile sections: Skills, Services, Available for Hire toggle
- [ ] **Project upload (image-first, visually appealing):**
    - Title (required)
    - **Cover image (required)** - simple crop tool or auto center-crop
    - Short summary (300-500 chars max, shows as 1 line under cover)
    - Up to 5 images in MVP (additional images later)
    - Optional expanded captions per image (collapsed by default)
    - Optional "Details" section (longer text, collapsed behind "Read more")
    - Tags, tools used
    - "Seeking Feedback" toggle
- [ ] **Image handling:**
    - Max 5MB per image
    - Strip EXIF data
    - Auto-generate multiple sizes (thumbnail, medium, full)
    - Ensure OG images look great for social sharing
- [ ] Public portfolio pages (pixelports.com/designers/[username])

**Homepage & Discovery (Image-First Design):**
- [ ] **Hero section:**
    - One highlighted project/designer card with strong cover image
    - Concise hook (≤90 characters)
    - Clear CTAs: "View Project" and "Give Feedback"
- [ ] **Project grid (Pinterest/Dribbble aesthetic):**
    - Masonry or neat grid of thumbnails
    - Minimal metadata visible: designer handle, comment count, "seeking feedback" badge
    - Hover state reveals: 1-line summary + "Give Feedback" button
    - Crisp, attractive thumbnails (no text-heavy cover images)
- [ ] **Tabs to concentrate attention:**
    - "Seeking Feedback" (default)
    - "No Comments Yet"
    - "Recent"
- [ ] **Empty states:**
    - New visitors: "Explore projects and leave helpful feedback."
    - Signed-in creators without project: "Upload your first project — get feedback fast."
    - "No comments yet" tab: "Be the first to leave helpful feedback."

**Ranking & Routing (Feedback Loop Optimization):**
- [ ] **Default order:**
    1. Projects marked "Seeking Feedback" first
    2. Tie-breaker: "No comments yet"
    3. Tie-breaker: "Recently updated"
    4. Light boost for projects with recent "helpful" mark (social proof without burying new posts)
- [ ] **After commenting, route user to:**
    - Another "No comments yet" project (keep momentum going)
    - If none available, "Seeking Feedback" project
    - This creates a positive feedback loop
- [ ] Track which projects need attention (internal metric)

**Structured Comment System:**
- [ ] 3-section guided comment form:
    - What's working well (20+ words, 12+ unique tokens)
    - What's unclear or could improve (20+ words, 12+ unique tokens)
    - One actionable suggestion (20+ words, 12+ unique tokens)
- [ ] Live word count with "quality" indicator (green when minimum met)
- [ ] Server-side validation:
    - Block copy-paste spam (detect repeated patterns)
    - Reject if >40% of words repeat between sections
    - Cap URLs (≤1) and emojis (≤3) per section
    - Minimum unique tokens per section (≥12)
- [ ] **Positive micro-copy only:**
    - Under composer: "Be specific: decision → effect → suggestion. Aim for one actionable change."
- [ ] **Owner can mark comment as "Helpful":**
    - Simple thumbs up / "Helpful" button
    - Badge appears: "Marked helpful by creator"
    - Used for subtle ranking boosts and contributor recognition
- [ ] "Seeking Feedback" toggle when uploading projects
- [ ] CTA on thumbnails: "Give feedback"

**Moderation (Day 1 Essentials):**
- [ ] "Report comment" button
    - Tooltip: "See something off? Report it — we'll take a look."
- [ ] Auto-hide after 3 unique reports (pending admin review)
- [ ] Admin panel: view reported comments, hide/restore, view audit log
- [ ] Rate limiting:
    - 3 comments per hour per user
    - Max 8 comments per day per user
    - Per-IP burst control
- [ ] Simple profanity filter (keyword blocklist)
- [ ] Shadowban capability (for repeat offenders)
- [ ] Admin audit log (all moderation actions tracked)

**Analytics (Day 1 Event Tracking):**
- [ ] Track these events:
    - `signed_up`
    - `project_created`
    - `comment_created`
    - `comment_reported`
    - `comment_marked_helpful`
    - `profile_viewed`
    - `project_clicked` (from homepage)
- [ ] **Week-one friendly metrics (internal only):**
    - % of projects with ≥1 comment within 48h (target: 60%+)
    - % of projects with ≥1 "helpful" comment (target: 40%+)
    - Comments per project distribution (reduce zero-comment projects)
    - Click-through from homepage to project pages
- [ ] Simple founder dashboard:
    - Daily new projects
    - Comments per day
    - % of comments marked helpful
    - Top contributors (by helpful comments)
    - Flagged content queue
    - 48h comment rate

**UX/Product Case Study Support (Minimal, Non-Obtrusive):**
- [ ] Short summary (300-500 chars) shown as single line under cover
- [ ] "Read more" expands full summary
- [ ] Enhanced captions: optional expanded text under images (collapsed by default)
- [ ] Single "Details" section at bottom for longer text (collapsed behind "Read more")
- [ ] **No full blog/case-study templates at launch** (revisit if strong usage)
- [ ] Project layout supports text-first for UX folks, but doesn't force it

**Legal/Trust:**
- [ ] Community Guidelines page (link from comment composer)
- [ ] Terms of Service
- [ ] Privacy Policy (explicit: portfolios and reviews are public and shareable)
- [ ] Note on moderation policy

### Features to REMOVE from Phase 1
- ~~Likes/hearts~~ (add in Phase 3+ - they compete with feedback)
- ~~Advanced filtering~~ (tabs are enough for MVP)
- ~~Custom domains~~ (too complex for MVP, delay to Phase 3)
- ~~Advanced analytics~~ (simple metrics only)
- ~~Full case study templates~~ (keep it image-first)

### Seeding Plan (Visual Quality Matters)
- [ ] Pre-populate 30-50 **visually strong** projects before broad sharing
- [ ] Enlist 3-5 power commenters to leave first 50+ guided comments
- [ ] **Hand-pick first 6-12 thumbnails** for hero row to set visual bar and culture
- [ ] Ensure variety (UI, branding, web, product)
- [ ] Set the quality standard high from day one

### Success Metrics

**Activation (Primary):**
- **Activated user** = Uploaded ≥1 project OR received ≥2 comments within D7
- Target: 60%+ activation rate
- Target: 60%+ of projects get ≥1 comment within 48h

**Engagement:**
- **Meaningful feedback per project** = ≥1 comment where all 3 sections pass quality checks AND marked "helpful"
- Target: 50%+ of projects get meaningful feedback within 7 days
- Target: 40%+ of projects have ≥1 "helpful" comment
- Target: 80%+ of comments pass quality validation
- Average: 3+ comments per project

**Visual Appeal (New):**
- Click-through rate from homepage to projects (target: 20%+)
- % of users who browse ≥3 projects after landing (target: 60%+)
- Time on homepage (target: 90+ seconds)

**Quality:**
- 80%+ of comments marked "helpful" by designers
- <5% of comments reported
- <2% of comments need moderation

**Growth:**
- 200+ designers signed up
- 50+ projects uploaded
- 150+ meaningful comments left
- 10-15 users identified as "top contributors"

**Retention:**
- D7 return rate: 40%+ (user returns within 7 days)
- D30 return rate: 25%+ (user returns within 30 days)
- Commenter retention: After leaving 1 comment, 50%+ leave ≥2 total