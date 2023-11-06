export default function Head(state) {
  const { store = {} } = state;

  const title = store.title || 'Automate your outgoing webmentions';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>

        <link rel="icon" sizes="192x192" href="/_public/favicon.png">
        <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet">
        <link href="/_public/style.css" rel="stylesheet">

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta
          hid="description"
          name="description"
          content="Platform agnostic outgoing webmention service"
       >
        <meta name="twitter:creator" content="@rem">
        <meta
          name="twitter:title"
          content="Automate your outgoing webmentions"
       >
        <meta name="twitter:site" content="@rem">
        <meta name="twitter:domain" content="webmention.app">
        <meta
          name="twitter:image:src"
          content="https://webmention.app/_public/webmention-app-card.jpg"
       >
        <meta name="twitter:card" content="summary_large_image">
      </head>
    </html>
  `;
}
