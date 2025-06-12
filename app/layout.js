import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "../components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Book Management Dashboard",
  description: "A comprehensive dashboard for managing books",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
         <div className="min-h-screen bg-neutral-50">
  <header className=" border-b">
    <div className="container mx-auto px-4 py-4 flex items-center gap-4">
<img src="/book-logo.jpg" alt="Logo" className="h-16 w-40 object-cover rounded" />
     </div>
  </header>
  <main className="container mx-auto px-4 py-8">{children}</main>
</div>

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
