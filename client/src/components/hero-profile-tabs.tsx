import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { aboutMe, education, experiences, relevantCoursework } from "@/data/portfolio-data";
import HeroBlogBrowser from "@/components/blog/hero-blog-browser";

type TabId = "experiences" | "about" | "blog";

const tabs = [
  { id: "experiences" as const, label: "Experiences" },
  { id: "about" as const, label: "About Me" },
  { id: "blog" as const, label: "Blog" },
];

function CompanyLogo({
  company,
  logoUrl,
  domain,
}: {
  company: string;
  logoUrl?: string;
  domain?: string;
}) {
  const sources = [
    logoUrl,
    domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : undefined,
    domain
      ? `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`
      : undefined,
  ].filter((source): source is string => Boolean(source));

  const [sourceIndex, setSourceIndex] = useState(0);

  if (sourceIndex >= sources.length) {
    return (
      <div className="w-11 h-11 rounded-lg bg-muted border border-border/50 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-muted-foreground">
          {company.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt=""
      onError={() => setSourceIndex((index) => index + 1)}
      className="w-11 h-11 rounded-lg object-contain bg-white border border-border/50 p-1 shrink-0"
    />
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase mb-4 text-center">
      {children}
    </p>
  );
}

export default function HeroProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("experiences");

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 sm:gap-x-10 mb-7">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`text-lg font-medium transition-colors pb-0.5 border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
            data-testid={`profile-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "blog" && (
          <motion.div
            key="blog"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <HeroBlogBrowser />
          </motion.div>
        )}

        {activeTab === "experiences" && (
          <motion.div
            key="experiences"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-left"
          >
            <SectionLabel>Experience</SectionLabel>
            <ul className="space-y-5">
              {experiences.map((experience) => (
                <li
                  key={experience.id}
                  className="flex items-start gap-3.5"
                  data-testid={`experience-${experience.id}`}
                >
                  <CompanyLogo
                    company={experience.company}
                    logoUrl={experience.logoUrl}
                    domain={experience.domain}
                  />
                  <div className="min-w-0 pt-0.5">
                    <p className="text-lg font-semibold text-foreground leading-snug">
                      {experience.title} · {experience.company}
                    </p>
                    <p className="text-base text-muted-foreground mt-0.5">{experience.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-border/40 pt-8">
              <SectionLabel>Education</SectionLabel>
              <ul className="space-y-6">
                {education.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3.5" data-testid={`education-${entry.id}`}>
                    <CompanyLogo
                      company={entry.school}
                      logoUrl={entry.logoUrl}
                      domain={entry.domain}
                    />
                    <div className="min-w-0 pt-0.5">
                      <p className="text-lg font-semibold text-foreground leading-snug">
                        {entry.school}
                      </p>
                      <p className="text-base text-muted-foreground mt-0.5">
                        {entry.degree} · {entry.date}
                        {entry.gpa ? ` · GPA ${entry.gpa}` : ""}
                      </p>
                      {entry.activities?.map((activity, index) => (
                        <p key={index} className="text-base text-muted-foreground mt-1.5 leading-snug">
                          {activity}
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              {relevantCoursework.length > 0 && (
                <div className="mt-7">
                  <p className="text-base text-muted-foreground mb-3">Relevant coursework</p>
                  <div className="flex flex-wrap gap-2.5">
                    {relevantCoursework.map((course) => (
                      <a
                        key={course.code}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${course.code} ${course.name} — course website (opens in a new tab)`}
                        className="inline-flex max-w-full items-baseline gap-1.5 px-3.5 py-2 rounded-full bg-muted/60 border border-border/40 text-base transition-colors hover:border-[var(--vintage-accent)] hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vintage-accent)]"
                        data-testid={`course-${course.code.replace(/\s+/g, "-")}`}
                      >
                        <span className="shrink-0 whitespace-nowrap font-semibold text-primary">{course.code}</span>
                        <span className="min-w-0 text-muted-foreground">{course.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-left"
          >
            <SectionLabel>About Me</SectionLabel>
            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed min-h-[3rem]">
              {aboutMe.paragraphs.length > 0 ? (
                aboutMe.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <span className="italic opacity-60">Add a short paragraph about your background.</span>
              )}
            </div>

            {aboutMe.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {aboutMe.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full aspect-square object-cover rounded-xl border border-border"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl border border-dashed border-border bg-muted/30"
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
