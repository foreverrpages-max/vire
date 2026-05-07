// Generates a 1080×1350 (4:5) PNG keepsake card.
// Pure canvas — no external dependencies, ~3KB of code, zero assets.

type CardOpts = {
  kicker: string;
  line: string;
  name: string;        // user-supplied, may be empty
  curator: string;     // 'Nachiket'
  domain: string;      // 'vire'
  accent: string;      // hex color, e.g. '#B19EEF'
};

// Word-wrap that respects a max width, returns array of lines.
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Convert hex to rgba with given alpha
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function generateThoughtCard(opts: CardOpts): Promise<string> {
  const W = 1080;
  const H = 1350;

  // Try to load Cormorant Garamond if available; canvas fonts need to be ready before drawing.
  try {
    if ('fonts' in document) {
      await (document as any).fonts.load('400 96px "Cormorant Garamond"');
      await (document as any).fonts.load('500 32px "Inter"');
    }
  } catch { /* fall back to system serif */ }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── background: deep gradient ──────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#0d0a18');
  bgGrad.addColorStop(1, '#08070d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── soft accent glow top-left and bottom-right ─────────────────────
  const glow1 = ctx.createRadialGradient(W * 0.22, H * 0.22, 10, W * 0.22, H * 0.22, W * 0.7);
  glow1.addColorStop(0, hexToRgba(opts.accent, 0.45));
  glow1.addColorStop(1, hexToRgba(opts.accent, 0));
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  const glow2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 10, W * 0.85, H * 0.85, W * 0.6);
  glow2.addColorStop(0, hexToRgba('#9EC5EF', 0.22));
  glow2.addColorStop(1, hexToRgba('#9EC5EF', 0));
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // ── film grain (lightweight) ───────────────────────────────────────
  const grainCount = 1800;
  ctx.save();
  for (let i = 0; i < grainCount; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const a = Math.random() * 0.04;
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.restore();

  // ── inner border frame ─────────────────────────────────────────────
  const pad = 56;
  ctx.strokeStyle = hexToRgba('#ffffff', 0.08);
  ctx.lineWidth = 1;
  ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

  // ── top row: wordmark left, accent dot right ──────────────────────
  ctx.fillStyle = '#f3eeff';
  ctx.font = 'italic 500 56px "Cormorant Garamond", Georgia, serif';
  ctx.textBaseline = 'top';
  ctx.fillText(opts.domain, pad + 36, pad + 36);

  // accent pulse dot
  ctx.beginPath();
  ctx.arc(W - pad - 48, pad + 60, 7, 0, Math.PI * 2);
  ctx.fillStyle = opts.accent;
  ctx.shadowColor = opts.accent;
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── kicker (small uppercase label) ─────────────────────────────────
  const innerX = pad + 36;
  const innerW = W - pad * 2 - 72;

  ctx.fillStyle = opts.accent;
  ctx.font = '500 26px "Inter", system-ui, sans-serif';
  ctx.textBaseline = 'top';
  const kickerText = opts.kicker.toUpperCase();
  // Letter-space the kicker manually
  let kickerX = innerX;
  const kickerY = 360;
  for (const ch of kickerText) {
    ctx.fillText(ch, kickerX, kickerY);
    kickerX += ctx.measureText(ch).width + 6;
  }

  // ── the line itself (serif, big, wrapped) ──────────────────────────
  ctx.fillStyle = '#f3eeff';

  // Pick a font size that fits within the safe area
  const safeBottomY = H - 320; // reserve space for signature/footer
  const lineY0 = 430;
  const maxLineBlockH = safeBottomY - lineY0;

  // Try sizes from 92 down until it fits in 5 lines and within max height
  let chosenSize = 92;
  let lines: string[] = [];
  for (const size of [96, 88, 80, 74, 68, 62, 56]) {
    ctx.font = `400 ${size}px "Cormorant Garamond", Georgia, serif`;
    const wrapped = wrapText(ctx, opts.line, innerW);
    const lineH = size * 1.18;
    const totalH = wrapped.length * lineH;
    if (totalH <= maxLineBlockH) {
      chosenSize = size;
      lines = wrapped;
      break;
    }
    chosenSize = size;
    lines = wrapped;
  }

  ctx.font = `400 ${chosenSize}px "Cormorant Garamond", Georgia, serif`;
  const lineH = chosenSize * 1.18;
  lines.forEach((ln, i) => {
    ctx.fillText(ln, innerX, lineY0 + i * lineH);
  });

  // ── signature block at bottom ──────────────────────────────────────
  const sigY = H - pad - 140;

  // thin divider
  ctx.strokeStyle = hexToRgba('#ffffff', 0.12);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(innerX, sigY);
  ctx.lineTo(innerX + 80, sigY);
  ctx.stroke();

  // For: name (if given)
  if (opts.name) {
    ctx.fillStyle = hexToRgba('#c8bfe2', 0.85);
    ctx.font = '400 22px "Inter", system-ui, sans-serif';
    ctx.fillText('FOR', innerX, sigY + 24);

    ctx.fillStyle = '#f3eeff';
    ctx.font = 'italic 400 44px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(opts.name, innerX + 70, sigY + 12);
  } else {
    ctx.fillStyle = hexToRgba('#c8bfe2', 0.85);
    ctx.font = 'italic 400 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('a small thought', innerX, sigY + 18);
  }

  // curator + domain on the right
  ctx.textAlign = 'right';
  ctx.fillStyle = hexToRgba('#c8bfe2', 0.7);
  ctx.font = '400 22px "Inter", system-ui, sans-serif';
  ctx.fillText('curated by', W - pad - 36, sigY + 6);

  ctx.fillStyle = '#f3eeff';
  ctx.font = 'italic 500 32px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(opts.curator, W - pad - 36, sigY + 32);

  ctx.fillStyle = hexToRgba(opts.accent, 0.9);
  ctx.font = '500 20px "Inter", system-ui, sans-serif';
  ctx.fillText(`${opts.domain} · a small thought`, W - pad - 36, sigY + 80);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}
