import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, CreditCard, XCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { usePolicyContent } from '@/hooks/usePolicyContent';
import { defaultTerms } from '@/data/defaultTerms';
import type { PolicyBlock } from '@/types';

const sectionMeta = [
  { id: 'introduction',  label: 'Introduction',      Icon: FileText      },
  { id: 'obligations',   label: 'User Obligations',  Icon: ShieldCheck   },
  { id: 'payments',      label: 'Payments',           Icon: CreditCard    },
  { id: 'cancellation',  label: 'Cancellation',       Icon: XCircle       },
  { id: 'liability',     label: 'Liability',           Icon: AlertTriangle },
];

function SectionIcon({ Icon }: { Icon: React.ElementType }) {
  return (
    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
      <Icon size={18} className="text-secondary-500" />
    </div>
  );
}

function renderBlocks(blocks: PolicyBlock[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'text':
        return (
          <p key={i} className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm mt-4 first:mt-0">
            {block.content}
          </p>
        );
      case 'blockquote':
        return (
          <blockquote key={i} className="my-6 border-l-4 border-secondary-500 pl-5 py-2 bg-secondary-50/50 dark:bg-secondary-900/10 rounded-r-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">{block.content}</p>
          </blockquote>
        );
      case 'bullets':
        return (
          <div key={i} className="mt-5 flex flex-col gap-3">
            {block.items.map((item, j) => (
              <div key={j} className="flex items-start gap-3">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5 text-secondary-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.label && (
                    <span className="font-semibold text-gray-900 dark:text-white">{item.label}: </span>
                  )}
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        );
      case 'plain-bullets':
        return (
          <div key={i} className="mt-5 flex flex-col gap-3">
            {block.items.map((item, j) => (
              <div key={j} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        );
      case 'grid':
        return (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {block.items.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        );
    }
  });
}

export function TermsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const content = usePolicyContent('terms', defaultTerms);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 },
    );
    sectionMeta.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white dark:bg-gray-900 pt-28 pb-24">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Terms and Conditions
          </h1>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
            <Clock size={14} />
            <span>Last updated: {content.updatedAt} &nbsp;•&nbsp; Version {content.version}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Documentation
            </p>
            <nav className="flex flex-col gap-1">
              {sectionMeta.map(({ id, label, Icon }) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 font-semibold'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={15} className={isActive ? 'text-secondary-500' : 'text-gray-400'} />
                    {label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-8 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Need help understanding our terms? Our concierge is available 24/7 for our premium members.
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary-600 dark:text-secondary-400 hover:underline"
              >
                Contact Support →
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-16">
            {sectionMeta.map(({ id, Icon }) => {
              const section = content.sections.find((s) => s.id === id);
              if (!section) return null;
              return (
                <section key={id} id={id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <SectionIcon Icon={Icon} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.heading}</h2>
                  </div>
                  {renderBlocks(section.blocks)}
                </section>
              );
            })}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Still have questions?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Our compliance team is available to help you understand the details of our agreement.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-secondary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
