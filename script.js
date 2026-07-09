/**
 * COMO INSTALAR:
 * 1. Abra a planilha (link que você me passou) → Extensões → Apps Script
 * 2. Apague o conteúdo padrão e cole tudo isto
 * 3. Implantar → Nova implantação → tipo "App da Web"
 *    Executar como: Eu | Quem acessa: Qualquer pessoa
 * 4. Copie a URL gerada e cole em WEBAPP_URL no script.js
 */

const SHEET_ID = "1BiwZdXF5TsYF5s0l7TvB1W1UX4ikvHRaahBZQKjuG9M";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (data.tipo === "visita") {
      const sheet = getOrCreateSheet(ss, "Visitas", ["Data/Hora", "Página", "Origem", "Idioma"]);
      sheet.appendRow([data.dataHora || new Date().toISOString(), data.pagina || "", data.referencia || "", data.idioma || ""]);
    } else if (data.tipo === "cliente") {
      const sheet = getOrCreateSheet(ss, "Clientes", ["Data/Hora", "Nome", "Telefone", "Mensagem"]);
      sheet.appendRow([data.dataHora || new Date().toISOString(), data.nome || "", data.telefone || "", data.mensagem || ""]);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}