import Link from "next/link";
import Script from "next/script";
import { Bug } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <Bug className="w-6 h-6 text-violet-600" />
              Bugsy
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/home#features" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Docs
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
                Login
              </Link>
              <Link
                href="/get-started"
                className="inline-flex items-center px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <Link
                href="/get-started"
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-lg text-white mb-4">
                <Bug className="w-5 h-5 text-violet-400" />
                Bugsy
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered bug reporting and resolution. Let your users fix bugs for you.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/home#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/get-started" className="hover:text-white transition-colors">Quick Start</Link></li>
                <li><Link href="/docs#api-reference" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/docs#mcp-server-setup" className="hover:text-white transition-colors">MCP Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com" className="hover:text-white transition-colors">GitHub</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Bugsy. All rights reserved.</p>
            <p className="text-sm">Built by <span className="text-white font-medium">Great Web Development</span></p>
          </div>
        </div>
      </footer>
      {/* Live Bugsy Widget */}
      <Script src="/widget/bugsy-widget.js" strategy="lazyOnload" />
      <Script id="bugsy-init" strategy="lazyOnload">
        {`if (window.Bugsy) { window.Bugsy.init({ apiUrl: window.location.origin, primaryColor: '#7c3aed', greeting: "Hi! I'm Bugsy 🐛 Try me out — report a bug, request a feature, or upload a screenshot. This is a live demo!" }); }`}
      </Script>
    </div>
  );
}
