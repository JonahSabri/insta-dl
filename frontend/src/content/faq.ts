/** JazzGhost FAQ content — adapted from design export for site structure. */

export type FaqItem = { q: string; a: string };

export type FaqCategory = {
  id: string;
  label: string;
  color: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General Questions",
    color: "#a855f7",
    items: [
      {
        q: "What is JazzGhost?",
        a: "JazzGhost is a free, browser-based tool that lets you download Instagram content — including Reels, posts, Stories, images, and carousels — without needing an account or installing any software.",
      },
      {
        q: "Is JazzGhost free to use?",
        a: "Yes, JazzGhost is completely free. There are no paid plans, no monthly subscriptions, and no hidden limitations. The service is and will always remain free.",
      },
      {
        q: "Do I need to create an account to use JazzGhost?",
        a: "No sign-up or account is required. Simply copy the Instagram link, paste it into JazzGhost, and download — that's it. No personal information is ever collected.",
      },
      {
        q: "Does JazzGhost work on all devices?",
        a: "Yes, JazzGhost works on all devices and operating systems including Windows, Mac, Linux, iOS, and Android. All you need is a web browser and an internet connection.",
      },
      {
        q: "Is there any software or extension to install?",
        a: "No. JazzGhost runs entirely in your browser. There's no app, browser extension, or software to download or install.",
      },
    ],
  },
  {
    id: "content",
    label: "Supported Content",
    color: "#ec4899",
    items: [
      {
        q: "What types of Instagram content can I download?",
        a: "JazzGhost supports downloading: Reels, regular posts, single images, carousels (multi-image posts), and Stories. Just paste the content link and download.",
      },
      {
        q: "Can I download Instagram Reels?",
        a: "Yes, JazzGhost fully supports Instagram Reels downloads. Videos are saved at the highest available quality, typically in HD resolution.",
      },
      {
        q: "Can I download Instagram Stories?",
        a: "Yes, you can download public Stories. For Stories from private profiles, you need to be following that account first. Only Stories that haven't expired yet are downloadable.",
      },
      {
        q: "Are carousels (multi-image posts) fully downloaded?",
        a: "Yes, JazzGhost downloads all images in a carousel post at once. You don't need to save each image individually.",
      },
      {
        q: "Can I download content from private profiles?",
        a: "No — JazzGhost only works with publicly accessible content. Private profile content is not available to the public, so it cannot be downloaded. This policy respects the privacy settings users have chosen.",
      },
      {
        q: "Is IGTV video download supported?",
        a: "Yes, IGTV videos are also downloadable. Follow the same steps: copy the video link and paste it into JazzGhost.",
      },
    ],
  },
  {
    id: "howto",
    label: "How to Download",
    color: "#6366f1",
    items: [
      {
        q: "How do I use JazzGhost to download content?",
        a: "The download process has three simple steps:\n1. Copy the link of the Instagram post, Reel, or Story.\n2. Paste the link into JazzGhost's input field.\n3. Click the download button and save the file.\nIt typically takes less than 3 seconds.",
      },
      {
        q: "How do I find the link to an Instagram post?",
        a: "In the Instagram app: tap the three-dot menu (⋯) on the post and select \"Copy Link\". In a browser: copy the URL directly from the address bar while viewing the post.",
      },
      {
        q: "What file formats are the downloads saved in?",
        a: "Videos are saved as MP4 and images as JPG. These formats are compatible with virtually all devices, media players, and editing tools.",
      },
      {
        q: "Can I download multiple files at the same time?",
        a: "Each link is processed as a separate download. For carousels, all images within that post are provided together in one batch.",
      },
      {
        q: "How fast is the download?",
        a: "JazzGhost is optimized for speed. The average processing time is under 3 seconds, and no speed limits are imposed on your downloads.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    color: "#10b981",
    items: [
      {
        q: "Does JazzGhost store my data?",
        a: "No. JazzGhost does not store any personal data. Links you enter and the downloaded files are processed temporarily and deleted immediately after your download completes.",
      },
      {
        q: "Is JazzGhost safe to use?",
        a: "Yes, JazzGhost is completely safe. No software is installed on your device, no sensitive information is collected, and all communication is encrypted via HTTPS.",
      },
      {
        q: "Does JazzGhost access my Instagram account?",
        a: "No. JazzGhost never accesses your Instagram account and doesn't require your password or login credentials. We only process publicly available links.",
      },
      {
        q: "Is it legal to download content from Instagram?",
        a: "Legality depends on how you use the content. Downloading for personal use is generally acceptable in most regions. Republishing someone else's content without permission may violate copyright law. Always respect intellectual property rights.",
      },
      {
        q: "How long are downloaded files kept on JazzGhost's servers?",
        a: "Files are not stored permanently on our servers. Once your download is complete, the file is removed. You are responsible for saving the downloaded file on your own device.",
      },
    ],
  },
  {
    id: "quality",
    label: "Quality & Formats",
    color: "#f59e0b",
    items: [
      {
        q: "What quality are the downloaded files?",
        a: "JazzGhost downloads files at the highest quality available on Instagram. Videos are typically saved in HD, and images are downloaded at the highest resolution Instagram provides.",
      },
      {
        q: "Can I choose the download quality?",
        a: "JazzGhost automatically selects the best available quality. Manual quality selection is not currently available, but the file you receive is the same quality Instagram itself stores.",
      },
      {
        q: "Why does the downloaded video look lower quality than expected?",
        a: "The final quality depends on the original file uploaded by the content creator. Instagram compresses files during upload, so JazzGhost downloads exactly what Instagram has stored — it can't exceed that quality.",
      },
      {
        q: "Is 4K or ultra-high-quality video download supported?",
        a: "Support for very high resolutions depends on Instagram itself. Instagram currently caps video quality at a certain maximum, and JazzGhost delivers exactly that.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical Support",
    color: "#64748b",
    items: [
      {
        q: "Why isn't my download working?",
        a: "There are a few possible reasons:\n• The copied link is incorrect — make sure you copied the full post URL.\n• Private profile — JazzGhost only works with public content.\n• Deleted post — if the post was removed, it can't be downloaded.\n• Internet connection issue — check your connection and try again.",
      },
      {
        q: "What does a valid Instagram link look like?",
        a: "Valid Instagram links typically look like:\n• Post: https://www.instagram.com/p/XXXXX/\n• Reel: https://www.instagram.com/reel/XXXXX/\n• Story: share via the Instagram app's share menu",
      },
      {
        q: "Does JazzGhost work on all browsers?",
        a: "Yes, JazzGhost is compatible with all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, use the latest version of your browser.",
      },
      {
        q: "What should I do if I get a \"Content not found\" error?",
        a: "This error usually means:\n• The profile is set to private\n• The post was deleted by its owner\n• The link is incorrect or incomplete\nDouble-check the link, refresh the page, and try again.",
      },
      {
        q: "Is there a daily download limit?",
        a: "Guest users may have a fair-use daily limit shown in the app. JazzGhost remains free — if you hit a limit, try again later.",
      },
      {
        q: "How do I report a problem or contact support?",
        a: "If you encounter any issues, reach JazzGhost via the Contact page. The Blog and help guides may also answer your question.",
      },
    ],
  },
  {
    id: "troubleshoot",
    label: "Common Issues",
    color: "#ef4444",
    items: [
      {
        q: "The download won't start — what should I do?",
        a: "First, make sure your browser has permission to download files. Some browsers block automatic downloads. Check your browser settings and ensure downloads are not being blocked.",
      },
      {
        q: "I can't find the downloaded file on my device",
        a: "Downloaded files are usually saved to your device's \"Downloads\" folder. On mobile, check the \"Files\" or file manager app. Review your browser's default download location in its settings.",
      },
      {
        q: "The downloaded video won't play",
        a: "Make sure your media player supports the MP4 format. VLC Player is a great free option that plays virtually all formats. It's also possible the download was incomplete — try downloading again.",
      },
      {
        q: "The page won't load or is very slow",
        a: "Clear your browser's cache and cookies, refresh the page, and check your internet connection. If the problem persists, try a different browser or contact support.",
      },
    ],
  },
];

export function flattenFaqItems(): FaqItem[] {
  return FAQ_CATEGORIES.flatMap((c) => c.items);
}

export const FAQ_TOTAL = flattenFaqItems().length;
