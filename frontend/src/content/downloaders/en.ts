import type { DownloaderContent } from "./types";

export const EN_DOWNLOADERS: DownloaderContent[] = [
  {
    id: "reel",
    slug: "instagram-reels-downloader",
    lockedType: "reel",
    inputMode: "url",
    metaTitle: "Instagram Reels Downloader — Save Reels in HD | JazzGhost",
    metaDescription:
      "Download Instagram Reels in HD for free. Paste a Reel link, preview, and save MP4 without watermark or sign-up. Fast Instagram Reels downloader by JazzGhost.",
    h1: "Instagram Reels Downloader",
    subtitle:
      "Paste any public Reel link and save the video in HD. No watermark, no account — just preview and download.",
    placeholder: "https://www.instagram.com/reel/…",
    ctaLabel: "Fetch Reel",
    howToTitle: "How to Download Instagram Reels",
    steps: [
      {
        order: 1,
        title: "Copy the Reel link",
        description:
          "Open Instagram, open the Reel, tap Share → Copy Link. You need a public /reel/ or /reels/ URL.",
        imageAlt: "Copy Instagram Reel link from the share menu",
      },
      {
        order: 2,
        title: "Paste it here",
        description:
          "Paste the link into the box above and tap Fetch Reel. JazzGhost loads a preview so you confirm the right video.",
        imageAlt: "Paste Reel URL into JazzGhost downloader",
      },
      {
        order: 3,
        title: "Download the MP4",
        description:
          "Tap Download to save the Reel to your device in high quality. Works on phone, tablet, and desktop.",
        imageAlt: "Download Instagram Reel MP4 file",
      },
    ],
    aboutTitle: "Free Instagram Reels downloader built for speed",
    aboutBody: [
      "JazzGhost’s Instagram Reels Downloader is made for creators, editors, and anyone who needs a clean Reel file without installing an app. Paste a public Reel URL and get an HD MP4 you can keep offline.",
      "Unlike generic “any Instagram link” tools, this page is focused only on Reels — clearer instructions, Reels-specific validation, and SEO content that matches how people actually search for Reel downloads.",
      "We never ask you to sign in with Instagram. Public Reels are fetched through our secure backend; your browsing stays private on your device.",
    ],
    featuresTitle: "Why download Reels with JazzGhost",
    features: [
      {
        title: "HD quality",
        description: "We pull the best available video stream so your saved Reel stays sharp for editing or archiving.",
      },
      {
        title: "Preview first",
        description: "See the thumbnail and title before downloading so you never save the wrong clip.",
      },
      {
        title: "No watermark",
        description: "The file comes from Instagram’s media CDN — JazzGhost does not stamp overlays on your download.",
      },
      {
        title: "Works everywhere",
        description: "Browser-based tool for iOS, Android, Windows, and Mac — no extension required.",
      },
    ],
    faqTitle: "Reels downloader FAQ",
    faqs: [
      {
        question: "Can I download private Reels?",
        answer:
          "No. Only public Reels can be downloaded. Private accounts and restricted media are not accessible.",
      },
      {
        question: "Does JazzGhost add a watermark?",
        answer: "No. Downloads are the original media stream without JazzGhost branding on the video.",
      },
      {
        question: "What link formats work?",
        answer:
          "Links containing /reel/ or /reels/ work. If you paste a /p/ post link, use the Post or Carousel downloader instead.",
      },
      {
        question: "Is it free?",
        answer: "Yes. The Instagram Reels Downloader on JazzGhost is free to use with fair-use rate limits.",
      },
    ],
    keywords: [
      "instagram reels downloader",
      "download instagram reels",
      "save reels hd",
      "reels mp4 download",
      "jazzghost reels",
    ],
  },
  {
    id: "post",
    slug: "instagram-post-downloader",
    lockedType: "post",
    inputMode: "url",
    metaTitle: "Instagram Post Downloader — Save Photos & Videos | JazzGhost",
    metaDescription:
      "Download Instagram posts (photos and videos) in original quality. Paste a /p/ link, preview, and save instantly with JazzGhost’s Post Downloader.",
    h1: "Instagram Post Downloader",
    subtitle:
      "Save single Instagram posts — photos or videos — from any public /p/ link. Preview first, then download.",
    placeholder: "https://www.instagram.com/p/…",
    ctaLabel: "Fetch Post",
    howToTitle: "How to Download Instagram Posts",
    steps: [
      {
        order: 1,
        title: "Copy the post URL",
        description:
          "On Instagram, open the post and copy its link. It should look like instagram.com/p/SHORTCODE/.",
        imageAlt: "Copy Instagram post link",
      },
      {
        order: 2,
        title: "Paste and preview",
        description:
          "Paste the URL above and fetch a preview. Confirm the thumbnail matches the post you want.",
        imageAlt: "Preview Instagram post before download",
      },
      {
        order: 3,
        title: "Save the file",
        description:
          "Download the image or video to your device. For multi-slide albums, use the Carousel Downloader.",
        imageAlt: "Save Instagram post media file",
      },
    ],
    aboutTitle: "Download Instagram posts without the app",
    aboutBody: [
      "The Instagram Post Downloader on JazzGhost targets single /p/ posts — the everyday photos and videos people share in the feed. It is ideal when you need one clear file, not a whole album.",
      "If the post is a carousel (multiple slides), switch to our Carousel Downloader so every slide is packed correctly. This page keeps messaging and validation focused on single posts.",
      "Use it for mood boards, references, archives, or offline viewing — always respecting creators’ rights and Instagram’s terms for personal use.",
    ],
    featuresTitle: "Post downloader highlights",
    features: [
      {
        title: "Photo & video posts",
        description: "Handles both still images and single-video posts from public profiles.",
      },
      {
        title: "Original-quality save",
        description: "We request the highest available candidate so your download stays crisp.",
      },
      {
        title: "Fast preview",
        description: "Metadata loads quickly so you can verify the post before using a download slot.",
      },
      {
        title: "No install",
        description: "Runs in the browser — paste, preview, download.",
      },
    ],
    faqTitle: "Post downloader FAQ",
    faqs: [
      {
        question: "My link has multiple photos — why?",
        answer:
          "That is a carousel. Use the Instagram Carousel Downloader to save every slide (often as a ZIP).",
      },
      {
        question: "Can I download posts from private accounts?",
        answer: "No. Only publicly visible posts can be fetched.",
      },
      {
        question: "Does this remove the caption?",
        answer:
          "The media file is saved separately. To copy caption text, use the Instagram Caption Downloader.",
      },
    ],
    keywords: [
      "instagram post downloader",
      "download instagram photo",
      "save instagram post",
      "instagram /p/ download",
      "jazzghost post",
    ],
  },
  {
    id: "carousel",
    slug: "instagram-carousel-downloader",
    lockedType: "carousel",
    inputMode: "url",
    metaTitle: "Instagram Carousel Downloader — Save All Slides | JazzGhost",
    metaDescription:
      "Download every slide from an Instagram carousel album. Paste a /p/ carousel link and save photos and videos together with JazzGhost.",
    h1: "Instagram Carousel Downloader",
    subtitle:
      "Save multi-image and multi-video Instagram albums in one go. Every slide, one download.",
    placeholder: "https://www.instagram.com/p/… (carousel)",
    ctaLabel: "Fetch Carousel",
    howToTitle: "How to Download Instagram Carousels",
    steps: [
      {
        order: 1,
        title: "Open the carousel post",
        description:
          "Find the swipeable album on Instagram and copy its /p/ link from Share → Copy Link.",
        imageAlt: "Copy Instagram carousel album link",
      },
      {
        order: 2,
        title: "Paste into JazzGhost",
        description:
          "Paste the link above. We detect all slides and show a preview before downloading.",
        imageAlt: "Paste carousel URL into JazzGhost",
      },
      {
        order: 3,
        title: "Download all slides",
        description:
          "Save the full set — typically as a ZIP with every image and video from the album.",
        imageAlt: "Download Instagram carousel ZIP",
      },
    ],
    aboutTitle: "Get every slide from Instagram albums",
    aboutBody: [
      "Carousel posts pack several photos or videos into one share. JazzGhost’s Carousel Downloader is built for those albums — not single-frame posts — so you do not miss slides.",
      "Creators use carousels for tutorials, lookbooks, and before/after sets. Archiving the full set offline is much easier when the tool understands multi-media posts.",
      "If you only need one photo from an album, you can still download the package and keep the slide you need.",
    ],
    featuresTitle: "Carousel-focused features",
    features: [
      {
        title: "All slides",
        description: "Detects carousel_media and packs every item, not just the cover.",
      },
      {
        title: "Mixed media",
        description: "Supports albums that mix photos and videos in one post.",
      },
      {
        title: "ZIP packaging",
        description: "Multi-slide downloads are delivered as a convenient archive when needed.",
      },
      {
        title: "Clear intent",
        description: "This page is only about carousels — less confusion than all-in-one downloaders.",
      },
    ],
    faqTitle: "Carousel downloader FAQ",
    faqs: [
      {
        question: "Why did I only get one file?",
        answer:
          "The post may be a single image/video. Use the Post Downloader for single media, or confirm the album has multiple slides.",
      },
      {
        question: "Are Stories included?",
        answer: "No. Use the Story or Highlight downloaders for ephemeral or highlight media.",
      },
    ],
    keywords: [
      "instagram carousel downloader",
      "download instagram album",
      "save carousel slides",
      "instagram multiple photos download",
      "jazzghost carousel",
    ],
  },
  {
    id: "story",
    slug: "instagram-story-downloader",
    lockedType: "story",
    inputMode: "url",
    metaTitle: "Instagram Story Downloader — Save Stories Anonymously | JazzGhost",
    metaDescription:
      "Download Instagram Stories from public profiles. Paste a story link, preview, and save before it expires — free Story Downloader by JazzGhost.",
    h1: "Instagram Story Downloader",
    subtitle:
      "Save public Instagram Stories before they disappear. Paste a /stories/ link and download photo or video stories.",
    placeholder: "https://www.instagram.com/stories/username/…",
    ctaLabel: "Fetch Story",
    howToTitle: "How to Download Instagram Stories",
    steps: [
      {
        order: 1,
        title: "Copy the story link",
        description:
          "Open the story and use Share → Copy Link. Links look like /stories/username/STORY_ID/.",
        imageAlt: "Copy Instagram story share link",
      },
      {
        order: 2,
        title: "Paste while it is live",
        description:
          "Stories expire in 24 hours. Paste the link into JazzGhost quickly and fetch a preview.",
        imageAlt: "Paste Instagram story URL",
      },
      {
        order: 3,
        title: "Download the media",
        description:
          "Save the story photo or video to your device. For permanent highlight reels, use the Highlight Downloader.",
        imageAlt: "Download Instagram story media",
      },
    ],
    aboutTitle: "Anonymous story saving for public accounts",
    aboutBody: [
      "Instagram Stories vanish after a day. JazzGhost’s Story Downloader helps you archive public stories you are allowed to save — for inspiration, news, or personal backups.",
      "You browse JazzGhost in your own browser; we do not require you to log into Instagram on our site. Access to story media still depends on public visibility and valid session cookies on our server.",
      "Always respect privacy and copyright. Do not redistribute someone’s story without permission.",
    ],
    featuresTitle: "Story downloader benefits",
    features: [
      {
        title: "Photo & video stories",
        description: "Supports both still and video story items when the link is valid.",
      },
      {
        title: "Time-sensitive",
        description: "Optimized messaging so you know to act before the 24-hour window closes.",
      },
      {
        title: "Public profiles",
        description: "Works with publicly available story links — not private accounts.",
      },
      {
        title: "Highlight alternative",
        description: "Need lasting highlight reels? Use our Highlight Downloader instead.",
      },
    ],
    faqTitle: "Story downloader FAQ",
    faqs: [
      {
        question: "The story failed — why?",
        answer:
          "It may have expired, the account is private, or the link format is incomplete. Copy a fresh link while the story is still active.",
      },
      {
        question: "Can the poster see that I downloaded?",
        answer:
          "JazzGhost does not use your Instagram account to view the story. Saving is processed on our side from the public link.",
      },
    ],
    keywords: [
      "instagram story downloader",
      "download instagram stories",
      "save story anonymously",
      "story saver online",
      "jazzghost story",
    ],
  },
  {
    id: "highlight",
    slug: "instagram-highlight-downloader",
    lockedType: "highlight",
    inputMode: "url",
    metaTitle: "Instagram Highlight Downloader — Save Highlight Reels | JazzGhost",
    metaDescription:
      "Download Instagram Highlights from public profiles. Paste a highlight link and save the media with JazzGhost’s Highlight Downloader.",
    h1: "Instagram Highlight Downloader",
    subtitle:
      "Save Instagram Highlights that stay on a profile. Paste a highlight URL and download the stories inside.",
    placeholder: "https://www.instagram.com/stories/highlights/…",
    ctaLabel: "Fetch Highlight",
    howToTitle: "How to Download Instagram Highlights",
    steps: [
      {
        order: 1,
        title: "Open the highlight",
        description:
          "On a public profile, open the Highlight circle and copy the link (often /stories/highlights/ID/).",
        imageAlt: "Copy Instagram highlight link",
      },
      {
        order: 2,
        title: "Paste into JazzGhost",
        description:
          "Paste the highlight URL above and fetch. We load the highlight media for preview.",
        imageAlt: "Paste Instagram highlight URL",
      },
      {
        order: 3,
        title: "Download the clips",
        description:
          "Save the highlight items to your device — useful for brand kits, travel boards, and archives.",
        imageAlt: "Download Instagram highlight media",
      },
    ],
    aboutTitle: "Archive Instagram Highlights the right way",
    aboutBody: [
      "Highlights are curated stories pinned to a profile. Unlike 24-hour stories, they remain until the owner removes them — perfect for portfolios, menus, and brand moments.",
      "JazzGhost’s Highlight Downloader focuses on highlight URLs so instructions and validation stay accurate. Use the Story Downloader for ephemeral /stories/username/ links.",
      "Only download content you have rights to use. Highlights often showcase original creative work.",
    ],
    featuresTitle: "Highlight downloader features",
    features: [
      {
        title: "Highlight URL support",
        description: "Recognizes /stories/highlights/ links used by Instagram for pinned reels.",
      },
      {
        title: "Multi-item highlights",
        description: "Fetches the media items inside the highlight when available.",
      },
      {
        title: "Public profiles",
        description: "Requires publicly accessible highlight content.",
      },
      {
        title: "Same JazzGhost flow",
        description: "Preview and download with the familiar JazzGhost interface.",
      },
    ],
    faqTitle: "Highlight downloader FAQ",
    faqs: [
      {
        question: "Highlight vs Story — which tool?",
        answer:
          "Use Highlight for /stories/highlights/… links. Use Story for temporary /stories/username/… links.",
      },
      {
        question: "Why is my highlight empty?",
        answer:
          "The owner may have deleted items, restricted visibility, or the link may be outdated. Try copying a fresh link.",
      },
    ],
    keywords: [
      "instagram highlight downloader",
      "download instagram highlights",
      "save highlight reels",
      "highlight story download",
      "jazzghost highlight",
    ],
  },
  {
    id: "bio",
    slug: "instagram-bio-downloader",
    lockedType: "bio",
    inputMode: "username",
    metaTitle: "Instagram Bio Downloader — View & Copy Profile Bio | JazzGhost",
    metaDescription:
      "Look up a public Instagram username and copy bio, name, and profile stats. Free Instagram Bio information tool by JazzGhost.",
    h1: "Instagram Bio Downloader",
    subtitle:
      "Enter a public Instagram username to view bio text, display name, and profile stats — then copy with one click.",
    placeholder: "username (without @)",
    ctaLabel: "Fetch Bio",
    howToTitle: "How to Get Instagram Bio Information",
    steps: [
      {
        order: 1,
        title: "Enter the username",
        description:
          "Type a public Instagram handle (without @). Example: natgeo — not a private account.",
        imageAlt: "Enter Instagram username for bio lookup",
      },
      {
        order: 2,
        title: "Fetch profile info",
        description:
          "JazzGhost loads the public bio, full name, follower counts, and avatar when available.",
        imageAlt: "Fetch Instagram profile bio information",
      },
      {
        order: 3,
        title: "Copy what you need",
        description:
          "Use the Copy button to paste the bio into notes, CRM fields, or research docs.",
        imageAlt: "Copy Instagram bio text",
      },
    ],
    aboutTitle: "Public Instagram bio lookup — not a password tool",
    aboutBody: [
      "The Instagram Bio Downloader helps marketers, journalists, and creators quickly read public profile bios without opening the Instagram app. Enter a username and copy the text you need.",
      "This tool only reads publicly available profile information. It cannot access private accounts, DMs, or login-protected data.",
      "Pair it with our Caption Downloader when you need post text instead of profile bio text.",
    ],
    featuresTitle: "What you can copy",
    features: [
      {
        title: "Bio text",
        description: "Full public biography string ready to copy.",
      },
      {
        title: "Display name",
        description: "The profile’s full name field when Instagram exposes it.",
      },
      {
        title: "Public stats",
        description: "Follower, following, and post counts for quick research.",
      },
      {
        title: "Avatar URL",
        description: "Profile picture reference when returned by the public API.",
      },
    ],
    faqTitle: "Bio tool FAQ",
    faqs: [
      {
        question: "Can I get bios from private accounts?",
        answer: "No. Private profiles are not available through this tool.",
      },
      {
        question: "Do I need the person’s password?",
        answer: "Absolutely not. Only public usernames are accepted.",
      },
    ],
    keywords: [
      "instagram bio downloader",
      "instagram bio copy",
      "instagram profile information",
      "get instagram bio",
      "jazzghost bio",
    ],
  },
  {
    id: "caption",
    slug: "instagram-caption-downloader",
    lockedType: "caption",
    inputMode: "url",
    metaTitle: "Instagram Caption Downloader — Copy Post & Reel Text | JazzGhost",
    metaDescription:
      "Extract and copy captions from Instagram posts and Reels. Paste a content URL and grab the full text with JazzGhost.",
    h1: "Instagram Caption Downloader",
    subtitle:
      "Paste a public post or Reel URL to extract the caption text and copy it instantly.",
    placeholder: "https://www.instagram.com/p/… or /reel/…",
    ctaLabel: "Fetch Caption",
    howToTitle: "How to Download Instagram Captions",
    steps: [
      {
        order: 1,
        title: "Copy the content link",
        description:
          "Open the post or Reel and copy its URL (/p/, /reel/, or /reels/).",
        imageAlt: "Copy Instagram post or Reel link for caption",
      },
      {
        order: 2,
        title: "Paste and extract",
        description:
          "Paste into the box above and fetch. JazzGhost reads the caption from the public media.",
        imageAlt: "Extract Instagram caption text",
      },
      {
        order: 3,
        title: "Copy the text",
        description:
          "Review the caption and tap Copy to place it on your clipboard for notes or translation.",
        imageAlt: "Copy Instagram caption to clipboard",
      },
    ],
    aboutTitle: "Caption text without downloading the video",
    aboutBody: [
      "Sometimes you only need the words — hooks, CTAs, hashtags — not the media file. The Instagram Caption Downloader extracts caption text from public posts and Reels.",
      "It complements our media downloaders: grab the MP4 with the Reels or Post tools, and pull the copy here for scripts and research.",
      "Captions are returned as plain text. Emoji and line breaks are preserved when Instagram provides them.",
    ],
    featuresTitle: "Caption tool features",
    features: [
      {
        title: "Posts & Reels",
        description: "Works with common /p/ and /reel/ public URLs.",
      },
      {
        title: "One-click copy",
        description: "Copy the full caption to your clipboard in a tap.",
      },
      {
        title: "No media required",
        description: "Skips heavy video download when you only need text.",
      },
      {
        title: "Research-friendly",
        description: "Useful for social listening, translation, and content audits.",
      },
    ],
    faqTitle: "Caption downloader FAQ",
    faqs: [
      {
        question: "Why is the caption empty?",
        answer:
          "The post may have no caption, or the media is private/unavailable. Try another public URL.",
      },
      {
        question: "Does this download the video too?",
        answer:
          "No. This tool returns text only. Use the Reels or Post Downloader for media files.",
      },
    ],
    keywords: [
      "instagram caption downloader",
      "copy instagram caption",
      "extract reel caption",
      "instagram text extractor",
      "jazzghost caption",
    ],
  },
];
