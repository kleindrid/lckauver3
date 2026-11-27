/**
 * Resolves static asset URLs to respect Vite's base path.
 * When deployed to GitHub Pages (e.g. https://<user>.github.io/<repo>/),
 * root-absolute URLs like '/assets/...' would fail because they point to
 * the user domain root instead of the repository subdirectory.
 */
export function resolveAssetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const cleanPath = url.replace(/^(?:\.\/|\/)+/, '');
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}
