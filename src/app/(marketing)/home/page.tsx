import Link from "next/link";
import {
  MessageSquare,
  Brain,
  Plug,
  ShieldCheck,
  Code2,
  MessagesSquare,
  Zap,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  TestTube2,
  UserCheck,
  GitPullRequest,
  Camera,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Open Source &middot; AI-Powered
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                Let your users{" "}
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  fix bugs
                </span>{" "}
                for you
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-lg">
                Bugsy is an AI-powered chat widget that collects bug reports and
                feature requests, then lets AI developers resolve them
                automatically.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/get-started"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-violet-600 text-white font-semibold text-base hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/home#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-base hover:border-violet-300 hover:text-violet-700 transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Mock widget preview */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-400 to-purple-400 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-w-sm ml-auto">
                <div className="bg-violet-600 px-5 py-4 flex items-center justify-between">
                  <span className="text-white font-semibold flex items-center gap-2 text-sm">
                    <span className="text-lg">&#x1F41B;</span> Bugsy
                  </span>
                  <span className="text-white/60 text-lg">&times;</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-100 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[80%]">
                    Hi! I&apos;m Bugsy. I can help you report bugs or request features. How can I help?
                  </div>
                  <div className="bg-violet-600 text-white rounded-xl rounded-tr-sm px-4 py-2.5 text-sm ml-auto max-w-[80%]">
                    The dashboard page crashes when I click &quot;Export&quot;
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[80%]">
                    That sounds like a bug. Can you share a screenshot of the error?
                  </div>
                  {/* Screenshot upload preview */}
                  <div className="ml-auto max-w-[85%]">
                    <div className="bg-violet-600 text-white rounded-xl rounded-tr-sm px-4 py-2 text-sm mb-1.5">
                      Here&apos;s what I see:
                    </div>
                    <div className="bg-violet-600/10 border border-violet-200 rounded-xl p-2 rounded-tr-sm">
                      <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                          <span className="text-gray-500 text-[10px] ml-1">dashboard/export</span>
                        </div>
                        <div className="text-red-400">TypeError: Cannot read properties</div>
                        <div className="text-red-400/70">of undefined (&apos;map&apos;)</div>
                        <div className="text-gray-600 mt-1">at ExportButton.tsx:42</div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <Camera className="w-3 h-3 text-violet-400" />
                        <span className="text-[10px] text-violet-500 font-medium">screenshot-export-error.png</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 max-w-[80%]">
                    Thanks! I can see the error. Click <span className="font-semibold text-violet-600">&quot;Submit Feedback&quot;</span> when you&apos;re ready and I&apos;ll send this to the team.
                  </div>
                </div>
                {/* Submit feedback button */}
                <div className="px-4 pb-2">
                  <div className="border border-violet-300 text-violet-600 text-xs font-medium text-center py-1.5 rounded-lg cursor-default">
                    &#x1F4DD; Submit Feedback
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-gray-400 text-sm cursor-default">
                    &#x1F4F7;
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400">
                    Type a message...
                  </div>
                  <div className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
                    Send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
              Everything you need to squash bugs faster
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              From collection to resolution, Bugsy handles the entire bug
              lifecycle with AI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Embeddable Widget",
                desc: "Drop a single script tag on your site. Users chat with Bugsy to report issues naturally.",
              },
              {
                icon: Brain,
                title: "AI-Powered Triage",
                desc: "Bugsy asks clarifying questions, categorizes issues, and prioritizes automatically.",
              },
              {
                icon: Smartphone,
                title: "TestFlight Integration",
                desc: "Beta tester feedback from TestFlight flows directly into Bugsy. Screenshots, crash logs, and all.",
              },
              {
                icon: Plug,
                title: "MCP Developer Tools",
                desc: "AI agents connect via MCP to pull requests and submit solutions programmatically.",
              },
              {
                icon: ShieldCheck,
                title: "Approval Workflow",
                desc: "Auto-approve trusted testers or require manual review before changes ship.",
              },
              {
                icon: GitPullRequest,
                title: "End-to-End Resolution",
                desc: "From user report to code fix to approval — the entire loop, automated by AI.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-5 group-hover:bg-violet-600 transition-colors">
                  <f.icon className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold">
              Three steps to bug-free
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Get from zero to automated bug resolution in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Code2,
                step: "01",
                title: "Embed",
                desc: "Add the widget to your site with one line of code. No build step required.",
              },
              {
                icon: MessagesSquare,
                step: "02",
                title: "Collect",
                desc: "Users report bugs and features through conversational chat. AI triages automatically.",
              },
              {
                icon: Zap,
                step: "03",
                title: "Resolve",
                desc: "AI developers claim requests and submit fixes via MCP. Approve and ship.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <span className="text-6xl font-black text-violet-500/20 absolute -top-6 -left-2">
                  {s.step}
                </span>
                <div className="relative pt-8">
                  <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-5">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TestFlight Integration */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <TestTube2 className="w-3.5 h-3.5" />
                TestFlight Integration
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                Beta feedback,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  automatically resolved
                </span>
              </h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                Connect your App Store Connect account and Bugsy pulls in every
                screenshot and crash report your TestFlight testers submit. AI
                categorizes and prioritizes each one — and trusted testers can
                have their feedback go straight to your AI developers, no manual
                review needed.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Smartphone, text: "Screenshot & crash feedback synced automatically via webhook or on-demand" },
                  { icon: UserCheck, text: "Auto-approve rules for trusted testers — their feedback skips the queue" },
                  { icon: Brain, text: "AI categorizes as bug/feature and sets priority from crash logs and context" },
                  { icon: Zap, text: "Authorized feedback goes straight to AI developers for immediate resolution" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TestFlight flow diagram */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-violet-400 rounded-3xl blur-2xl opacity-10" />
              <div className="relative bg-gray-950 rounded-2xl p-8 text-sm font-mono">
                <div className="text-gray-500 mb-4"># TestFlight feedback pipeline</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-blue-400">TestFlight tester</span>
                    <span className="text-gray-600">submits feedback</span>
                  </div>
                  <div className="pl-5 border-l-2 border-gray-800 ml-[3px] py-1">
                    <span className="text-gray-500">↓ webhook / sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-violet-400">Bugsy</span>
                    <span className="text-gray-600">ingests &amp; AI categorizes</span>
                  </div>
                  <div className="pl-5 border-l-2 border-gray-800 ml-[3px] py-1">
                    <span className="text-gray-500">↓ auto-approve check</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-green-400">Authorized?</span>
                    <span className="text-green-400/70">→ APPROVED instantly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-yellow-400">Not authorized?</span>
                    <span className="text-yellow-400/70">→ Queued for review</span>
                  </div>
                  <div className="pl-5 border-l-2 border-gray-800 ml-[3px] py-1">
                    <span className="text-gray-500">↓ MCP tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400">AI developer</span>
                    <span className="text-gray-600">claims &amp; resolves</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social proof */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { stat: "10x", label: "Faster bug resolution" },
              { stat: "Zero", label: "Setup required" },
              { stat: "Any", label: "Tech stack supported" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-5xl font-extrabold mb-2">{s.stat}</div>
                <div className="text-violet-100 text-lg">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
            Ready to let AI handle your bugs?
          </h2>
          <p className="text-lg text-gray-500 mb-10">
            Bugsy is free, open source, and ready to deploy. Get started in
            under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
            >
              <CheckCircle2 className="mr-2 w-5 h-5" />
              Get Started Free
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-violet-300 hover:text-violet-700 transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
