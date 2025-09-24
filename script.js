<script>
  // Random code generator
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
      const base64Data = reader.result.split(",")[1]; // strip prefix
      const code = generateCode();   // ✅ generate 6-digit code

      // ✅ prepend code to filename
      const newFileName = `${code}-${file.name}`;

      const body = {
        filename: newFileName,
        file: base64Data,
        contentType: file.type || "application/octet-stream"
      };

      try {
        const response = await fetch("YOUR-POWER-AUTOMATE-URL-HERE", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          message.style.color = "green";
          message.textContent = "✅ File uploaded successfully!";
          generatedCodeEl.textContent = code;   // ✅ show code in UI
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
</script>
