import Head from "next/head"
import type { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title = "Lead Capture System" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Lead Capture System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

