import Link from 'next/link';

export function PremiumFooter() {
  return (
    <>
      {/* Desktop footer */}
      <footer className="hidden md:block bg-primary text-white py-16 px-margin-mobile md:px-margin-desktop border-t border-white/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-white/70">
              The creative economy hub empowering the global digital generation through music, tasks, and community.
            </p>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">PLATFORM</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Earn Coins</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/music">Stream Music</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Contests</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-6">COMMUNITY</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
              <li><Link className="hover:text-secondary-fixed transition-colors" href="/articles">Articles</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold mb-4">LEGAL</h5>
            <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
              <li><Link className="hover:text-white transition-colors" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/terms">Terms of Service</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center font-body-sm text-body-sm text-white/70 gap-4">
          <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          <div className="flex gap-6">
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="cursor-pointer hover:text-secondary-fixed transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile footer */}
      <footer className="md:hidden bg-primary text-white py-16 pb-20 px-margin-mobile border-t border-white/10">
        <div className="max-w-container-max mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-4">
            <img src="/logo.png" alt="CMPapp" className="h-10 w-auto" />
            <p className="font-body-sm text-body-sm text-white/70 max-w-xs">
              The creative economy hub empowering the global digital generation through music, tasks, and community.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-4">PLATFORM</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/tasks">Earn Coins</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/music">Stream Music</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/contests">Contests</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-4">COMMUNITY</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/referrals">Referral Program</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/articles">Articles</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-label-caps text-label-caps text-secondary-fixed mb-4">LEGAL</h5>
              <ul className="space-y-3 font-body-sm text-body-sm text-white/70">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/privacy">Privacy</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/terms">Terms</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-4 font-body-sm text-body-sm text-white/70">
            <div>© 2024 CMPapp. Built for the Creative Revolution.</div>
          </div>
        </div>
      </footer>
    </>
  );
}
