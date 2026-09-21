// Office Filing System — Google Drive upload endpoint
// Deploy as a Web app: Execute as "Me", Who has access "Anyone". See README.md.

const SECRET = 'change-this-to-a-long-random-key';
const FOLDER_NAME = 'Office Filing System';

function doPost(e) {
  const out = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.key !== SECRET) return out.setContent(JSON.stringify({ ok: false, error: 'wrong secret key' }));
    if (b.action === 'ping') return out.setContent(JSON.stringify({ ok: true }));
    if (b.action !== 'upload' || !b.data) return out.setContent(JSON.stringify({ ok: false, error: 'nothing to upload' }));
    const name = (b.ref || 'DOC') + ' - ' + (b.name || 'scan');
    const blob = Utilities.newBlob(Utilities.base64Decode(b.data), b.mime || 'application/octet-stream', name);
    const file = getFolder().createFile(blob);
    file.setDescription(b.title || '');
    return out.setContent(JSON.stringify({ ok: true, id: file.getId(), url: file.getUrl(), name: file.getName() }));
  } catch (err) {
    return out.setContent(JSON.stringify({ ok: false, error: String(err) }));
  }
}

function doGet() {
  return ContentService.createTextOutput('Office Filing System upload endpoint is running.');
}

function getFolder() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}
