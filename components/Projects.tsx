"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  X,
  Terminal,
  Cpu,
  Code,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  logo: string;
  projectImage: string;
  links: { type: "globe" | "github"; url: string }[];
  technologies: { name: string; icon: string }[];
  status: "live" | "wip" | "soon";
  year: string;
  features: string[];
  architecture: string;
  codeSnippet: {
    filename: string;
    language: string;
    code: string;
  };
}

const projects: Project[] = [
  {
    id: "2",
    title: "Airpay",
    description:
      "A Cloudflare Workers-based crypto payment gateway for stablecoins. Webhooks, hosted checkout, and SDKs for Python, Go, Node, and Rust — like Stripe, but for crypto.",
    longDescription:
      "Airpay is a crypto-native payment gateway built on Cloudflare Workers that lets merchants accept stablecoins (USDC, USDT) and other cryptocurrencies with the same developer ergonomics as Stripe. It exposes a hosted payment page, signed webhooks for settlement confirmation, and idiomatic SDKs for Python, Go, Node.js, and Rust — so teams can integrate onchain payments without touching wallet code. Built edge-first for global low-latency and zero-cold-start performance.",
    image:
      "linear-gradient(135deg, rgb(2, 3, 4) 0%, rgb(245, 68, 33) 100%)",
    projectImage: "/airpay.png",
    logo: "https://api.dicebear.com/7.x/pixel-art/svg?seed=server",
    links: [
      {
        type: "globe",
        url: "https://airpay-frontend.arindam92.workers.dev/",
      },
      { type: "github", url: "#" },
    ],
    technologies: [
      {
        name: "Cloudflare Workers",
        icon: "https://cdn.simpleicons.org/cloudflare/F38020",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.simpleicons.org/typescript/3178C6",
      },
      {
        name: "Rust",
        icon: "https://cdn.simpleicons.org/rust/FFFFFF",
      },
      {
        name: "Go",
        icon: "https://cdn.simpleicons.org/go/00ADD8",
      },
    ],
    status: "live",
    year: "2024",
    features: [
      "Hosted checkout page with stablecoin & crypto support",
      "Signed webhooks for payment settlement events",
      "SDKs for Python, Go, Node.js, and Rust",
      "Edge-deployed on Cloudflare Workers for global low latency",
    ],
    architecture:
      "An edge-first payment gateway running on Cloudflare Workers. Payment intents and settlements are reconciled onchain via signed webhooks, while the hosted checkout page abstracts wallet interaction away from merchants. Language-specific SDKs wrap the REST API so Python, Go, Node, and Rust clients share one consistent interface.",
    codeSnippet: {
      filename: "sdk/node/src/airpay.ts",
      language: "typescript",
      code: `import { Airpay } from "airpay";

const airpay = new Airpay(process.env.AIRPAY_SECRET_KEY!);

// Create a hosted checkout session for a stablecoin payment
const session = await airpay.checkout.sessions.create({
  amount: 4900,
  currency: "usd",
  settlement_currency: "usdc",
  metadata: { order_id: "ord_8123" },
  success_url: "https://shop.example.com/thanks",
});

// Verify the signed webhook when the payment settles
export async function POST(req: Request) {
  const event = airpay.webhooks.verify(
    await req.text(),
    req.headers.get("airpay-signature")!,
  );
  if (event.type === "payment.settled") {
    await fulfillOrder(event.data.metadata.order_id);
  }
  return Response.json({ received: true });
}`,
    },
  },
  {
    id: "4",
    title: "Toolkit",
    description:
      "A suite of developer tools — PDF↔Docs conversion, image editing, and doc utilities — exposed over MCP so AI agents can send data in and get results back.",
    longDescription:
      "Toolkit is a collection of practical tools — PDF to Docs conversion, image editing (crop, compress, convert, OCR), and document utilities — exposed through a unified Model Context Protocol (MCP) interface. Because every tool speaks MCP, AI agents can call them directly: send a file in, get the processed result back, with no clipboard copy-paste or manual UI steps. Designed as a composable toolbox that turns repetitive file chores into agent-driven workflows.",
    image:
      "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
    projectImage: "/toolkit.png",
    logo: "https://api.dicebear.com/7.x/heart/svg?seed=love",
    links: [
      {
        type: "globe",
        url: "https://toolkit-wine.vercel.app/",
      },
    ],
    technologies: [
      {
        name: "MCP",
        icon: "https://cdn.simpleicons.org/anthropic/D97757",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.simpleicons.org/typescript/3178C6",
      },
      {
        name: "Node.js",
        icon: "https://cdn.simpleicons.org/nodedotjs/339933",
      },
      {
        name: "Python",
        icon: "https://cdn.simpleicons.org/python/3776AB",
      },
    ],
    status: "soon",
    year: "2025",
    features: [
      "PDF ↔ Docs conversion, image editing, and document utilities",
      "Every tool exposed over Model Context Protocol (MCP)",
      "AI agents can submit data and receive processed results directly",
      "Composable toolbox — chain tools into agent-driven workflows",
    ],
    architecture:
      "A unified MCP server fronts every tool as a discoverable, typed resource. Each tool — PDF conversion, image editing, doc utilities — runs as an isolated worker that accepts input through MCP calls and streams the processed output back. Agents enumerate available tools, invoke them with structured arguments, and receive results without touching a UI.",
    codeSnippet: {
      filename: "src/mcp/tools/pdf-to-docs.ts",
      language: "typescript",
      code: `import { McpServer } from "@modelcontextprotocol/sdk/server";
import { pdfToDocs } from "../converters/pdf-docs";

const mcp = new McpServer({ name: "toolkit", version: "1.0.0" });

// Expose PDF -> Docs conversion as an agent-callable tool
mcp.tool(
  "pdf_to_docs",
  { pdf: "string", opts: { format: "string" } },
  async ({ pdf, opts }) => {
    const docx = await pdfToDocs(Buffer.from(pdf, "base64"), opts);
    return {
      content: [{
        type: "resource",
        resource: { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", blob: docx.toString("base64") }
      }]
    };
  }
);`,
    },
  },
];

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl bg-card border border-border hover:border-border-hover transition-all duration-500 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_0_50px_-20px_rgba(255,255,255,0.08)] cursor-pointer h-full"
    >
      {/* Terminal Top Bar */}
      <div className="h-9 bg-muted/30 border-b border-border px-4 flex items-center justify-between select-none">
        {/* Terminal Dots */}
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500/40 dark:bg-red-500/20 group-hover:bg-red-500/60 dark:group-hover:bg-red-500/40 transition-colors" />
          <span className="w-2 h-2 rounded-full bg-amber-500/40 dark:bg-amber-500/20 group-hover:bg-amber-500/60 dark:group-hover:bg-amber-500/40 transition-colors" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/40 dark:bg-emerald-500/20 group-hover:bg-emerald-500/60 dark:group-hover:bg-emerald-500/40 transition-colors" />
        </div>
        {/* File Name */}
        <span className="font-mono text-[9px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors tracking-wide">
          {project.codeSnippet.filename}
        </span>
      </div>

      <div className="p-6 md:p-7 flex flex-col h-full z-10 bg-transparent relative">
        {/* Header Section */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-foreground/90 group-hover:text-foreground transition-colors tracking-tight">
                {project.title}
              </h3>
              {project.status === "live" ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ) : project.status === "wip" ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
              {project.year}
            </span>
          </div>

          {/* External Links */}
          <div className="flex gap-1.5">
            {project.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border hover:border-border-hover transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {link.type === "globe" ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <Github className="w-3.5 h-3.5" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs md:text-sm leading-relaxed text-muted-foreground mb-5">
          {project.description}
        </p>

        {/* Micro terminal output details (Always dark for premium programmer look) */}
        <div className="mb-6 p-3 rounded-lg bg-zinc-900 dark:bg-black/30 border border-zinc-800 dark:border-white/[0.02] font-mono text-[10px] text-zinc-400 dark:text-zinc-500 flex flex-col gap-1.5 select-none">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">
              $ cat stats.log
            </span>
            <span className="text-zinc-600 dark:text-zinc-700">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300 dark:text-zinc-400">
            <span className="text-emerald-400">✓</span>
            <span className="truncate">
              {project.features[0]}
            </span>
          </div>
        </div>

        <div className="flex-grow" />

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-4">
          {project.technologies.map((tech) => (
            <span
              key={tech.name}
              className="px-2 py-0.5 rounded bg-muted/50 border border-border text-[9px] font-mono text-muted-foreground"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Brand Gradient Accent Underline */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] opacity-20 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: project.image }}
      />
    </div>
  );
};

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const HighlightedCode = ({ code }: { code: string }) => {
  const tokenRegex =
    /(\/\/.*|#\[.*?\]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+\b|\b(?:import|from|const|let|async|await|fn|pub|use|return|function|export|struct|impl|mut|match|if|else|new)\b|\b(?:String|Result|AudioResponse|Client|Databases|McpServer|Stripe|Airpay|Buffer|Response|Array|number|string|boolean|void|any|Record)\b|\b\w+(?=\()|[\w]+|[^\s\w]+|\s+)/g;

  const tokens: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(code)) !== null) {
    tokens.push(match[0]);
  }

  const keywords = new Set([
    "import",
    "from",
    "const",
    "let",
    "async",
    "await",
    "fn",
    "pub",
    "use",
    "return",
    "function",
    "export",
    "struct",
    "impl",
    "mut",
    "match",
    "if",
    "else",
    "new",
  ]);

  const types = new Set([
    "String",
    "Result",
    "AudioResponse",
    "Client",
    "Databases",
    "McpServer",
    "Stripe",
    "Airpay",
    "Buffer",
    "Response",
    "Array",
    "number",
    "string",
    "boolean",
    "void",
    "any",
    "Record",
  ]);

  return (
    <code
      className="text-[10px] leading-relaxed font-mono block whitespace-pre"
      style={{
        fontSize: "10.5px",
        lineHeight: "1.65",
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      {tokens.map((token, i) => {
        if (token.startsWith("//")) {
          return (
            <span key={i} className="text-zinc-500">
              {token}
            </span>
          );
        }
        if (token.startsWith("#[")) {
          return (
            <span
              key={i}
              className="text-purple-400 font-semibold"
            >
              {token}
            </span>
          );
        }
        if (
          token.startsWith('"') ||
          token.startsWith("'") ||
          token.startsWith("`")
        ) {
          return (
            <span key={i} className="text-emerald-400">
              {token}
            </span>
          );
        }
        if (/^\d+$/.test(token)) {
          return (
            <span key={i} className="text-blue-400">
              {token}
            </span>
          );
        }
        if (keywords.has(token)) {
          return (
            <span
              key={i}
              className="text-rose-400 font-semibold"
            >
              {token}
            </span>
          );
        }
        if (types.has(token)) {
          return (
            <span key={i} className="text-amber-400">
              {token}
            </span>
          );
        }
        const isFunction =
          i < tokens.length - 1 && tokens[i + 1] === "(";
        if (isFunction && /^[a-zA-Z_]\w*$/.test(token)) {
          return (
            <span key={i} className="text-sky-400">
              {token}
            </span>
          );
        }

        return (
          <span key={i} className="text-zinc-300">
            {token}
          </span>
        );
      })}
    </code>
  );
};

const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "code" | "architecture"
  >("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-transparent backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="relative w-full sm:max-w-4xl bg-card sm:rounded-3xl border sm:border border-border shadow-2xl h-[90vh] sm:h-[600px] flex flex-col md:flex-row overflow-hidden z-10"
          >
            {/* Left Pane - System & Overview Metrics */}
            <div className="w-full md:w-72 shrink-0 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-6 md:p-8 flex flex-col justify-between font-mono select-none">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-display font-bold tracking-tight text-zinc-800 dark:text-white text-sm">
                    PROJECT INSPECTOR
                  </span>
                </div>

                {/* Tech Spec List */}
                <div className="flex flex-col gap-4 border-t border-border pt-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      // SYSTEM_ID
                    </span>
                    <span className="text-xs text-foreground/90 font-semibold">
                      {project.title.toLowerCase()}-v1.0.0
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      // YEAR
                    </span>
                    <span className="text-xs text-foreground/90 font-semibold">
                      {project.year}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      // STACK_PRIMARY
                    </span>
                    <span className="text-xs text-foreground/90 font-semibold">
                      {project.technologies[0]?.name ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      // RUN_STATUS
                    </span>
                    <span className="text-xs flex items-center gap-1.5 font-semibold">
                      {project.status === "live" ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-600 dark:text-emerald-400 uppercase">
                            ONLINE / LIVE
                          </span>
                        </>
                      ) : project.status === "wip" ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-amber-600 dark:text-amber-400 uppercase">
                            COMPILING / WIP
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-blue-600 dark:text-blue-400 uppercase">
                            QUEUED / SOON
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Links */}
              <div className="flex flex-col gap-3 border-t border-border pt-6 mt-6 md:mt-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  // ENDPOINTS
                </span>
                <div className="flex flex-col gap-2">
                  {project.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between px-3.5 py-2 bg-muted/50 border border-border hover:border-border-hover text-xs text-muted-foreground hover:text-foreground rounded-lg transition-all"
                    >
                      <span className="flex items-center gap-2">
                        {link.type === "github" ? (
                          <Github className="w-3.5 h-3.5" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                        {link.type === "github"
                          ? "Repository"
                          : "Live Demo"}
                      </span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            </div>{" "}
            {/* Right Content Pane - Code & Description */}
            <div className="flex-grow flex flex-col h-full bg-card overflow-hidden relative">
              {/* Header Tabs */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-border shrink-0 bg-card gap-2">
                <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none min-w-0 pr-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                      activeTab === "overview"
                        ? "bg-muted text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 hidden sm:block" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                      activeTab === "code"
                        ? "bg-muted text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 hidden sm:block" />
                    <span>Source</span>
                  </button>
                  <button
                    onClick={() =>
                      setActiveTab("architecture")
                    }
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-mono font-semibold rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                      activeTab === "architecture"
                        ? "bg-muted text-foreground border border-border"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5 hidden sm:block" />
                    <span>Architecture</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-border hover:border-border-hover flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inner Container */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-card">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-display font-extrabold text-foreground">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed mt-2.5">
                        {project.longDescription}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div className="border-t border-border pt-6">
                      <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block mb-3.5">
                        // Key Engineering Highlights
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {project.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/30 border border-border"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-xs text-foreground/90 leading-normal">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "code" && (
                  <div className="flex flex-col h-full rounded-xl border border-zinc-800 dark:border-white/5 bg-zinc-900 dark:bg-zinc-900/50 overflow-hidden font-mono text-xs">
                    {/* File tab header (Always dark for code editors) */}
                    <div className="bg-zinc-950 dark:bg-zinc-900 px-4 py-2 border-b border-zinc-800 dark:border-white/5 flex items-center justify-between text-zinc-500 select-none">
                      <span className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                        {project.codeSnippet.filename}
                      </span>
                      <span className="text-[9px] uppercase bg-white/[0.04] px-2 py-0.5 rounded text-zinc-400">
                        {project.codeSnippet.language}
                      </span>
                    </div>
                    {/* Code content */}
                    <div className="p-4 overflow-x-auto leading-relaxed text-zinc-200 dark:text-zinc-300 whitespace-pre overflow-y-auto max-h-[300px]">
                      <HighlightedCode
                        code={project.codeSnippet.code}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "architecture" && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block mb-2">
                        // System Topography &
                        Infrastructure
                      </span>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Architectural Blueprint
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.architecture}
                      </p>
                    </div>

                    <div className="border-t border-border pt-6">
                      <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block mb-3">
                        // Active Stack Dependencies
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(
                          (tech) => (
                            <div
                              key={tech.name}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border text-xs text-foreground/90"
                            >
                              <Image
                                src={tech.icon}
                                alt={tech.name}
                                width={12}
                                height={12}
                                className="w-3 h-3 object-contain"
                                unoptimized
                              />
                              <span>{tech.name}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="projects"
      className="mt-28 md:mt-36 w-full scroll-mt-24"
    >
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 mb-4">
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
              // repositories
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tighter text-foreground mb-3">
            Featured Work
          </h2>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
            A collection of products and tools I've built,
            focusing on speed, performance, and engineering.
          </p>
        </div>
        <a
          href="https://github.com/arindam923"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center whitespace-nowrap gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors group"
        >
          <Github className="w-4 h-4" />
          View All on GitHub
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => {
              setSelectedProject(project);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default ProjectsSection;
