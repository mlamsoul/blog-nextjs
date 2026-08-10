import { getAboutContent } from "../../lib/about";
import PostContent from "../../components/PostContent";

const sections: Record<
  string,
  Record<string, { name: string; url: string }[]>
> = {
  current: {
    Frontend: [
      {
        name: "JS (JavaScript)",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      { name: "TypeScript", url: "https://www.typescriptlang.org" },
      { name: "React", url: "https://react.dev" },
      { name: "Next.js", url: "https://nextjs.org" },
      { name: "Lit", url: "https://lit.dev" },
      { name: "REST", url: "https://restfulapi.net" },
      {
        name: "HTML",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
      { name: "CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    ],
    "Backend & Runtime": [
      { name: "Node.js", url: "https://nodejs.org" },
      {
        name: "PowerShell",
        url: "https://learn.microsoft.com/en-us/powershell",
      },
      { name: "Python", url: "https://www.python.org" },
    ],
    AI: [
      { name: "Python", url: "https://www.python.org" },
      { name: "NumPy", url: "https://numpy.org" },
      { name: "Pandas", url: "https://pandas.pydata.org" },
      { name: "R", url: "https://www.r-project.org" },
      { name: "Jupyter", url: "https://jupyter.org" },
    ],
    "DevOps & Infra": [
      { name: "Docker", url: "https://www.docker.com" },
      { name: "Linux", url: "https://www.kernel.org" },
      { name: "Git", url: "https://git-scm.com" },
      { name: "GitHub Actions", url: "https://github.com/features/actions" },
      { name: "Proxmox", url: "https://www.proxmox.com" },
      { name: "Nginx", url: "https://nginx.org" },
    ],
    Automation: [
      { name: "Home Assistant", url: "https://www.home-assistant.io" },
      { name: "n8n", url: "https://n8n.io" },
      { name: "Raspberry Pi", url: "https://www.raspberrypi.com" },
      {
        name: "ESP32",
        url: "https://www.espressif.com/en/products/socs/esp32",
      },
      { name: "Jinja2", url: "https://jinja.palletsprojects.com" },
      { name: "MQTT", url: "https://mqtt.org" },
    ],
    Security: [
      {
        name: "SSL/TLS",
        url: "https://www.ssl.com/article/ssl-tls-handshake-an-overview",
      },
      { name: "OAuth2", url: "https://oauth.net/2" },
      {
        name: "PKI",
        url: "https://www.ssl.com/faqs/what-is-a-public-key-infrastructure",
      },
    ],
    "3D": [
      {
        name: "Fusion 360",
        url: "https://www.autodesk.com/products/fusion-360",
      },
    ],
    "Tools & Formats": [
      { name: "VS Code", url: "https://code.visualstudio.com" },
      { name: "JSON", url: "https://www.json.org" },
      { name: "YAML", url: "https://yaml.org" },
      { name: "Markdown", url: "https://www.markdownguide.org" },
      { name: "Excalidraw", url: "https://excalidraw.com" },
    ],
    Data: [
      { name: "SQL", url: "https://www.iso.org/standard/63555.html" },
      { name: "PostgreSQL", url: "https://www.postgresql.org" },
    ],
    Exploring: [
      { name: "Rust", url: "https://www.rust-lang.org" },
      { name: "Bioinformatics", url: "https://www.bioinformatics.org" },
    ],
  },
  legacy: {
    Frontend: [
      {
        name: "VBScript",
        url: "https://learn.microsoft.com/en-us/previous-versions/t0aew7h6(v=vs.85)",
      },
      {
        name: "JScript (ECMAScript 3)",
        url: "https://learn.microsoft.com/en-us/previous-versions/hbxc2t98(v=vs.85)",
      },
      {
        name: "ASP classic",
        url: "https://learn.microsoft.com/en-us/previous-versions/iis/6.0-sdk/ms524929(v=vs.90)",
      },
      { name: "Webpack", url: "https://webpack.js.org" },
      { name: "jQuery", url: "https://jquery.com" },
    ],
    "Backend & Enterprise": [
      { name: "Java", url: "https://www.java.com" },
      { name: "C#", url: "https://learn.microsoft.com/en-us/dotnet/csharp" },
      {
        name: "J2EE",
        url: "https://www.oracle.com/java/technologies/appmodel.html",
      },
      {
        name: "EJB",
        url: "https://www.oracle.com/java/technologies/enterprise-javabeans-technology.html",
      },
      {
        name: "JSP",
        url: "https://www.oracle.com/java/technologies/jspt.html",
      },
      {
        name: "ASP.NET",
        url: "https://dotnet.microsoft.com/en-us/apps/aspnet",
      },
      {
        name: "Visual Basic 6",
        url: "https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-basic-6/visual-basic-6.0-documentation",
      },
      {
        name: "VB.NET",
        url: "https://learn.microsoft.com/en-us/dotnet/visual-basic",
      },
      { name: "Turbo Pascal", url: "https://www.turbo-pascal.com" },
    ],
    Systems: [
      { name: "C", url: "https://en.cppreference.com/w/c" },
      { name: "C++", url: "https://isocpp.org" },
      {
        name: "Assembly (MASM)",
        url: "https://learn.microsoft.com/en-us/cpp/assembler/masm/microsoft-macro-assembler-reference",
      },
      {
        name: "COM Objects",
        url: "https://learn.microsoft.com/en-us/windows/win32/com/component-object-model--com--portal",
      },
      {
        name: "ATL",
        url: "https://learn.microsoft.com/en-us/cpp/atl/active-template-library-atl-concepts",
      },
      {
        name: "MFC",
        url: "https://learn.microsoft.com/en-us/cpp/mfc/mfc-desktop-applications",
      },
    ],
    Automation: [
      { name: "Jeedom", url: "https://www.jeedom.com" },
      {
        name: "PowerShell",
        url: "https://learn.microsoft.com/en-us/powershell",
      },
    ],
    Data: [
      {
        name: "PL/SQL",
        url: "https://www.oracle.com/database/technologies/appdev/plsql.html",
      },
      { name: "SQL Server", url: "https://www.microsoft.com/en-us/sql-server" },
      { name: "IBM MQ", url: "https://www.ibm.com/products/mq" },
      { name: "XML", url: "https://www.w3.org/XML" },
      { name: "XSLT", url: "https://www.w3.org/TR/xslt" },
      { name: "XPath", url: "https://www.w3.org/TR/xpath" },
      { name: "SOAP", url: "https://www.w3.org/TR/soap" },
      { name: "WSDL", url: "https://www.w3.org/TR/wsdl" },
    ],
    "Infra & Ops": [
      {
        name: "IBM WebSphere Application Server",
        url: "https://www.ibm.com/products/websphere-application-server",
      },
      { name: "IIS", url: "https://www.iis.net" },
      { name: "CVS/SVN", url: "https://subversion.apache.org" },
      { name: "Eclipse", url: "https://www.eclipse.org" },
      { name: "Visual Studio", url: "https://visualstudio.microsoft.com" },
      { name: "XPLG (XpoLog)", url: "https://www.xplg.com" },
    ],
    Academic: [
      { name: "BASIC", url: "https://en.wikipedia.org/wiki/BASIC" },
      { name: "Smalltalk", url: "https://squeak.org" },
      { name: "Lisp", url: "https://lisp-lang.org" },
      { name: "SWI Prolog", url: "https://www.swi-prolog.org" },
      { name: "Scheme", url: "https://www.scheme.org" },
      { name: "Fortran", url: "https://fortran-lang.org" },
    ],
  },
};

function TagGroup({
  title,
  tags,
  dim = false,
}: {
  title: string;
  tags: { name: string; url: string }[];
  dim?: boolean;
}) {
  return (
    <div className="mb-4">
      <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-2 py-1 rounded-md border no-underline transition-colors ${
              dim
                ? "bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-400 hover:border-gray-600"
                : "bg-gray-800 text-gray-300 border-gray-700 hover:text-white hover:border-gray-500"
            }`}
          >
            {tech.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export default async function About() {
  const { contentHtml } = await getAboutContent();

  return (
    <main className="prose prose-neutral dark:prose-invert max-w-none">
      <PostContent html={contentHtml} />

      <h2>Tech Stack</h2>
      <h3>Current Daily Drivers</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(sections.current).map(([title, tags]) => (
          <TagGroup key={title} title={title} tags={tags} />
        ))}
      </div>

      <h3>Past &amp; Legacy</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(sections.legacy).map(([title, tags]) => (
          <TagGroup key={title} title={title} tags={tags} dim />
        ))}
      </div>
    </main>
  );
}
