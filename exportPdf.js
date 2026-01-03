(function () {
  function init() {
    const btn = document.getElementById("exportPdfBtn");
    const resultCard = document.querySelector(".result-card");
    if (!btn || !resultCard) return;

    btn.addEventListener("click", async () => {
      try {
        btn.disabled = true;
        btn.textContent = "PDF 產生中…";

        const canvas = await html2canvas(resultCard, {
          scale: 2,
          backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf.jsPDF("p", "mm", "a4");

        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgH = (canvas.height * pageW) / canvas.width;

        let y = 0;
        let remaining = imgH;

        while (remaining > 0) {
          pdf.addImage(imgData, "PNG", 0, y, pageW, imgH);
          remaining -= pageH;
          if (remaining > 0) {
            pdf.addPage();
            y -= pageH;
          }
        }

        const d = new Date();
        const name =
          `學測換算_一階門檻_${d.getFullYear()}${d.getMonth()+1}${d.getDate()}_${d.getHours()}${d.getMinutes()}.pdf`;

        pdf.save(name);
      } finally {
        btn.disabled = false;
        btn.textContent = "匯出 PDF";
      }
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
