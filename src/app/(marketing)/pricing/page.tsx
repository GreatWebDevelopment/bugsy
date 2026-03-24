import Link from "next/link";
import { Check, Server, Cloud, Building2 } from "lucide-react";

const tiers = [
  {
    name: "Free / Self-Hosted",
    icon: Server,
    price: "Free",
    priceSub: "forever",
    description: "Open source. Deploy on your own infrastructure.",
    cta: "Get Started",
    ctaHref: "/get-started",
    highlight: true,
    features: [
      "Unlimited requests",
      "Unlimited users",
      "Embeddable chat widget",
      "AI triage & categorization",
      "MCP developer tools",
      "Approval workflow",
      "Full source code access",
      "Community support",
    ],
  },
  {
    name: "Cloud",
    icon: Cloud,
    price: "$29",
    priceSub: "/month",
    description: "Managed hosting so you can focus on building.",
    cta: "Coming Soon",
    ctaHref: "#",
    highlight: false,
    badge: "Coming Soon",
    features: [
      "Everything in Free, plus:",
      "Managed infrastructure",
      "Automatic updates",
      "SSL & custom domains",
      "Daily backups",
      "Email notifications",
      "Priority email support",
      "99.9% uptime SLA",
    ],
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    priceSub: "",
    description: "For teams that need dedicated support and SLAs.",
    cta: "Coming Soon",
    ctaHref: "#",
    highlight: false,
    badge: "Coming Soon",
    features: [
      "Everything in Cloud, plus:",
      "Custom deployment options",
      "SSO / SAML integration",
      "Dedicated account manager",
      "Priority support with SLA",
      "Custom integrations",
      "Security review & audit",
      "Volume licensing",
    ],
  },
];

export default function PricingPage() {
  return (
    <section className="py-24 bg-gradient-to-b from-violet-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Start free with self-hosting. Upgrade when you need managed
            infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.highlight
                  ? "border-violet-300 shadow-xl shadow-violet-100 ring-2 ring-violet-600"
                  : "border-gray-200"
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {tier.badge}
                </span>
              )}
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <tier.icon className="w-8 h-8 text-violet-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  {tier.price}
                </span>
                {tier.priceSub && (
                  <span className="text-gray-500 text-sm ml-1">
                    {tier.priceSub}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaHref}
                className={`block text-center py-3 rounded-full font-semibold text-sm transition-colors ${
                  tier.highlight
                    ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200"
                    : tier.badge
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
