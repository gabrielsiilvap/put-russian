import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function SunMoon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M21 12.8A8 8 0 1 1 11.2 3a6 6 0 0 0 9.8 9.8z" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

const navItem =
  "press rounded-full px-2 py-1.5 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm";

export function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <header className="border-b border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4">
          <NavLink to="/" className="font-display flex-none text-xl font-bold tracking-tight">
            ПУТЬ
          </NavLink>
          <nav className="flex min-w-0 items-center gap-0.5 sm:gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/review"
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
              }
            >
              Review
            </NavLink>
            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/15" : "hover:bg-white/10"}`
              }
            >
              Progress
            </NavLink>
            <button
              type="button"
              onClick={toggle}
              className="press ml-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <SunMoon dark={theme === "dark"} />
            </button>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
