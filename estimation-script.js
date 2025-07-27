document.addEventListener("DOMContentLoaded", () => {
  const titleElement = document.querySelector(".example");

  const type = sessionStorage.getItem("projectType");
  const area = parseFloat(sessionStorage.getItem("builtUpArea")) || 0;
  const floorsRaw = sessionStorage.getItem("floors");

  // Convert floor to number (handle "5+" as 5)
  const floors = floorsRaw === "5+" ? 5 : parseInt(floorsRaw) || 1;

  const projectPrices = {
    "Residential Villa": [90, 150],
    "Housing Complex": [70, 120],
    "School / Educational Building": [80, 140],
    "Commercial Project": [90, 180],
    "T-wall": [300, 900], // per unit
    "Interlock Block": [20, 50] // per unit
  };

  const range = projectPrices[type];

  let estimateText = "Unable to estimate. Missing or invalid inputs.";

  if (range && area > 0) {
    let totalMin, totalMax;

    if (type === "T-wall" || type === "Interlock Block") {
      // Units are treated directly
      totalMin = range[0] * area;
      totalMax = range[1] * area;
    } else {
      // Multiply by area and number of floors
      totalMin = range[0] * area * floors;
      totalMax = range[1] * area * floors;
    }

    estimateText = `Your project is estimated between <br><strong>${totalMin.toLocaleString()} – ${totalMax.toLocaleString()} JOD.`;
  }

  if (titleElement) {
    titleElement.innerHTML = estimateText;
  }
});
