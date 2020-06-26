export function GoogleAnalyticsScript() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-150413053-4" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-150413053-4');
          `,
        }}
      />
    </>
  );
}
