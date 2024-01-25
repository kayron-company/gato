import Image from "next/image"
import Link from "next/link"
import ThemeToggle from "components/layout/ThemeToggle/theme-toggle"
import { cn } from "lib/utils"
import { MobileSidebar } from "./mobile-sidebar"
import { UserNav } from "./user-nav"

export default function Header() {
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed inset-x-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href="/" target="_blank">
            <Image src={"/logo.svg"} width={1000} height={1000} className="mx-auto h-11 w-auto" alt="Raise Talk" />
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  )
}
