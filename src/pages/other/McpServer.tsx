import { Avatar, Box } from "@mui/material";
import { mcpServerGithubLink } from "../../middleware/links";
import githubLogo from "../../assets/github-logo.png";
import MarkdownBlock from "../../components/MarkdownBlock";
import {
  PageHeader,
  GradientText,
  Reveal,
  SectionHeading,
  Panel,
  Callout,
  CheckList,
  StatRow,
  ExternalButton,
  PageNav,
} from "../../components/design";
import { SectionNavLayout, Section } from "../../components/SectionNav";

const ACCENT = "#d8aa78";

const SECTIONS: Section[] = [
  { id: "exposes", label: "What it exposes" },
  { id: "claude", label: "Connect from Claude" },
  { id: "openai", label: "Connect from OpenAI" },
  { id: "chat", label: "Powers the site chat" },
  { id: "how", label: "How it works" },
];

const tools = [
  "get_profile and get_resume: the overview, summary, contact links and the whole profile as one document.",
  "list_projects and get_project: every project, filterable by status, with rich per-project detail (features, architecture, how it works).",
  "get_experience and get_education: full work history and qualifications.",
  "get_skills and get_interests: the grouped tech stack, and life outside work.",
  "search: a keyword lookup across experience, projects and skills.",
];

const mechanics = [
  "Built on the official Python MCP SDK (FastMCP), speaking MCP's Streamable HTTP transport.",
  "Read-only and stateless per request, so it sits safely behind nginx as a public endpoint.",
  "Data mirrors moates.com.au, so answers stay accurate and the model never has to guess.",
  "Also exposes a resume://marcus resource and an ask_about_marcus prompt for clients that use them.",
  "Deployed as a Docker container on a DigitalOcean droplet, fronted by nginx with a Cloudflare origin cert.",
];

// Claude Code CLI: one command adds the remote server over HTTP.
const claudeCode = `\`\`\`bash
claude mcp add --transport http marcus https://mcp.moates.com.au/mcp
\`\`\``;

// Claude Desktop reaches a remote HTTP server through the mcp-remote bridge.
const claudeDesktop = `\`\`\`json
{
  "mcpServers": {
    "marcus": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.moates.com.au/mcp"]
    }
  }
}
\`\`\``;

// OpenAI Responses API attaches the server as a hosted MCP tool.
const openaiPython = `\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5-nano",
    tools=[{
        "type": "mcp",
        "server_label": "marcus",
        "server_url": "https://mcp.moates.com.au/mcp",
        "require_approval": "never",
    }],
    input="What backend projects has Marcus built?",
)
print(response.output_text)
\`\`\``;

const openaiCurl = `\`\`\`bash
curl https://api.openai.com/v1/responses \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-nano",
    "tools": [{
      "type": "mcp",
      "server_label": "marcus",
      "server_url": "https://mcp.moates.com.au/mcp",
      "require_approval": "never"
    }],
    "input": "What backend projects has Marcus built?"
  }'
\`\`\``;

export default function OtherMcpServer() {
  return (
    <SectionNavLayout sections={SECTIONS}>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: { xs: 3, sm: 4 },
          pb: 4,
        }}
      >
        <PageHeader
          eyebrow="mcp server"
          title={<>Marcus <GradientText>MCP Server</GradientText></>}
          subtitle="A public Model Context Protocol server that lets AI assistants answer questions about Marcus from structured, accurate data. Claude and OpenAI models connect, call its tools, and stop guessing."
          actions={
            <ExternalButton
              href={mcpServerGithubLink}
              icon={<Avatar alt="github icon" src={githubLogo} sx={{ width: 24, height: 24 }} />}
            >
              Source
            </ExternalButton>
          }
        />

        <Reveal delay={0.06}>
          <Panel accent={ACCENT} wash>
            <StatRow
              items={[
                { value: "9", label: "tools" },
                { value: "HTTP", label: "streamable transport" },
                { value: "Public", label: "read-only endpoint" },
              ]}
            />
          </Panel>
        </Reveal>

        <Reveal delay={0.12}>
          <MarkdownBlock>
            {`An MCP server is a small backend that any AI client can plug into. This one serves the same facts as this site: my profile, projects, experience and skills. The client brings the model (Claude, an OpenAI agent, or anything that speaks MCP); the server just hands back accurate, structured data so the answers are grounded rather than invented.`}
          </MarkdownBlock>
          <Callout accent={ACCENT} title="endpoint">
            https://mcp.moates.com.au/mcp
          </Callout>
        </Reveal>

        <Reveal delay={0.18} id="exposes">
          <SectionHeading eyebrow="tools">What it exposes</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            A handful of read-only tools cover everything on the site. A client picks the ones it
            needs to answer a question:
          </Box>
          <CheckList items={tools} accent={ACCENT} />
        </Reveal>

        <Reveal delay={0.24} id="claude">
          <SectionHeading eyebrow="anthropic">Connect from Claude</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            In Claude Code, add the server over HTTP in one command, then ask it anything about me:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{claudeCode}</MarkdownBlock>
          </Panel>
          <Box sx={{ color: "text.secondary", mt: 3, mb: 2 }}>
            In Claude Desktop, add a custom connector pointing at the same URL, or bridge to it from
            the config file with mcp-remote:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{claudeDesktop}</MarkdownBlock>
          </Panel>
        </Reveal>

        <Reveal delay={0.3} id="openai">
          <SectionHeading eyebrow="openai">Connect from OpenAI</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The OpenAI Responses API takes the server as a hosted MCP tool. Point it at the URL and
            the model calls the tools on its own:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{openaiPython}</MarkdownBlock>
          </Panel>
          <Box sx={{ color: "text.secondary", mt: 3, mb: 2 }}>
            The same request over plain HTTP:
          </Box>
          <Panel accent={ACCENT}>
            <MarkdownBlock>{openaiCurl}</MarkdownBlock>
          </Panel>
        </Reveal>

        <Reveal delay={0.36} id="chat">
          <SectionHeading eyebrow="in practice">Powers the site chat</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            The "Ask about Marcus" bot in the corner of this site is the same idea, wired up
            end to end. It draws its facts from this MCP server's knowledge base, then uses the
            OpenAI SDK to turn a question into an answer:
          </Box>
          <CheckList
            items={[
              "Grounding: the chat is backed by the exact same structured data this MCP server exposes, so both answer from one source of truth.",
              "The bot: a small FastAPI proxy calls the model through the OpenAI SDK, with that knowledge base and a strict, on-topic system prompt.",
              "The result: answers stay accurate and scoped to Marcus, with no hallucinated details and nothing to install.",
            ]}
            accent={ACCENT}
          />
        </Reveal>

        <Reveal delay={0.42} id="how">
          <SectionHeading eyebrow="design">How it works</SectionHeading>
          <Box sx={{ color: "text.secondary", mb: 2 }}>
            It is deliberately small: no database, no auth, no LLM of its own. Just accurate data
            served over the MCP protocol.
          </Box>
          <CheckList items={mechanics} accent={ACCENT} />
        </Reveal>

        <PageNav
          left={{ text: "Poppycock", link: "/poppycock" }}
          right={{ text: "IMAX Watch Agent", link: "/other/imax-bot" }}
        />
      </Box>
    </SectionNavLayout>
  );
}
