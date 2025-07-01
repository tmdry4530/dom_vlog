import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-50">
      <Sidebar />
      <MainContent />
    </div>
  )
}
