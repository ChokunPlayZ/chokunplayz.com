import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import { Preloader } from '../components/Preloader'
import { ThemeProvider } from '../components/ThemeProvider'
import appCss from '../styles.css?url'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { --bg-primary: #f0f9ff; }
          @media (prefers-color-scheme: dark) { :root { --bg-primary: #0f172a; } }
          [data-theme='dark'] { --bg-primary: #0f172a; }
          #global-preloader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            background-color: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <ThemeProvider>
      <Preloader />
      <Outlet />
    </ThemeProvider>
  )
}

import { NotFound } from '../components/NotFound'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Chokun - Fullstack Engineer',
      },
      {
        name: 'description',
        content:
          'Self-taught fullstack engineer from Thailand. Passionate about technology, infrastructure, and engineering.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})
