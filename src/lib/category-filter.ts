export function initCategoryFilter(
  pillContainerSelector: string,
  itemSelector: string,
  pillSelector = '.category-pill',
): void {
  const pills = document.querySelectorAll<HTMLButtonElement>(`${pillContainerSelector} ${pillSelector}`);
  const items = document.querySelectorAll<HTMLElement>(itemSelector);

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-category');
      pills.forEach((p) => {
        p.classList.remove('category-pill--active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('category-pill--active');
      pill.setAttribute('aria-pressed', 'true');

      items.forEach((item) => {
        const cats = item.getAttribute('data-categories') || '';
        item.hidden = cat !== 'All' && !cats.split(',').map((c) => c.trim()).includes(cat);
      });
    });
  });
}
