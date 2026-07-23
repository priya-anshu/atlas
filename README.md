# Atlas

Atlas is a mobile-friendly study library for standalone HTML notes, formula sheets, and previous-year questions. Each document is rendered as-is, so HTML files that use KaTeX, Three.js, Tailwind CDN, or other client-side libraries continue to work normally.

## Add study material

Use this folder pattern:

```text
public/content/
  class-12/
    physics/
      notes/
      formulas/
      pyq/
    chemistry/
      notes/
      formulas/
      pyq/
  class-11/
    maths/
      notes/
      formulas/
      pyq/
```

Your current Physics content lives in `public/content/class-12/physics`. Add each new `.html` file to the right class, subject, and material-type folder. Folder names become the navigation labels automatically, so `class-11/biology` appears as **Class 11 → Biology** with no code changes.

Nested folders inside `notes`, `formulas`, and `pyq` are supported. Atlas discovers all HTML files automatically, turns filenames into readable titles, and sorts a numeric prefix first. For example, `01_electric_charges.html` appears before `02_electrostatics.html`. No code changes or manual registry are needed.

Run `npm run dev` while creating content. Before publishing, run `npm run build`; the new files are indexed into the deployment during the build.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Publish

Set `NEXT_PUBLIC_SITE_URL` to your final public origin before deployment. This gives the generated metadata, `robots.txt`, and `sitemap.xml` the correct canonical URL.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
npm run build
```

The app includes a web manifest, generated app icons, an Open Graph image, and a service worker. On supported browsers, the **Install app** button appears once the install criteria are met.
