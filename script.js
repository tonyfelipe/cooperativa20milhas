/* ==========================================================================
   Cooperativa 20 Milhas — script.js
   IMPORTANTE: troque WEBAPP_URL abaixo pela URL do seu Google Apps Script
   depois de publicá-lo (veja instruções em apps-script.gs).
   ========================================================================== */

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw9L-KnbifuPLwY6iq0X4isIM-WX6oj_JWUPr6MZ2AEqN2nq0ty850L0a31isi8qnHeig/exec";

/* -------- Ano no rodapé -------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* -------- Aviso de cookies -------- */
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

/* -------- Registro de visita (uma vez por sessão) -------- */
async function registrarVisita() {
  if (!WEBAPP_URL || WEBAPP_URL.startsWith("COLE_AQUI")) return; // ainda não configurado
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
      mode: "no-cors", // Apps Script Web Apps não respondem CORS por padrão
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    sessionStorage.setItem("visitLogged", "1");
  } catch (err) {
    console.warn("Não foi possível registrar a visita:", err);
  }
}
registrarVisita();

/* -------- Formulário de contato / captação de cliente -------- */
const form = document.getElementById("lead-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "";

  // honeypot: se o campo invisível veio preenchido, é bot — ignora silenciosamente
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

  if (!WEBAPP_URL || WEBAPP_URL.startsWith("COLE_AQUI")) {
    status.textContent = "Painel ainda não configurado. Fale pelo WhatsApp por enquanto.";
    status.className = "err";
    return;
  }

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