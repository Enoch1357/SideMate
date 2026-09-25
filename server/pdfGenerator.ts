/**
 * server/pdfGenerator.ts — Server-side PDF generation for Stage 3 Product Studio
 * ----------------------------------------------------------------------------
 * Renders a GeneratedProductBlueprint (EnhancedProductBlueprint) into a
 * professional, print-optimized multi-page PDF using Puppeteer + an Inter-based
 * HTML template themed by the blueprint's accent color.
 *
 * Cloud Run compatibility: launched with --no-sandbox / --disable-setuid-sandbox.
 */

import puppeteer from 'puppeteer';
import type {
  EnhancedProductBlueprint,
  ProductPillar,
  ProductResource,
} from '../src/types/index.ts';

/* ----------------------------------------------------------------------------
 * Small utilities
 * --------------------------------------------------------------------------*/

function escapeHtml(input: unknown): string {
  const s = String(input ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Minimal, safe markdown-to-HTML for the pillar content (headings, bold, lists, paragraphs). */
function markdownToHtml(md: string): string {
  const text = String(md ?? '').trim();
  if (!text) return '';

  const blocks = text.split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length + 2, 6); // ### -> h5
      html.push(`<h${level} class="md-heading">${inlineMd(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Unordered / ordered list
    const lines = trimmed.split('\n');
    const isList = lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
    if (isList) {
      const ordered = /^\s*\d+\.\s+/.test(lines[0]);
      const tag = ordered ? 'ol' : 'ul';
      const items = lines
        .map((l) => l.replace(/^\s*([-*]|\d+\.)\s+/, ''))
        .map((l) => `<li>${inlineMd(l)}</li>`)
        .join('');
      html.push(`<${tag} class="md-list">${items}</${tag}>`);
      continue;
    }

    // Paragraph
    html.push(`<p class="md-p">${inlineMd(trimmed.replace(/\n/g, ' '))}</p>`);
  }

  return html.join('\n');
}

/** Inline markdown: bold, italics — everything else escaped. */
function inlineMd(text: string): string {
  let safe = escapeHtml(text);
  // Bold **text**
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text* (avoid matching bold leftovers)
  safe = safe.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  return safe;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = (hex || '#4F46E5').replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Returns black/white for best contrast against a background hex. */
function contrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

const FORMAT_LABELS: Record<string, string> = {
  pdf_guide: 'PDF Guide',
  ebook: 'Ebook',
  checklist: 'Printable Checklist',
  notion_template: 'Notion Template',
  audio_walkthrough: 'Audio Walkthrough',
};

/* ----------------------------------------------------------------------------
 * HTML template
 * --------------------------------------------------------------------------*/

export function buildBlueprintHtml(
  bp: EnhancedProductBlueprint,
  options: { creatorName?: string } = {}
): string {
  const accent = bp.coverDesign?.accentColor || '#4F46E5';
  const accentText = contrastText(accent);
  const creatorName = options.creatorName || bp.creatorAttribution || 'Your Partner Creator';
  const pillars: ProductPillar[] = Array.isArray(bp.pillars) ? bp.pillars : [];
  const title = escapeHtml(bp.productTitle || 'Digital Product Blueprint');
  const subtitle = escapeHtml(bp.productSubtitle || '');
  const tagline = escapeHtml(bp.tagline || '');

  /* ---- Table of contents ---- */
  const tocPillars = pillars
    .map(
      (p, i) => `
        <div class="toc-row">
          <span class="toc-num">${String(p.pillarNumber || i + 1).padStart(2, '0')}</span>
          <span class="toc-title">${escapeHtml(p.title)}</span>
          <span class="toc-dots"></span>
        </div>`
    )
    .join('');

  const hasChecklist = !!bp.printableChecklist && Array.isArray(bp.printableChecklist.sections);
  const tocExtra = `
    ${hasChecklist ? '<div class="toc-row"><span class="toc-num">★</span><span class="toc-title">Printable Checklist</span><span class="toc-dots"></span></div>' : ''}
    <div class="toc-row"><span class="toc-num">✦</span><span class="toc-title">Resource Directory</span><span class="toc-dots"></span></div>
  `;

  /* ---- Pillar sections ---- */
  const pillarSections = pillars
    .map((p, i) => {
      const resources = Array.isArray(p.resources) ? p.resources : [];
      const resourceHtml = resources.length
        ? `<div class="resources">
             <div class="resources-label">Expert Resources</div>
             <ul class="resource-list">
               ${resources
                 .map(
                   (r: ProductResource) => `<li>
                     <span class="res-title">${escapeHtml(r.title)}</span>
                     <span class="res-desc">${escapeHtml(r.description)}</span>
                     <span class="res-url">${escapeHtml(r.url)}</span>
                   </li>`
                 )
                 .join('')}
             </ul>
           </div>`
        : '';

      return `
      <section class="pillar ${i === 0 ? '' : 'page-break'}">
        <div class="pillar-head">
          <div class="pillar-badge">Pillar ${String(p.pillarNumber || i + 1).padStart(2, '0')}</div>
          <h2 class="pillar-title">${escapeHtml(p.title)}</h2>
        </div>

        <div class="objective-callout">
          <div class="callout-label">Objective</div>
          <div class="callout-text">${escapeHtml(p.objective)}</div>
        </div>

        <div class="illustration-placeholder">
          <span class="illus-icon">▦</span>
          <span class="illus-caption">${escapeHtml(p.illustrationPrompt || 'Section illustration')}</span>
        </div>

        <div class="pillar-content">
          ${markdownToHtml(p.fullContentMarkdown)}
        </div>

        <div class="action-box">
          <div class="action-label">Key Action Item</div>
          <div class="action-text">${escapeHtml(p.keyActionItem)}</div>
        </div>

        ${resourceHtml}
      </section>`;
    })
    .join('');

  /* ---- Checklist ---- */
  let checklistHtml = '';
  if (hasChecklist && bp.printableChecklist) {
    const cl = bp.printableChecklist;
    const sections = (cl.sections || [])
      .map(
        (s) => `
        <div class="cl-section">
          <h3 class="cl-section-title">${escapeHtml(s.sectionTitle)}</h3>
          <div class="cl-items">
            ${(s.items || [])
              .map(
                (item) => `
              <div class="cl-item">
                <span class="cl-check"></span>
                <div class="cl-item-body">
                  <span class="cl-text">${escapeHtml(item.text)}${item.isRequired ? '<span class="cl-req">•</span>' : ''}</span>
                  ${item.fillableField ? `<span class="cl-fill">${escapeHtml(item.fillableField)}</span>` : ''}
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>`
      )
      .join('');

    checklistHtml = `
      <section class="checklist page-break">
        <div class="section-header">
          <div class="section-kicker">Printable</div>
          <h2 class="section-title">${escapeHtml(cl.title)}</h2>
          <p class="section-sub">${escapeHtml(cl.subtitle)}</p>
        </div>
        ${sections}
      </section>`;
  }

  /* ---- Resource directory (aggregated) ---- */
  const allResources: ProductResource[] = [];
  pillars.forEach((p) => (p.resources || []).forEach((r) => allResources.push(r)));
  const resourceDirectory = `
    <section class="resource-dir page-break">
      <div class="section-header">
        <div class="section-kicker">Appendix</div>
        <h2 class="section-title">Resource Directory</h2>
        <p class="section-sub">Curated, credible sources referenced throughout this guide.</p>
      </div>
      ${
        allResources.length
          ? `<ul class="dir-list">${allResources
              .map(
                (r) => `<li>
                  <div class="dir-title">${escapeHtml(r.title)}</div>
                  <div class="dir-desc">${escapeHtml(r.description)}</div>
                  <div class="dir-url">${escapeHtml(r.url)}</div>
                </li>`
              )
              .join('')}</ul>`
          : '<p class="section-sub">No external resources listed.</p>'
      }
      ${
        Array.isArray(bp.expertSources) && bp.expertSources.length
          ? `<div class="expert-sources">
               <h3 class="cl-section-title">Expert Synthesis</h3>
               ${bp.expertSources
                 .map(
                   (e) => `<div class="expert-row">
                     <div class="expert-domain">${escapeHtml(e.domain)} <span class="expert-creds">${escapeHtml((e.credentialTypes || []).join(', '))}</span></div>
                     <div class="expert-insight">${escapeHtml(e.keyInsightSynthesized)}</div>
                   </div>`
                 )
                 .join('')}
             </div>`
          : ''
      }
    </section>`;

  const formatBadges = (bp.includedFormats || [bp.primaryFormat])
    .filter(Boolean)
    .map((f) => `<span class="cover-format">${escapeHtml(FORMAT_LABELS[f] || f)}</span>`)
    .join('');

  /* ---- Full document ---- */
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --accent: ${accent};
    --accent-text: ${accentText};
    --accent-soft: ${rgba(accent, 0.08)};
    --accent-border: ${rgba(accent, 0.22)};
    --ink: #0f172a;
    --muted: #475569;
    --hair: #e2e8f0;
  }
  html, body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: var(--ink); line-height: 1.65; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h1, h2, h3 { line-height: 1.2; }
  .page-break { page-break-before: always; }
  section { padding: 46px 54px; }

  /* Cover */
  .cover {
    height: 100vh;
    display: flex; flex-direction: column; justify-content: space-between;
    background: linear-gradient(160deg, ${rgba(accent, 0.06)} 0%, #ffffff 55%);
    padding: 0;
    page-break-after: always;
  }
  .cover-bar { height: 14px; background: var(--accent); width: 100%; }
  .cover-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 0 64px; }
  .cover-kicker { text-transform: uppercase; letter-spacing: 3px; font-size: 12px; font-weight: 700; color: var(--accent); margin-bottom: 22px; }
  .cover-title { font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 800; letter-spacing: -1px; margin-bottom: 20px; max-width: 90%; }
  .cover-sub { font-size: 20px; color: var(--muted); font-weight: 500; max-width: 82%; margin-bottom: 26px; }
  .cover-tagline { display: inline-block; font-size: 15px; font-style: italic; color: var(--ink); border-left: 3px solid var(--accent); padding-left: 14px; margin-bottom: 34px; }
  .cover-formats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 30px; }
  .cover-format { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-border); border-radius: 999px; padding: 5px 13px; font-size: 11px; font-weight: 700; }
  .cover-footer { padding: 26px 64px 40px; border-top: 1px solid var(--hair); }
  .cover-by { font-size: 13px; color: var(--muted); }
  .cover-by strong { color: var(--ink); }
  .cover-price { float: right; font-weight: 800; color: var(--accent); font-size: 16px; }

  /* TOC */
  .toc-header { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; margin-bottom: 6px; }
  .toc-kicker { text-transform: uppercase; letter-spacing: 2.5px; font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 30px; }
  .toc-row { display: flex; align-items: center; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--hair); }
  .toc-num { font-weight: 800; color: var(--accent); font-size: 15px; width: 34px; }
  .toc-title { font-weight: 600; font-size: 15px; }

  /* Section headers */
  .section-header { margin-bottom: 26px; }
  .section-kicker { text-transform: uppercase; letter-spacing: 2.5px; font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 8px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; margin-bottom: 8px; }
  .section-sub { color: var(--muted); font-size: 14px; }

  /* Pillars */
  .pillar-head { border-bottom: 3px solid var(--accent); padding-bottom: 14px; margin-bottom: 22px; }
  .pillar-badge { display: inline-block; background: var(--accent); color: var(--accent-text); font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 6px; margin-bottom: 12px; }
  .pillar-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; }
  .objective-callout { background: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: 12px; padding: 16px 18px; margin-bottom: 22px; }
  .callout-label { text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; font-weight: 800; color: var(--accent); margin-bottom: 5px; }
  .callout-text { font-size: 15px; font-weight: 500; }
  .illustration-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #f8fafc; border: 1.5px dashed var(--hair); border-radius: 12px; padding: 30px 20px; margin-bottom: 24px; text-align: center; }
  .illus-icon { font-size: 30px; color: #cbd5e1; }
  .illus-caption { font-size: 11px; color: #94a3b8; font-style: italic; max-width: 80%; }
  .pillar-content { font-size: 14px; color: #1e293b; }
  .pillar-content .md-p { margin-bottom: 13px; }
  .pillar-content .md-heading { font-weight: 700; margin: 18px 0 8px; font-size: 16px; }
  .pillar-content .md-list { margin: 0 0 13px 20px; }
  .pillar-content .md-list li { margin-bottom: 6px; }
  .action-box { background: var(--ink); color: #fff; border-radius: 12px; padding: 18px 20px; margin-top: 24px; page-break-inside: avoid; }
  .action-label { text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; font-weight: 800; color: ${rgba(accent, 0.95)}; margin-bottom: 6px; }
  .action-box .action-label { color: #a5b4fc; }
  .action-text { font-size: 15px; font-weight: 600; }
  .resources { margin-top: 22px; border-top: 1px solid var(--hair); padding-top: 16px; page-break-inside: avoid; }
  .resources-label { text-transform: uppercase; letter-spacing: 1.5px; font-size: 10px; font-weight: 800; color: var(--muted); margin-bottom: 10px; }
  .resource-list { list-style: none; }
  .resource-list li { margin-bottom: 12px; padding-left: 14px; border-left: 2px solid var(--accent-border); }
  .res-title { display: block; font-weight: 700; font-size: 13px; }
  .res-desc { display: block; font-size: 12px; color: var(--muted); }
  .res-url { display: block; font-size: 11px; color: var(--accent); word-break: break-all; }

  /* Checklist */
  .cl-section { margin-bottom: 22px; page-break-inside: avoid; }
  .cl-section-title { font-size: 16px; font-weight: 800; color: var(--accent); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--hair); }
  .cl-item { display: flex; gap: 12px; align-items: flex-start; padding: 9px 0; }
  .cl-check { flex: 0 0 auto; width: 18px; height: 18px; border: 2px solid var(--accent); border-radius: 5px; margin-top: 2px; }
  .cl-item-body { display: flex; flex-direction: column; }
  .cl-text { font-size: 14px; font-weight: 500; }
  .cl-req { color: var(--accent); font-weight: 900; margin-left: 6px; }
  .cl-fill { font-size: 12px; color: var(--muted); margin-top: 3px; font-style: italic; }

  /* Resource directory */
  .dir-list { list-style: none; }
  .dir-list li { padding: 12px 0; border-bottom: 1px solid var(--hair); }
  .dir-title { font-weight: 700; font-size: 14px; }
  .dir-desc { font-size: 12px; color: var(--muted); }
  .dir-url { font-size: 11px; color: var(--accent); word-break: break-all; }
  .expert-sources { margin-top: 26px; }
  .expert-row { margin-bottom: 14px; background: var(--accent-soft); border-radius: 10px; padding: 12px 14px; }
  .expert-domain { font-weight: 700; font-size: 13px; }
  .expert-creds { font-weight: 500; color: var(--muted); font-size: 11px; }
  .expert-insight { font-size: 12px; color: #334155; margin-top: 3px; }
</style>
</head>
<body>
  <!-- COVER -->
  <div class="cover">
    <div class="cover-bar"></div>
    <div class="cover-body">
      <div class="cover-kicker">${escapeHtml(bp.coverDesign?.headline ? 'A SideMate Digital Product' : 'Digital Product')}</div>
      <div class="cover-title">${escapeHtml(bp.coverDesign?.headline || bp.productTitle)}</div>
      <div class="cover-sub">${escapeHtml(bp.coverDesign?.subheadline || bp.productSubtitle)}</div>
      ${tagline ? `<div class="cover-tagline">${tagline}</div>` : ''}
      <div class="cover-formats">${formatBadges}</div>
    </div>
    <div class="cover-footer">
      <span class="cover-price">$${escapeHtml(bp.price ?? '')}</span>
      <div class="cover-by">Created in collaboration with <strong>${escapeHtml(creatorName)}</strong></div>
    </div>
  </div>

  <!-- TOC -->
  <section class="toc">
    <div class="toc-kicker">Contents</div>
    <div class="toc-header">What's Inside</div>
    ${tocPillars}
    ${tocExtra}
  </section>

  <!-- PILLARS -->
  ${pillarSections}

  <!-- CHECKLIST -->
  ${checklistHtml}

  <!-- RESOURCE DIRECTORY -->
  ${resourceDirectory}
</body>
</html>`;
}

/* ----------------------------------------------------------------------------
 * PDF renderer
 * --------------------------------------------------------------------------*/

export async function generateBlueprintPdf(
  bp: EnhancedProductBlueprint,
  options: { creatorName?: string } = {}
): Promise<Buffer> {
  const html = buildBlueprintHtml(bp, options);
  const productTitle = escapeHtml(bp.productTitle || 'Digital Product');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    // Ensure web fonts are ready before rendering.
    await page.evaluateHandle('document.fonts.ready');

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '54px', bottom: '64px', left: '0px', right: '0px' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%; font-size:9px; color:#94a3b8; font-family:Inter,sans-serif; padding:0 54px; display:flex; justify-content:space-between; align-items:center;">
          <span>${productTitle}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
