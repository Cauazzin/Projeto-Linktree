document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    setupActiveNav();
    loadGithubRepos();
    setupPlayground();
    setupContactForm();
});

/* Menu mobile */
function setupMobileMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* Destaque do item de navegação conforme o scroll */
function setupActiveNav() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                    });
                }
            });
        },
        { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
}

/* Repositórios do GitHub (@Cauazzin) com fallback local */
const FALLBACK_REPOS = [
    {
        name: "linktree-caua",
        description: "Projeto de centralizador de links desenvolvido com HTML5, CSS3 e JavaScript, evoluindo para este portfólio.",
        language: "HTML / CSS / JS",
        html_url: "https://github.com/Cauazzin?tab=repositories"
    },
    {
        name: "exercicios-ads-logica",
        description: "Códigos e estudos da graduação em Análise e Desenvolvimento de Sistemas: lógica, estruturas e resolução de problemas.",
        language: "JavaScript / Lógica",
        html_url: "https://github.com/Cauazzin?tab=repositories"
    },
    {
        name: "projetos-web-praticos",
        description: "Páginas, interfaces e experimentos front-end publicados no GitHub para praticar layout, responsividade e DOM.",
        language: "Web",
        html_url: "https://github.com/Cauazzin?tab=repositories"
    }
];

async function loadGithubRepos() {
    const grid = document.getElementById("reposGrid");
    const statusEl = document.getElementById("githubStatus");
    const syncBtn = document.getElementById("syncGithubBtn");
    if (!grid || !statusEl) return;

    const fetchRepos = async () => {
        statusEl.innerHTML = "Sincronizando repositórios públicos de <strong>@Cauazzin</strong>...";
        try {
            const res = await fetch("https://api.github.com/users/Cauazzin/repos?sort=updated&per_page=6");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            const filtered = Array.isArray(data)
                ? data.filter((repo) => !repo.fork).slice(0, 6)
                : [];

            if (filtered.length > 0) {
                renderRepos(grid, filtered);
                statusEl.innerHTML = `Exibindo <strong>${filtered.length}</strong> repositórios recentes de <strong>github.com/Cauazzin</strong>.`;
            } else {
                renderRepos(grid, FALLBACK_REPOS);
                statusEl.innerHTML = "Exibindo destaques dos projetos de <strong>@Cauazzin</strong> no GitHub.";
            }
        } catch {
            renderRepos(grid, FALLBACK_REPOS);
            statusEl.innerHTML = "Modo offline/API limitada: exibindo destaques dos projetos de <strong>@Cauazzin</strong>.";
        }
    };

    if (syncBtn) {
        syncBtn.addEventListener("click", fetchRepos);
    }

    await fetchRepos();
}

function renderRepos(grid, repos) {
    grid.innerHTML = repos
        .map((repo) => {
            const safeName = escapeHtml(repo.name || "repositorio");
            const safeDesc = escapeHtml(
                repo.description || "Projeto desenvolvido e versionado no GitHub por Cauã Ferreira Santos."
            );
            const safeLang = escapeHtml(repo.language || "Código");
            const safeUrl = sanitizeUrl(repo.html_url);

            return `
                <article class="repo-card">
                    <div>
                        <h3 class="repo-name">${safeName}</h3>
                        <p class="repo-desc">${safeDesc}</p>
                    </div>
                    <div class="repo-meta">
                        <span>${safeLang}</span>
                        <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="repo-link">Ver no GitHub &rarr;</a>
                    </div>
                </article>
            `;
        })
        .join("");
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function sanitizeUrl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            return parsed.href;
        }
    } catch {
        // ignora URL inválida
    }
    return "https://github.com/Cauazzin?tab=repositories";
}

/* Code Playground (temática ADS + rotina administrativa) */
const CODE_PRESETS = {
    ads: `// Simulação de cálculo de média e status na disciplina de ADS
const notas = [8.5, 9.0, 7.8];
const media = notas.reduce((acc, n) => acc + n, 0) / notas.length;
const situacao = media >= 7 ? "APROVADO" : "EXAME";

console.log("Disciplina: Estruturas & Lógica (ADS)");
console.log("Média calculada:", media.toFixed(2));
console.log("Situação:", situacao);`,

    admin: `// Organização de demandas administrativas com lógica
const demandas = [
  { id: "ADM-101", tarefa: "Conferência de planilhas", prioridade: "alta" },
  { id: "ADM-102", tarefa: "Arquivamento de documentos", prioridade: "media" },
  { id: "ADM-103", tarefa: "Atualização de cadastros", prioridade: "alta" }
];

const urgentes = demandas.filter((item) => item.prioridade === "alta");
console.log("Total de demandas:", demandas.length);
console.log("Prioridade alta:", urgentes.map((u) => u.id).join(", "));`,

    stack: `// Evolução contínua: Administração + ADS + GitHub
const perfil = {
  estudante: "ADS",
  profissao: "Assistente Administrativo",
  github: "https://github.com/Cauazzin"
};

console.log(\`\${perfil.profissao} cursando \${perfil.estudante}\`);
console.log("Repositórios em:", perfil.github);`
};

function setupPlayground() {
    const editor = document.getElementById("codeEditor");
    const output = document.getElementById("consoleOutput");
    const runBtn = document.getElementById("runCodeBtn");
    const clearBtn = document.getElementById("clearConsoleBtn");
    const presetButtons = document.querySelectorAll(".preset-btn");

    if (!editor || !output || !runBtn) return;

    editor.value = CODE_PRESETS.ads;

    presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            presetButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const key = btn.getAttribute("data-preset");
            if (key && CODE_PRESETS[key]) {
                editor.value = CODE_PRESETS[key];
                runSnippet();
            }
        });
    });

    const runSnippet = () => {
        const logs = [];
        const customConsole = {
            log: (...args) => logs.push(args.map(formatArg).join(" ")),
            warn: (...args) => logs.push("[WARN] " + args.map(formatArg).join(" ")),
            error: (...args) => logs.push("[ERR] " + args.map(formatArg).join(" "))
        };

        try {
            const fn = new Function("console", editor.value);
            fn(customConsole);
            output.style.color = "#34d399";
            output.textContent = logs.length
                ? logs.join("\n")
                : "Código executado sem saída no console.";
        } catch (err) {
            output.style.color = "#f87171";
            output.textContent = `Erro de execução: ${err.message}`;
        }
    };

    runBtn.addEventListener("click", runSnippet);

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            output.style.color = "#94a3b8";
            output.textContent = "Console limpo.";
        });
    }
}

function formatArg(val) {
    if (typeof val === "object" && val !== null) {
        try {
            return JSON.stringify(val, null, 2);
        } catch {
            return String(val);
        }
    }
    return String(val);
}

/* Formulário de contato na página única */
function setupContactForm() {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");
    if (!form || !feedback) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        if (!nome || !email || !mensagem) {
            feedback.style.color = "#f87171";
            feedback.textContent = "Preencha todos os campos antes de enviar.";
            return;
        }

        feedback.style.color = "#34d399";
        feedback.textContent = `Valeu, ${nome}! Mensagem preparada. Você também pode chamar direto no LinkedIn ou GitHub.`;
        form.reset();
    });
}