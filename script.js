const WEBAPP_URL = "COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT_WEB_APP";

document.getElementById("year").textContent = new Date().getFullYear();

(function cookieNote(){
  const note = document.getElementById("cookie-note");
  const btn = document.getElementById("cookie-ok");
  if (localStorage.getItem("cookieOk") === "1") {
    note.style.display = "none";
  }
  btn.addEventListener("click", () => {
    localStorage.setItem("cookieOk", "1");
    note.style.display = "none";
  });
})();

async function registrarVisita() {
  if (!WEBAPP_URL || WEBAPP_URL.startsWith("COLE_AQUI")) return;
  if (sessionStorage.getItem("visitLogged") === "1") return;

  const payload = {
    tipo: "visita",
    pagina: window.location.pathname,
    referencia: document.referrer || "direto",
    idioma: navigator.language,
    dataHora: new Date().toISOString()
  };

  try {
    await fetch(WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    sessionStorage.setItem("visitLogged", "1");
  } catch (err) {
    console.warn("Não foi possível registrar a visita:", err);
  }
}
registrarVisita();

const WHATSAPP_PADRAO = "5511000000000";

function idDoDrive(url) {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function urlDaFoto(url) {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const id = idDoDrive(url);
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  return url;
}

async function carregarConteudo() {
  if (!WEBAPP_URL || WEBAPP_URL.startsWith("COLE_AQUI")) return;

  try {
    const res = await fetch(WEBAPP_URL, { method: "GET" });
    const data = await res.json();
    renderGaleria(data.galeria || []);
    renderVagas(data.vagas || []);
    renderOfertas(data.ofertas || []);
  } catch (err) {
    console.warn("Não foi possível carregar conteúdo da planilha:", err);
  }
}

function renderGaleria(itens) {
  const grid = document.getElementById("gallery-grid");
  if (!itens.length) {
    grid.innerHTML = `<figure><span>Nenhuma foto cadastrada ainda</span></figure>`;
    return;
  }
  grid.innerHTML = itens.map(item => `
    <figure>
      <img src="${urlDaFoto(item.foto)}" alt="${item.legenda || 'Foto da cooperativa'}" loading="lazy">
    </figure>
  `).join("");
}

function renderVagas(itens) {
  const list = document.getElementById("jobs-list");
  if (!itens.length) {
    list.innerHTML = `<div class="job"><p>Nenhuma vaga aberta no momento.</p></div>`;
    return;
  }
  list.innerHTML = itens.map(item => {
    const numero = (item.linkWhatsapp || WHATSAPP_PADRAO).replace(/\D/g, "");
    const texto = encodeURIComponent(`Quero me candidatar à vaga de ${item.cargo}`);
    return `
      <div class="job">
        <div>
          <h3>${item.cargo}</h3>
          <p>${item.descricao}</p>
          ${item.tag1 ? `<span class="tag">${item.tag1}</span>` : ""}
          ${item.tag2 ? `<span class="tag">${item.tag2}</span>` : ""}
        </div>
        <a class="btn ghost" href="https://wa.me/${numero}?text=${texto}" target="_blank" rel="noopener">Candidatar-se</a>
      </div>`;
  }).join("");
}

function renderOfertas(itens) {
  const list = document.getElementById("offers-list");
  if (!itens.length) {
    list.innerHTML = `<div class="offer"><p>Nenhuma oferta ativa no momento.</p></div>`;
    return;
  }
  list.innerHTML = itens.map(item => `
    <div class="offer">
      <div class="pct">${item.numero}</div>
      <h3>${item.titulo}</h3>
      <p>${item.descricao}</p>
    </div>
  `).join("");
}

carregarConteudo();

const form = document.getElementById("lead-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "";

  const honeypot = form.website.value.trim();
  if (honeypot !== "") {
    status.textContent = "Enviado!";
    status.className = "ok";
    form.reset();
    return;
  }

  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.trim();
  const mensagem = form.mensagem.value.trim();

  if (nome.length < 2 || telefone.length < 8) {
    status.textContent = "Confira o nome e o telefone antes de enviar.";
    status.className = "err";
    return;
  }

  if (!WEBAPP_URL || https://script.google.com/macros/s/AKfycbyufQ8wyDnqSfl6zQMolnF_fyVpHD4JAzsCiAe4UkIoZR0P77jpLRxXCw3xe8H0kOmBdA/executa {
    status.textContent = "Painel ainda não configurado. Fale pelo WhatsApp por enquanto.";
    status.className = "err";
    return;
  }
l
  const payload = {
    tipo: "cliente",
    nome,
    telefone,
    mensagem,
    dataHora: new Date().toISOString()
  };

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {
    await fetch(WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    status.textContent = "Recebido! Em breve entramos em contato.";
    status.className = "ok";
    form.reset();
  } catch (err) {
    status.textContent = "Não deu pra enviar agora. Tente pelo WhatsApp.";
    status.className = "err";
  } finally {
    btn.disabled = false;
    btn.textContent = "Enviar dados";
  }
});