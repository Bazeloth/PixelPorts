PixelPorts MVP: Portfolio platform for emerging designers
Tech stack

    Frontend: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
    Backend: Supabase (PostgreSQL database, Auth, Storage)
    Image hosting: Supabase Storage
    Deployment: Vercel
    Development tools: Junie + Claude for AI-assisted coding

Database schema
Core tables

userprofiles

    Links to Supabase Auth users
    Profile data: username, bio, location, avatar, etc.
    Follower count tracking

shots

    Main shot entity with title, description, category
    Links to creator (userprofiles)
    Timestamp for recency scoring
    Engagement metrics (view count, like count, comment count)

shot_blocks

    Flexible content blocks for each shot
    Block types: image, gallery, text_heading, text_paragraph
    Order/position for sequencing

shot_uploads + shot_carousel_uploads

    Image file management
    Multiple images per shot support

collections + collection_shots

    Curated collections of shots by users
    Many-to-many relationship

follows

    User following relationships
    For Following feed and follower counts

likes

    Shot likes for engagement scoring
    Track who liked what

comments

    Shot comments for engagement + community

views

    View tracking for analytics
    Powers discovery algorithm engagement rate calculation

User authentication and authorization

    Supabase Auth with multiple providers
    OAuth: Google, LinkedIn (fastest onboarding)
    Email + password signup
    Session management via Supabase
    Row Level Security (RLS) policies for data access control

Core user flows
New user onboarding

    Signup via Google, LinkedIn, or email/password
    Auto-redirect to profile completion (/complete-profile)
        Required fields: Full name, username
        Optional: Avatar (pre-filled from OAuth), bio, location
        No skip option - must complete to proceed
        Topbar shows: Logo + Sign out only
    After profile save, auto-redirect to upload form
        Encouraging message: "Share your first design with the community"
        User can close/skip if they want to browse first
    First upload celebration
        Show success message with view count tracking
        Redirect to their shot or homepage

Navigation states

Not logged in: Logo + Sign in + Join the Beta

Incomplete profile: Logo + Sign out (enforced via middleware)

Logged in: Logo + Upload + Profile/Avatar dropdown (contains Sign out)
Middleware protection

    Check auth state + profile completion on every page load
    If authenticated but missing username → redirect to /complete-profile
    Profile completion page is only accessible route in incomplete state

Feed system and discovery algorithm
Discovery score calculation

Scheduled task (hourly via pg_cron):

Calculates and stores component scores in shots table:

    engagement_rate = (likes + comments × 2) / views
    content_quality_score = composite based on:
        Upload depth (number of blocks, case study vs quick shot)
        Description length
        Image resolution/quality
        Profile completeness
        Normalized to 0-1 scale
    audience_diversity_score = social clustering coefficient
        Measures if likers all follow each other (niche bubble = 0.6) vs diverse audience (low overlap = 1.3)
        Prevents echo chamber gaming
    follower_handicap_multiplier = smooth curve based on creator's follower count
        <100 followers: 4.0-3.0x boost (gradual decline)
        100-500 followers: 3.0-2.0x boost
        500-2000 followers: 2.0-1.5x boost
        2000+ followers: 1.5-1.0x boost
        Success-based safety net: if engagement rate stays low, keep boosting
    discovery_score = engagement_rate × audience_diversity × content_quality × follower_handicap
    last_score_update = timestamp

Recency applied at query time:

    Multiply discovery_score by time decay factor
    Recent shots get boost without needing constant recalculation

Purpose of storing scores:

    User analytics (Pro tier): show designers why their work performs well/poorly
    Platform insights: debug algorithm, track trends, A/B test changes
    Efficient querying: pre-calculated scores = fast feed loads

Feed types and queries

Feeds (horizontal tabs with subtext):

    Discover - "Algorithmic feed that boosts emerging designers"
        Query: Order by discovery_score (with recency decay applied)
        Follower handicap applied

    Recent - "Latest work from the community"
        Query: Order by created_at DESC
        Chronological, no algorithm

    New designers - "Fresh work from designers new to the platform"
        Query: Shots from userprofiles where created_at < 30 days ago
        Order by created_at DESC

    Following - "Work from designers you follow"
        Query: Shots from followed userprofiles
        Order by created_at DESC

Categories (filter pills below feeds):

    All | Product Design | Web Design | Branding | Illustration
    Single category per shot (required on upload)
    Applies to all feeds
    "All" shows everything

Shot grid:

    Responsive masonry/grid layout
    Cover image + title + designer info
    Same layout across all feeds

Upload flow and shot structure
Upload form interface

Progressive disclosure approach:

    Start with essentials: Cover image, title, description, category (required)
    "Add content blocks" section below with block type options
    Designers can create quick shots (30 sec) or detailed case studies (15-30 min)

Block types available:

    Image block - Single image with optional caption
    Gallery block - 2-4 images in a grid
    Text heading - Section heading for organization
    Text paragraph - Body text for context/explanation

Per-block image uploads:

    Each image/gallery block has its own upload interface
    No shared image library (keep it simple for MVP)
    No block type conversion (delete and recreate if needed)

Block management:

    Add blocks in sequence (stacked vertically)
    Reorder via drag handles
    Delete individual blocks
    0-10 blocks per shot (flexible depth)

Upload speeds supported

Quick shot (30 seconds):

    Cover image + title + category
    Optional description
    No additional blocks

Shot with process (3-5 minutes):

    Cover + title + category + description
    Add 2-4 gallery blocks showing iterations

Mini case study (15-30 minutes):

    Full structure with headings and text
    Problem → solution → impact narrative
    Multiple image and gallery blocks

Shot detail page

Desktop layout:

    Left column (70%): Shot content (cover + all blocks displayed in sequence)
    Right sidebar (30%):
        Designer card (avatar, name, follow button, bio)
        Category tag
        Like/comment counts and actions
        Related shots (2-3 thumbnails)
        Gray separators between sections
    Below content (full width): Comments section

Mobile layout:

    Stack all elements vertically
    Shot content → Designer card → Actions → Related shots → Comments

Comments:

    Flat structure (no nested replies)
    Chronological order
    @ mentions allowed as plain text (no tagging/linking for MVP)
    Like button per comment (optional)

Edit functionality:

    "Edit" button visible only to shot creator
    Links to /shots/[id]/edit (separate edit interface)
    Allows editing all shot content (images, blocks, text, category)

File upload constraints:

    Images: JPG, PNG, WebP, GIF (max 10MB per image)
    Avatars: JPG, PNG, WebP only (no GIF)
    Total per shot: 50MB limit
    Show upload progress indicator for large files

Profile pages and user interactions

Profile page structure:

    Bio, location, external portfolio links
    Grid of uploaded shots (responsive: 4-5 columns desktop, 1-2 mobile)
    Tabs: Shots | Liked shots
    Follower/Following counts with clickable lists
    No public profile view counts or engagement stats

Shot grid pagination:

    Load 20-30 shots initially
    "Load more" button at bottom to fetch next batch
    Applies to all feeds and profile grids
    Loading indicator during fetch

Social interactions:

    Follow designers to see their work in Following feed
    Like shots (public, visible in Liked shots tab)
    Comment on shots (flat structure, chronological)
    All interactions require login

Public vs gated:

    Anyone can browse shots, feeds, profiles (no login required)
    Login required only for interactions (like, comment, follow, upload)

Homepage structure

Not logged in:

    Hero section with value prop and CTA
    Grid of recent shots (12-16 from Discover feed)
    How it works / Features section
    Secondary CTA to join

Logged in (0 uploads):

    Upload prompt card: "Share your first design with the community"
    Feeds below (default to Discover tab)

Logged in (has uploads):

    Just feeds (default to Discover tab)
    Clean, content-first

Pages needed:

    Homepage (feeds)
    /shots/[id] - Shot detail
    /shots/[id]/edit - Edit shot
    /upload - Upload form
    /[username] - Profile page
    /settings - Account settings
    Auth pages (login, signup, complete-profile)

User onboarding flow

New user flow:

    Signup via Google, LinkedIn, or email/password
    Auto-redirect to profile completion (/complete-profile)
        Required fields: Full name, username
        Optional: Avatar (pre-filled from OAuth), bio, location, external portfolio links (2-3 max)
        No skip option - must complete to proceed
        Topbar shows: Logo + Sign out only
    After profile save, auto-redirect to upload form
        Encouraging message: "Share your first design with the community"
        User can close/skip if they want to browse first
    First upload celebration
        Show success message with view count tracking
        Redirect to their shot or homepage

Navigation states:

Not logged in: Logo + Sign in + Join the Beta

Incomplete profile: Logo + Sign out (enforced via middleware)

Logged in: Logo + Upload + Profile/Avatar dropdown (contains Sign out)

Middleware protection:

    Check auth state + profile completion on every page load
    If authenticated but missing username → redirect to /complete-profile
    Profile completion page is only accessible route in incomplete state

Settings and email notifications

Settings page sections:

Account:

    Email address (show only, can't change for OAuth users)
    Password change (only shown for email/password signups)
    OAuth badge: "Connected via Google/LinkedIn" (for OAuth users)
    Delete account (hard delete with confirmation)

Profile:

    "Edit profile" button → /settings/profile
    Editable: name, username, bio, location, portfolio links, avatar

Account deletion:

    Hard delete (removes user and all content permanently)
    Confirmation required: type username to confirm
    Warning: "This will permanently delete your account and all your shots"

Email notifications:

MVP: Transactional only

    Email verification (signup)
    Password reset

Future consideration (add based on user feedback):

    Weekly digest (views, engagement, new designers)
    New follower notification
    Likes/comments on shots
    Shot trending notification

Moderation (Reactive Only)

Automated flags:

    Duplicate uploads (image hash)
    External links in first 3 posts
    Reported 3+ times → auto-hide

Manual review: 30-60 min/week

    Review flagged content
    Handle reports (stolen work, inappropriate)
    Ban spam accounts

No proactive curation. You're a platform maintainer, not a content curator. Spend time building product, not reviewing uploads.