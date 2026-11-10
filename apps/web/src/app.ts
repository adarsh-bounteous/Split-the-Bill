export const APP_TITLE = 'Split the Bill';

export function render(root: HTMLElement): void {
  root.innerHTML = `
    <main>
      <h1>${APP_TITLE}</h1>
      <p>Add people, record expenses, and see who pays whom.</p>
    </main>
  `;
}
