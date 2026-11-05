// Scrolls to the on-site AI teacher and focuses its input. Never leaves the site.
export function openTeacher(e?: { preventDefault: () => void }) {
  e?.preventDefault();
  const section = document.getElementById('ai-teacher');
  if (!section) return;
  window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  if (window.location.hash !== '#ai-teacher') window.history.replaceState(null, '', '#ai-teacher');
  window.setTimeout(() => {
    section.querySelector<HTMLTextAreaElement>('textarea')?.focus({ preventScroll: true });
  }, 600);
}
