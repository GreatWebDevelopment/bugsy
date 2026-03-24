import Link from "next/link";
import {
  Download,
  Database,
  UserPlus,
  Code2,
  Plug,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 text-green-400 rounded-xl p-5 overflow-x-auto text-sm font-mono leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

const steps = [
  {
    number: 1,
    icon: Download,
    title: "Clone & Install",
    description: "Clone the repository and install dependencies.",
    code: `git clone https://github.com/greatwebdevelopment/bugsy.git
cd bugsy
npm install`,
  },
  {
    number: 2,
    icon: Database,
    title: "Configure Database",
    description:
      "Create a PostgreSQL database and set up your environment variables.",
    code: `# Create the database
createdb bugsy

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/bugsy"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
EOF

# Run migrations
npx prisma migrate dev
npx prisma generate`,
  },
  {
    number: 3,
    icon: UserPlus,
    title: "Create Admin User",
    description:
      "Use the setup endpoint to create your first admin account. Then start the dev server.",
    code: `# Start the server
npm run dev

# In another terminal, create admin user
curl -X POST http://localhost:3000/api/setup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "your-secure-password"
  }'`,
  },
  {
    number: 4,
    icon: Code2,
    title: "Embed the Widget",
    description:
      "Add the Bugsy widget to any website. Users will be able to chat and report bugs immediately.",
    code: `<script src="http://localhost:3000/widget.js"></script>
<script>
  Bugsy.init({
    apiUrl: "http://localhost:3000",
    position: "bottom-right",
    primaryColor: "#7c3aed",
    greeting: "Found a bug? I can help!"
  });
</script>`,
  },
  {
    number: 5,
    icon: Plug,
    title: "Connect AI Developers",
    description:
      "Generate an API token in the dashboard, then configure your AI agent (e.g. Claude Code) to connect via MCP.",
    code: `// Add to ~/.claude.json
{
  "mcpServers": {
    "bugsy": {
      "command": "node",
      "args": ["/path/to/bugsy/mcp/index.js"],
      "env": {
        "BUGSY_API_URL": "http://localhost:3000",
        "BUGSY_API_TOKEN": "your-developer-api-token"
      }
    }
  }
}`,
  },
];

export default function GetStartedPage() {
  return (
    <section className="py-24 bg-gradient-to-b from-violet-50/50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Get Started with Bugsy
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Go from zero to AI-powered bug resolution in 5 steps.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {step.number < steps.length && (
                <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-violet-300 to-transparent hidden sm:block" />
              )}

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-violet-200">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-5 h-5 text-violet-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <CodeBlock>{step.code}</CodeBlock>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Done */}
        <div className="mt-20 text-center p-10 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-extrabold mb-3">
            You&apos;re all set!
          </h2>
          <p className="text-violet-100 mb-8 max-w-md mx-auto">
            Bugsy is now collecting bug reports from users and AI developers can
            resolve them via MCP. Head to the dashboard to manage everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
            >
              Read the Docs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
