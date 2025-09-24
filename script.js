function switchTab(evt, tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  evt.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
const uploadForm = document.getElementById('uploadForm');
const message = document.getElementById('message');
const codeSection = document.getElementById('codeSection');
const generatedCodeEl = document.getElementById('generatedCode');
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    message.style.color = "red";
    message.textContent = "Please select a file.";
    return;
  }
  message.textContent = "⏳ Uploading...";
  message.style.color = "black";
  codeSection.style.display = "none";
  const reader = new FileReader();
  reader.onload = async function() {
    const base64Data = reader.result.split(",")[1];
    const body = {
      filename: file.name,
      file: base64Data,
      contentType: file.type || "application/octet-stream"
    };
    try {
      const response = await fetch("https://default2e0f74ad066f44ea9cf9557b3c2f8d.49.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/65342f7c857c426a9261ecdf20b640e8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZJ8XkmkLidoYcDS5xtk3aUA0nEKIs18j4rnVi31BCHc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        message.style.color = "green";
        message.textContent = "✅ File uploaded successfully!";
        const code = generateCode();
        generatedCodeEl.textContent = code;
        codeSection.style.display = "block";
      } else {
        const errorText = await response.text();
        message.style.color = "red";
        message.textContent = "❌ Upload failed: " + errorText;
      }
    } catch (err) {
      message.style.color = "red";
      message.textContent = "❌ Error: " + err.message;
    }
  };
  reader.readAsDataURL(file);
});
function copyCode() {
  const code = generatedCodeEl.textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert("Code copied: " + code);
  });
}