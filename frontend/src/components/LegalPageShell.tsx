import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";

export default function LegalPageShell({
  children,
  html,
}: {
  children?: React.ReactNode;
  html?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
      <SiteHeader active="legal" />
      <main className="flex-1 px-4 py-10 sm:py-14">
        <article className="article-body legal-prose mx-auto max-w-3xl">
          {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null}
          {children}
        </article>
      </main>
      <CookieConsent />
      <SiteFooter />
    </div>
  );
}
