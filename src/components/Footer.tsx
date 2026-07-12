export default function Footer() {
  return (
    <footer className="border-t border-paper/10 bg-void">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-10 font-mono text-xs uppercase tracking-[0.2em] text-paper/40 md:flex-row md:items-center md:justify-between md:px-12">
        <span>
          © {new Date().getFullYear()} Idea Software Spot S.R.L.
        </span>
        <span>Website-uri & marketing digital — România</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-electric">Instagram</a>
          <a href="#" className="hover:text-electric">LinkedIn</a>
          <a href="#" className="hover:text-electric">TikTok</a>
        </div>
      </div>
    </footer>
  )
}
