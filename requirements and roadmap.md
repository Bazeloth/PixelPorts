# PixelPorts Roadmap & Requirements (Updated)

## Phase 1: MVP - Get Traction
**Timeline: Weeks 1-4**  
**Goal: 200-500 designers with portfolios, strong activation**

**Core Focus:** Portfolio showcase platform with optional community feedback

---

## Core Features to Build

### 1. Authentication & User Setup
**Status:** Core foundation

- [ ] **Authentication System:**
  - Supabase Auth + Google OAuth (primary)
  - Email/password as fallback option
  - Basic user model: `id`, `email`, `created_at`

- [ ] **Complete Profile Flow:**
  - **Triggered after first sign-up**
  - **Required fields:**
    - Full name (text input)
    - Username (text input with validation, shows as `pixelports.com/@username`)
    - What do you do? (dropdown: UI/UX Designer, Product Designer, Graphic Designer, Brand Designer, Illustrator, Web Designer, Other)
  - **Optional fields:**
    - Profile photo (upload, max 5MB, auto-resize to 400x400)
    - About you (bio, textarea, 300 char max)
    - Location (text, "City, Country" format)
    - Available for hire (checkbox toggle)
  - **Avatar system:**
    - If no photo uploaded: Show gradient-based avatar with initials
    - Use `userId` as seed for consistent gradient colors (purple/indigo range)
    - Store avatar as `{userId}.{ext}` in Supabase Storage `/avatars` bucket
    - Avatar component handles URL construction internally
  - **UX Notes:**
    - Profile photo is optional to reduce friction
    - Show progress indicator: "Step 2 of 2"
    - Two action buttons: "Save as Draft" (saves partial progress, can complete later), "Complete Profile"
    - After completion, redirect to project upload or explore page

---

### 2. Project Upload System
**Goal:** Flexible, block-based project builder for diverse storytelling

- [ ] **Block-Based Project Builder:**
  - **Available Block Types:**
    - **Text Block:** Rich text editor (headings, paragraphs, lists, bold, italic, links)
    - **Single Image Block:** Upload one image with optional caption
    - **Image Gallery Block:** Upload multiple images (2-10 per gallery)
      - Navigation: Left/right arrows + dot indicators below
      - Click images to cycle through in full size view (no separate lightbox)
      - Images display at full width within project page
      - Optional captions per image
    - Future blocks: Video embed, Code snippet, Divider (not Phase 1)

  - **Block Management:**
    - Add blocks with "+ Add Block" button (dropdown menu)
    - Drag-and-drop to reorder blocks
    - Delete blocks with trash icon
    - No limit on number of blocks (keep it flexible)
    - Auto-save as draft every 30 seconds

- [ ] **Required Project Fields:**
  - **Title** (text input)
  - **Thumbnail Image** (required for homepage previews)
    - User must designate one image from their project blocks as the thumbnail
    - If project contains images in blocks, show "Set as thumbnail" option on each
    - If no images uploaded yet, prompt to add an image block first
    - Selected thumbnail is cropped to 4:3 aspect ratio for consistency
    - Crop tool: Center-crop or manual adjustment
  - **Category** (dropdown: UI/UX, Branding, Web Design, Mobile Design, Illustration, Other)
  - **Short description** (textarea, 150-300 chars, shows on card previews)

- [ ] **Optional Project Fields:**
  - **Tags** (comma-separated input, suggest common tags)
  - **Tools used** (multi-select dropdown: Figma, Sketch, Adobe XD, Photoshop, Illustrator, etc.)
  - **Project URL** (external link to live site/prototype)
  - **"Seeking Feedback" toggle** (default: OFF, optional feature)

- [ ] **Image Handling (applies to all images in blocks):**
  - Max 5MB per image
  - Accepted formats: JPG, PNG, WebP, GIF
  - Client-side validation before upload
  - Server-side: Strip EXIF data for privacy
  - Auto-generate multiple sizes:
    - Thumbnail: 400x300 (for homepage cards and previews)
    - Medium: 800x600 (for project page display)
    - Full: 1600x1200 (for full-size gallery view)
  - Store in Supabase Storage `/projects/{projectId}/` folder
  - Optimize for web (convert to WebP where supported)
  - Ensure thumbnail (designated image) looks great for social sharing (OG image)

- [ ] **Project Builder UX:**
  - **Preview mode:** Toggle between Edit and Preview
  - **Draft system:**
    - All projects start as drafts
    - Auto-save every 30 seconds
    - Manual "Save Draft" button
  - **Publishing:**
    - "Publish" button (validates required fields)
    - Can unpublish back to draft later
    - Published projects appear on homepage/profile
  - **Empty state:**
    - Show helpful starter: "Start with a text block to introduce your project, then add images"
    - Example project link

- [ ] **Thumbnail Selection Flow:**
  1. User uploads images in any block (single image or gallery)
  2. Each image shows "Set as thumbnail" button (camera icon overlay on hover)
  3. Selected thumbnail shows checkmark badge
  4. Thumbnail preview shown in sidebar: "Homepage Preview" with 4:3 crop
  5. If no thumbnail set on publish attempt, show modal: "Choose a thumbnail for your project"
  6. Can change thumbnail anytime after publishing (edit mode)

- [ ] **Public Project Pages:**
  - URL format: `pixelports.com/@{username}/{project-slug}`
  - Renders all blocks in order (text, images, galleries)
  - Gallery blocks: Click arrows or images to cycle through full-size versions
  - Project metadata sidebar: title, category, tags, tools, external link
  - Designer info: avatar, name, bio snippet
  - Comment section (initially read-only, then interactive)
  - Share buttons (Twitter, LinkedIn, Copy Link)

---

### 3. Homepage & Discovery
**Design Philosophy:** Image-first portfolio showcase with optional community feedback

- [ ] **Hero Section:**
  - One highlighted "Featured Designer" card with strong cover image
  - Designer info: avatar, name, role
  - Project title + 1-2 sentence description
  - Tags displayed
  - Primary CTA: "View Full Project"
  - Visual: Large project image (constrained to ~24rem max-width)

- [ ] **Recent Work Section (Primary):**
  - **Main focus of the homepage**
  - Shows all projects (regardless of feedback status)
  - Grid layout: 1 column mobile → 2 columns tablet → 3 columns desktop
  - Category filters: All, UI/UX, Branding, Web, Mobile
  - Sorting: Most recent first by default
  - Each card shows:
    - Project thumbnail (4:3 aspect ratio)
    - Project title
    - 1-line summary (truncated)
    - Designer avatar + name
    - View count or simple engagement metric
    - Subtle "Seeking feedback" badge if applicable (on hover)

- [ ] **Projects Looking for Feedback Section (Secondary/Optional):**
  - **Separate section below Recent Work**
  - Shows only projects where `seeking_feedback = true`
  - Same grid layout as Recent Work
  - Limited to 6-9 projects visible
  - Category filters available: All, UI/UX, Branding, Web, Mobile
  - Each card shows:
    - Project thumbnail
    - Project title
    - 1-line summary
    - Designer avatar + name
    - Comment count (if any)
    - On hover: "Give Feedback" button overlay
  - If no projects seeking feedback: Hide entire section

- [ ] **Project Card Design:**
  - **Minimal visible metadata:**
    - Designer handle/name
    - Comment count (if applicable)
    - Optional "Seeking feedback" badge
  - **Hover state reveals:**
    - 1-line summary
    - "Give Feedback" CTA button (for feedback-seeking projects)
    - Subtle gradient overlay
  - **Visual standards:**
    - Crisp, attractive thumbnails
    - No text-heavy thumbnails
    - Proper image aspect ratios (4:3)
    - Clean borders, minimal shadows (flat design)

- [ ] **Empty States:**
  - New visitors: "Explore amazing design work from emerging designers"
  - Signed-in users without projects: "Upload your first project and get discovered"
  - Empty "Seeking Feedback" section: Hide section entirely (don't show empty state)

- [ ] **Other UI Elements:**
  - Sticky header with logo, navigation ("Discover", "Browse", "About"), and auth buttons
  - Stats section: Active Designers, Projects, Daily Uploads (can be hardcoded initially)
  - Footer with platform links, designer resources, support
  - CTA section: "Ready to showcase your work?" with signup button

---

### 4. Comment System (Optional Feature)
**Goal:** Quality community feedback when requested by project owner

- [ ] **3-Section Guided Comment Form:**
  - **Section 1:** "What's working well" (min 20 words, 12+ unique tokens)
  - **Section 2:** "What's unclear or could improve" (min 20 words, 12+ unique tokens)
  - **Section 3:** "One actionable suggestion" (min 20 words, 12+ unique tokens)
  - Live word count with visual indicator (green when minimum met)
  - Micro-copy below form: *"Be specific: decision → effect → suggestion. Aim for one actionable change."*

- [ ] **Server-Side Validation:**
  - Block copy-paste spam (detect repeated patterns across sections)
  - Reject if >40% of words repeat between sections
  - Cap URLs (≤1 per section) and emojis (≤3 per section)
  - Minimum unique tokens per section (≥12)
  - Return clear error messages

- [ ] **Comment Features:**
  - Available on ALL projects (not just those seeking feedback)
  - More prominent CTA on projects with `seeking_feedback = true`
  - Project owner can mark comments as "Helpful" (thumbs up button)
  - Badge appears: "Marked helpful by creator"
  - Comments display user avatar, name, timestamp
  - Threaded replies NOT in Phase 1 (keep simple)

- [ ] **Comment Display:**
  - Show all 3 sections with clear visual separation
  - Collapse long comments with "Read more" if needed
  - Sort by: Helpful first, then chronological

- [ ] **Post-Comment UX:**
  - After leaving comment, show success message
  - Offer to view another project (general browse, not feedback-specific)
  - Track engagement for internal metrics

---

### 5. Ranking & Discovery Logic
**Goal:** Surface great work, with optional feedback loop optimization

- [ ] **Homepage Default Sorting (Recent Work section):**
  1. Most recently uploaded (primary sort)
  2. Optional: Light boost for high-engagement projects (views, comments)
  3. Session-based: Don't show same projects repeatedly to same user

- [ ] **Projects Looking for Feedback Section Sorting:**
  1. Projects with "Seeking Feedback" AND "No comments yet" (top priority)
  2. Projects with "Seeking Feedback" and <3 comments
  3. Projects with recent comment activity
  4. Light boost for projects with ≥1 "helpful" mark

- [ ] **Internal Metrics Tracking:**
  - Total project views
  - Click-through rates by section
  - Optional: Projects seeking feedback that haven't received comments
  - Engagement patterns (which categories perform best)

---

### 6. Moderation System (Day 1 Essentials)
**Goal:** Prevent spam, maintain quality without heavy admin overhead

- [ ] **User-Facing Moderation:**
  - "Report comment" button on every comment
  - Tooltip: *"See something off? Report it — we'll take a look."*
  - Auto-hide after 3 unique user reports (pending admin review)
  - Report reasons: Spam, Harassment, Off-topic, Other

- [ ] **Admin Panel:**
  - View reported comments queue
  - One-click actions: Hide, Restore, Ban User
  - View reporter details and comment history
  - Audit log of all moderation actions

- [ ] **Anti-Spam Measures:**
  - Rate limiting:
    - 3 comments per hour per user
    - Max 8 comments per day per user
    - Per-IP burst control (10 actions per minute)
  - Simple profanity filter (keyword blocklist)
  - Shadowban capability for repeat offenders
  - New accounts (<24h old) limited to 2 comments per day

- [ ] **Audit Logging:**
  - Track all moderation actions with timestamp, admin ID, reason
  - User ban history
  - Comment edit/deletion log

---

### 7. Analytics & Metrics
**Goal:** Track core engagement, identify issues early

- [ ] **Event Tracking (Day 1):**
  ```
  - signed_up
  - profile_completed
  - profile_skipped
  - project_created
  - project_viewed
  - comment_created
  - comment_marked_helpful
  - comment_reported
  - project_clicked (from homepage grid)
  ```

- [ ] **Key Metrics Dashboard (Internal):**
  - **Activation:**
    - % of signups who complete profile (target: 70%+)
    - % of signups who upload ≥1 project within D7 (target: 40%+)
    - % of signups who view ≥5 projects within D7 (target: 60%+)
  - **Discovery & Browsing (Primary Focus):**
    - Project views per day
    - Click-through rate from homepage to project pages (target: 20%+)
    - % of users who browse ≥3 projects after landing (target: 60%+)
    - Time on homepage (target: 90+ seconds)
    - Category distribution (which types of work get most views)
  - **Feedback Loop Health (Secondary):**
    - % of projects with `seeking_feedback = true` (track adoption)
    - % of feedback-seeking projects with ≥1 comment within 48h (target: 60%+)
    - % of projects with ≥1 "helpful" comment (target: 30%+)
    - Comments per project distribution
  - **Engagement:**
    - Click-through rate from homepage to project pages (target: 20%+)
    - % of users who browse ≥3 projects after landing (target: 60%+)
    - Time on homepage (target: 90+ seconds)
    - Return visitor rate
  - **Community Feedback (Optional Feature):**
    - % of users who leave ≥1 comment within D7 (target: 20%+)
    - Comments marked helpful rate (target: 30%+)
  - **Quality:**
    - % of comments passing validation first try (target: 80%+)
    - % of comments reported (target: <5%)
    - % of comments requiring moderation (target: <2%)
  - **Retention:**
    - D7 return rate (target: 40%+)
    - D30 return rate (target: 25%+)
    - Commenter retention: after 1 comment, % who leave ≥2 total (target: 50%+)

- [ ] **Simple Founder Dashboard:**
  - Daily signups, projects uploaded, project views
  - Category distribution (which design types most popular)
  - Top viewed projects this week
  - Optional feedback metrics: comments left, helpful marks
  - Flagged content queue (reports, auto-hidden items)
  - Recent activity feed

---

### 8. Legal & Trust
**Goal:** Clear expectations, build trust from day one

- [ ] **Required Pages:**
  - **Community Guidelines:**
    - Be constructive and respectful
    - Give specific, actionable feedback
    - No self-promotion in comments
    - No harassment, hate speech, or spam
    - Link from comment composer
  - **Terms of Service:**
    - User responsibilities
    - Content ownership (users retain rights)
    - Platform usage rules
  - **Privacy Policy:**
    - Explicit note: "Portfolios and reviews are public and shareable"
    - Data collection practices
    - Cookie usage
    - Right to deletion
  - **Moderation Policy:**
    - How reports are handled
    - Ban/suspension criteria
    - Appeal process

- [ ] **Trust Signals:**
  - Verified project owner badge
  - "Member since" date on profiles
  - Helpful comment count on user profiles

---

## Features REMOVED from Phase 1
*(Will revisit in future phases based on usage data)*

- ❌ **Likes/hearts** (compete with feedback, delay to Phase 3+)
- ❌ **Follow system** (adds complexity, not core to feedback loop)
- ❌ **Direct messaging** (can be abused, not needed initially)
- ❌ **Advanced filtering** (tags are enough for MVP)
- ❌ **Custom domains** (too complex, delay to Phase 3)
- ❌ **Advanced analytics dashboard for users** (simple views only)
- ❌ **Full case study templates** (keep image-first, text is optional)
- ❌ **Project collections/folders** (organization can come later)
- ❌ **Threaded comment replies** (keep simple, direct feedback only)
- ❌ **Social login beyond Google** (LinkedIn, GitHub later)

---

## Seeding Strategy
**Goal:** Set visual quality bar high, demonstrate feedback loop

- [ ] **Pre-Launch Content:**
  - Recruit 8-12 designers to upload 3-5 projects each (30-50 total projects)
  - Focus on visual diversity: UI, branding, web, mobile, illustration
  - Hand-pick projects with strong cover images
  - Mix of polished portfolio pieces (not all feedback-seeking)
  - Ensure mix of established + emerging designers

- [ ] **Optional Power Commenters:**
  - Enlist 2-3 experienced designers to be "founding commenters" (if there's interest)
  - Ask each to leave 5-10 quality comments in first week on feedback-seeking projects
  - Model the 3-section feedback format
  - Mark some as "helpful" to demonstrate feature

- [ ] **Featured Designer Rotation:**
  - Manually curate 1 featured project per week initially
  - Rotate through different categories
  - Highlight diverse design disciplines
  - Use as quality signal to community

---

## Success Metrics (Week 4 Targets)

### Primary (Must-Hit):
- ✅ **200+ designers signed up**
- ✅ **50+ projects uploaded**
- ✅ **60%+ of users view ≥3 projects** (core engagement)
- ✅ **40%+ activation rate** (upload ≥1 project OR complete profile within D7)

### Secondary (Nice-to-Have):
- ⭐ **20%+ adoption of "seeking feedback" toggle** (validates optional feature)
- ⭐ **50+ comments left across platform** (community engagement)
- ⭐ **30%+ of feedback-seeking projects get ≥1 comment within 48h**
- ⭐ **80%+ of comments pass validation on first try**
- ⭐ **<5% comment report rate**
- ⭐ **40%+ D7 return rate**

### Quality Indicators:
- 📊 Average 50+ views per project (healthy discovery)
- 📊 20%+ click-through from homepage to projects
- 📊 5-10 users identified as "active community members" (regular commenters)
- 📊 Diverse category representation (not dominated by one type)

---

## Technical Stack Decisions

### Frontend:
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS (flat, minimal aesthetic)
- Lucide React (icons)

### Backend:
- Supabase (Auth, Database, Storage, Real-time)
- PostgreSQL (via Supabase)
- Row Level Security (RLS) policies

### Image Processing:
- Sharp (server-side resizing, format conversion)
- EXIF stripping library

### Analytics:
- PostHog or Plausible (privacy-friendly)
- Custom event tracking

### Deployment:
- Vercel (Next.js hosting)
- Supabase Cloud (backend services)

---

## Development Timeline

### Week 1: Foundation
- Auth system + user model
- Database schema setup
- Basic UI components (Avatar, Header, Footer)
- Profile completion flow

### Week 2: Core Features
- Project upload system (block-based builder)
- Homepage with project grids
- Project detail pages
- Basic filtering

### Week 3: Feedback Loop (Optional Feature)
- Comment system (3-section form)
- Validation logic
- "Mark as helpful" feature
- "Seeking feedback" section on homepage

### Week 4: Polish & Launch Prep
- Moderation tools
- Analytics integration
- Legal pages
- Seeding content
- Testing & bug fixes

---

## Post-Launch Priorities (Phase 2)

### Based on User Feedback:
- Edit/delete own comments
- Edit/delete own projects
- Email notifications (new comments on your projects)
- Enhanced profile pages
- User search
- Tag-based filtering

### Based on Growth:
- Expanded moderation tools
- Advanced sorting options
- Mobile app considerations
- API for integrations

---

## Design Principles

### Visual:
- **Image-first:** Strong thumbnails are the hero, portfolio showcase
- **Flat & minimal:** Clean borders, subtle shadows only
- **Purple/indigo brand:** Gradient accents, consistent color usage
- **Breathing room:** Generous whitespace, clear hierarchy

### Interaction:
- **Discovery over engagement tricks:** Focus on helping users find great work
- **Reduce friction:** Optional fields, skip options, defaults set intelligently
- **Community as optional layer:** Feedback is a feature, not the core experience
- **Quality enforcement:** When feedback is given, enforce quality with validation

### Copy:
- **Portfolio-first messaging:** "Showcase your work" not "Get feedback"
- **Positive framing:** "What's working well" not "What's wrong" (when feedback is given)
- **Clear, simple CTAs:** "View Project", "Upload Work", optionally "Give Feedback"
- **Encouraging tone:** Support emerging designers, celebrate their work

---

## Open Questions / Future Considerations

1. **Monetization path?** (Not Phase 1, but keep in mind)
  - Premium profiles with custom domains?
  - Portfolio hosting upgrades?
  - Featured placement options?

2. **Community growth?**
  - When does feedback become more central?
  - How to encourage high-quality community engagement?
  - Reputation system for trusted commenters?

3. **International users?**
  - Multi-language support timeline?
  - Global design communities?

4. **Competition response?**
  - What makes PixelPorts different from Dribbble/Behance?
  - Focus on emerging designers as unique positioning?
  - Clean, ad-free experience as differentiator?

---

**Last Updated:** October 17, 2025  
**Version:** 2.1 (Block-based projects - thumbnails designated from project images, no separate cover upload)