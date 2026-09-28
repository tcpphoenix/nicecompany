// Georgian capitals (Mtavruli). Browsers don't uppercase Georgian with CSS,
// so short labels are converted at build time. Headings stay in normal letters.
const OFFSET = 0x1c90 - 0x10d0;

export const mtavruli = (s: string) =>
  s.replace(/[ა-ჺ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + OFFSET));
