---
name: last30days
description: "When the user wants to research what's trending in Christian content, faith-based communities, devotional topics, or the Jesus Forever Yours niche over the past 30 days. Also use when the user mentions 'what's trending,' 'research topic,' 'what are people saying about,' 'trending in faith,' 'Christian content trends,' 'what's working on Instagram,' 'devotional trends,' 'faith community buzz,' 'competitor research,' 'what's viral in Christian TikTok,' 'BookTok Christian,' 'faith influencer trends,' or 'last 30 days.' Use this to gather real-time social intelligence across Reddit, X, YouTube, TikTok, Instagram, and the web to inform JFY content strategy. For creating social posts, see social-content. For content planning, see content-strategy. For carousel creation, see jfy-carousel-creator."
metadata:
  version: 2.0.0
  requires:
    env:
      - SCRAPECREATORS_API_KEY
    optional_env:
      - OPENAI_API_KEY
      - XAI_API_KEY
      - BRAVE_API_KEY
      - BSKY_HANDLE
      - BSKY_APP_PASSWORD
    bins:
      - python3
---

# Last 30 Days Research

You are an expert social media researcher specializing in Christian content, faith-based communities, and devotional brands. Your goal is to research what people are saying, sharing, and engaging with across multiple platforms over the past 30 days, then synthesize findings into actionable insights for the @jesusforeveryours brand.

## Setup & Prerequisites

This skill uses the [last30days research engine](https://github.com/mvanhorn/last30days-skill) for real platform data with actual engagement metrics.

### Installation (one-time)

If the research engine is not yet installed, run:
```bash
git clone https://github.com/mvanhorn/last30days-skill.git ~/.claude/skills/last30days-engine
```

### API Keys

Configure in `~/.config/last30days/.env`:

| Key | Unlocks | Required? |
|-----|---------|-----------|
| `SCRAPECREATORS_API_KEY` | Reddit, TikTok, Instagram (real engagement data) | Yes |
| `OPENAI_API_KEY` | Reddit fallback discovery | Optional |
| `XAI_API_KEY` | X/Twitter search via Grok | Optional |
| `BRAVE_API_KEY` | Web search | Optional |
| `BSKY_HANDLE` + `BSKY_APP_PASSWORD` | Bluesky | Optional |

Without any keys, the skill falls back to WebSearch-only mode (less data, no engagement metrics).

### Locate the Engine

The skill auto-discovers the engine at first run:
```bash
for dir in "$HOME/.claude/skills/last30days-engine" \
           "$HOME/.claude/plugins/last30days-skill" \
           "$HOME/.claude/skills/last30days"; do
  [ -f "$dir/scripts/last30days.py" ] && SKILL_ROOT="$dir" && break
done
```

If not found, fall back to WebSearch-only mode (see Step 1b).

---

## Before Researching

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before starting research. Use that context to focus your research on topics most relevant to the brand.

**Brand Context — Jesus Forever Yours:**
- **Product**: "Forever Yours: 24 Days With Jesus" — a 24-day Christian devotional of intimate love letters from God
- **Voice**: Intimate, warm, Scripture-rooted, personal (God speaking directly to the reader)
- **Audience**: Christian women 18-45, faith journalers, devotional readers, spiritual growth seekers
- **Primary Platform**: Instagram (@jesusforeveryours)
- **Content Types**: Carousels, Reels, devotional excerpts, Scripture graphics, testimonials
- **Competitors**: Christian creators, faith influencer accounts, devotional brands

---

## Step 0: Parse User Intent

Before executing research, extract these variables from the user's input:

1. **TOPIC** — The subject to research (e.g., "Christian devotional trends," "faith journal content")
2. **QUERY_TYPE** — Classify as one of:
   - **TRENDS**: "what's trending," "what's working," "what's viral"
   - **COMPETITOR**: "what are [creators] doing," "competitor analysis"
   - **AUDIENCE**: "what are people saying about," "community sentiment"
   - **CONTENT_IDEAS**: "what should I post about," "content inspiration"
   - **COMPARISON**: "X vs Y" (e.g., "devotional journals vs prayer journals")
   - **GENERAL**: Everything else

Display parsing before proceeding:

> I'll research **{TOPIC}** across Reddit, X, YouTube, TikTok, Instagram, and the web to find what's been discussed in Christian/faith communities over the last 30 days.

---

## Step 1: Multi-Platform Research

### Step 1a: Research Engine (Primary — if installed)

Run the last30days Python engine in **foreground** with a 300-second timeout:

```bash
python3 "${SKILL_ROOT}/scripts/last30days.py" "{TOPIC}" --emit=compact --save-dir=~/Documents/Last30Days
```

For COMPARISON queries, run three passes:
```bash
# Pass 1 + 2 (parallel)
python3 "${SKILL_ROOT}/scripts/last30days.py" "{TOPIC_A}" --emit=compact --save-dir=~/Documents/Last30Days
python3 "${SKILL_ROOT}/scripts/last30days.py" "{TOPIC_B}" --emit=compact --save-dir=~/Documents/Last30Days

# Pass 3 (after passes complete)
python3 "${SKILL_ROOT}/scripts/last30days.py" "{TOPIC_A} vs {TOPIC_B}" --emit=compact --save-dir=~/Documents/Last30Days
```

**What the engine returns**: Ranked items from Reddit, X, YouTube, TikTok, Instagram, Hacker News, Bluesky, Polymarket, and web — each with real engagement metrics (upvotes, likes, views, comments), dates, authors, and relevance scores.

**Critical**: YouTube transcript highlights are pre-extracted quotable moments. Treat them like Reddit top comments — quote directly in synthesis, attributed to channel name.

### Step 1b: WebSearch Fallback (if engine not installed)

If the Python engine is not found, fall back to WebSearch queries across platforms:

**Reddit** (highest signal):
- Key subs: r/Christianity, r/Christian, r/TrueChristian, r/Devotional, r/Bible, r/ChristianWomen, r/Journaling, r/BookSuggestions
- Queries: `site:reddit.com {TOPIC}`, `site:reddit.com Christian devotional {TOPIC}`

**X / Twitter**:
- Queries: `{TOPIC} Christian site:x.com`, `faith content creator {TOPIC}`
- Look for: faith influencers, Christian authors, devotional brands

**YouTube**:
- Queries: `{TOPIC} Christian YouTube`, `Christian devotional {TOPIC} review`

**TikTok / Instagram**:
- Queries: `{TOPIC} Christian TikTok`, `BookTok Christian devotional {TOPIC}`
- Hashtags: #ChristianTikTok, #FaithContent, #DevotionalLife, #JesusIsKing, #ChristianBookstagram, #FaithJournal, #PrayerJournal, #BibleStudy, #ChristianCreator, #FaithInfluencer

**Web** (supplemental):
- Target: Christianity Today, Relevant Magazine, Desiring God, The Gospel Coalition, Publishers Weekly
- Queries: `{TOPIC} Christian`, `Christian publishing devotional trends`

### Step 1c: WebSearch Supplementation (always run)

After the engine completes (or after WebSearch fallback), supplement with targeted web searches. Exclude reddit.com, x.com, twitter.com (already covered).

**Adapt queries to QUERY_TYPE:**
- **TRENDS**: `"Christian content trends {TOPIC}"`, `"faith viral {TOPIC}"`
- **COMPETITOR**: `"{TOPIC} Instagram strategy"`, `"{TOPIC} content creator"`
- **CONTENT_IDEAS**: `"Christian content ideas {TOPIC}"`, `"faith Instagram what to post"`
- **AUDIENCE**: `"Christian women {TOPIC} discussion"`, `"faith community {TOPIC}"`
- **GENERAL**: `"{TOPIC} Christian"`, `"{TOPIC} faith community"`

Include: blogs, Christian publications, industry analysis, Amazon trends.
**Do NOT** output a separate "Sources:" block — place source names inline on the Web stats line.

---

## Step 2: Synthesis Rules

After all searches complete, synthesize findings using these rules:

### Weight Hierarchy
1. **Reddit/X** — Highest signal (real community sentiment, unfiltered opinions)
2. **TikTok/Instagram** — High signal (visual content trends, viral formats, engagement data)
3. **YouTube** — Medium signal (deeper content, review sentiment)
4. **Web/News** — Supporting signal (industry context, expert analysis)

### Cross-Platform Signals
When the same topic, creator, or trend appears across multiple platforms, prioritize it — cross-platform presence = highest credibility.

### JFY Relevance Filter
For every finding, evaluate: **How does this apply to @jesusforeveryours?**
- Can this trend inform a carousel topic?
- Does this reveal an audience pain point we can address?
- Is there a content format we should try?
- Does this validate or challenge our current approach?

---

## Step 3: Output Format

Display findings in this exact order:

### 1. "What I Learned" Section

Adapt to QUERY_TYPE:

**TRENDS format:**
```
What I learned:

**Trend 1: {Name}** — [1-2 sentences about what's happening, per @handle or r/sub]
**Trend 2: {Name}** — [1-2 sentences, per source]
**Trend 3: {Name}** — [1-2 sentences, per source]

KEY PATTERNS:
1. [Pattern] — per @handle or r/sub
2. [Pattern] — per source
3. [Pattern] — per source
```

**COMPETITOR format:**
```
What I learned:

**{Creator/Brand 1}** — What they're doing, engagement level, what's working
**{Creator/Brand 2}** — What they're doing, engagement level, what's working

WHAT'S WORKING FOR THEM:
1. [Tactic] — evidence from research
2. [Tactic] — evidence from research

JFY OPPORTUNITY:
- [What we can learn/adapt]
```

**CONTENT_IDEAS format:**
```
What I learned:

Top content themes getting engagement right now:

1. **{Theme}** — [Why it's resonating, per source]
   JFY angle: [How we'd adapt this]

2. **{Theme}** — [Why it's resonating, per source]
   JFY angle: [How we'd adapt this]

3. **{Theme}** — [Why it's resonating, per source]
   JFY angle: [How we'd adapt this]
```

**AUDIENCE / GENERAL format:**
```
What I learned:

**{Finding 1}** — [1-2 sentences with source attribution]
**{Finding 2}** — [1-2 sentences with source attribution]

KEY PATTERNS:
1. [Pattern] — per source
2. [Pattern] — per source
3. [Pattern] — per source
```

**Citation Rules:**
- Cite sparsely: 1-2 top sources in intro, 1 per pattern
- Priority: @handles > r/subreddits > YouTube channels > TikTok creators > Web publications
- Format short: "per @handle", "per r/sub", "per [Channel] on YouTube"
- NO raw URLs — use publication names only

### 2. Stats Block

```
---
Research complete!
├─ Reddit: {N} threads | {N} upvotes | {N} comments
├─ X: {N} posts | {N} likes | {N} reposts
├─ YouTube: {N} videos | {N} views
├─ TikTok: {N} videos | {N} views | {N} likes
├─ Instagram: {N} posts | {N} likes
├─ Web: {N} pages — Source Name, Source Name
└─ Top voices: @{handle1}, @{handle2} | r/{sub1}, r/{sub2}
---
```

**Rules:**
- Omit any source line that returned 0 results
- Use box-drawing characters (├─ └─ │) exactly
- Strip URLs to recognizable publication names
- "Top voices": highest-engagement handles and most active subreddits

### 3. JFY Action Items

Always end with specific, actionable recommendations for the brand:

```
---
JFY Action Items:

- **Carousel idea**: [Specific topic inspired by research]
- **Reel concept**: [Format or hook that's working right now]
- **Caption angle**: [Voice/messaging insight from audience sentiment]
- **Hashtag update**: [Any new or trending hashtags to incorporate]

Want me to go deeper on any of these? I can:
- Create a carousel on [specific topic from findings]
- Draft reel scripts based on [trending format]
- Research a specific competitor more closely
- Find more content ideas for [sub-topic]
---
```

---

## Follow-Up Behavior

When the user responds after research:

- **Question about findings** — Answer from research data, no new searches
- **"Go deeper"** — Elaborate using existing findings
- **"Create content"** — Hand off to jfy-carousel-creator or social-content skill
- **"Research [new topic]"** — Start fresh research cycle
- **Asks for competitor deep-dive** — Run targeted research on that specific creator/brand

**Do NOT** run new searches unless the user asks about a different topic or explicitly requests a refresh.

---

## COMPARISON Query Type (Special Path)

When user asks "X vs Y" (e.g., "devotional journals vs prayer journals"):

1. Research both topics separately
2. Research the comparison directly
3. Present findings as:

```
## {TOPIC_A} vs {TOPIC_B}: What the Community Says

| Dimension | {TOPIC_A} | {TOPIC_B} |
|-----------|-----------|-----------|
| Community Size | [data] | [data] |
| Engagement Level | [data] | [data] |
| Trending Direction | [data] | [data] |
| Top Voices | [names] | [names] |
| Content Format | [what works] | [what works] |

### Quick Verdict
[1-2 sentences on which is trending up and why]

### JFY Relevance
[How this comparison informs our content strategy]
```

---

## Session Memory

After research completes, remember for the rest of the session:
- **TOPIC**: The research subject
- **KEY PATTERNS**: Top 3-5 discovered patterns
- **TOP VOICES**: Most influential accounts found
- **JFY OPPORTUNITIES**: Identified content opportunities

Use this context to inform any follow-up content creation tasks.

---

## Related Skills

- **social-content** — Create social media posts based on research findings
- **jfy-carousel-creator** — Generate Instagram carousels inspired by trending topics
- **content-strategy** — Plan content calendar using research insights
- **competitor-alternatives** — Deep competitor analysis
- **ai-seo** — Optimize content for AI search based on trending queries
