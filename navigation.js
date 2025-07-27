const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQX_tIf4QN-AAeKPjW4qaXN9K1l1DkjI1CJuc5jhpidup1Zsxi6xlfEb6X8Y5hOjpQeA/exec";

// Redirect back to index.html on refresh
(function () {
  const isReload =
    performance.navigation.type === 1 ||
    performance.getEntriesByType("navigation")[0].type === "reload";

  const currentPage = window.location.pathname.split("/").pop();

  if (isReload && currentPage !== "index.html" && currentPage !== "") {
    window.location.href = "index.html";
  }
  

})();


// Navigation buttons logic
(function () {
  const pageOrder = ["index.html", "contact.html", "project.html", "estimation.html","thankyou.html"];
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const nextPageIndex = pageOrder.indexOf(currentPage) + 1;
  const nextPage = pageOrder[nextPageIndex];

  document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.querySelector(".next-button, .start-btn");
    const finishBtn = document.querySelector(".finish-button");

    if (nextBtn && nextPage) {
      nextBtn.addEventListener("click", () => {
        const data = collectFormData();
        Object.entries(data).forEach(([key, value]) => {
          sessionStorage.setItem(key, value);
        });
        window.location.href = nextPage;
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        const finalData = collectAllData();
        const spinner = document.getElementById("spinner");
        spinner.style.display = "flex"; // Show spinner

        sendDataToGoogleScript(finalData, () => {
          sessionStorage.clear();
          spinner.style.display = "none"; // Hide spinner
          window.location.href = "thankyou.html";
        });
      });
    }
  });
})();

// Prevent back navigation
(function () {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };
})();

// Collect form data from current page
function collectFormData() {
  const form = document.querySelector("form");
  if (!form) return {};

  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  const checkboxes = form.querySelectorAll('input[type="checkbox"][name]');
  const checkboxGroups = {};

  checkboxes.forEach(cb => {
    if (cb.checked) {
      if (!checkboxGroups[cb.name]) checkboxGroups[cb.name] = [];
      checkboxGroups[cb.name].push(cb.value || cb.parentElement.textContent.trim());
    }
  });

  Object.entries(checkboxGroups).forEach(([name, values]) => {
    data[name] = values.join(", ");
  });

  return data;
}

// Combine all data from sessionStorage
function collectAllData() {
  return {
    "Full Name": sessionStorage.getItem("fullName") || "",
    "Email Address": sessionStorage.getItem("email") || "",
    "Mobile Number": sessionStorage.getItem("mobile") || "",
    "Company Name": sessionStorage.getItem("company") || "",
    "Project Type": sessionStorage.getItem("projectType") || "",
    "Built-up Area": sessionStorage.getItem("builtUpArea") || "",
    "Number of Floors": sessionStorage.getItem("floors") || "",
    "Precast Elements": sessionStorage.getItem("elements") || ""
  };
}

// Send to Google Script
function sendDataToGoogleScript(data, callback) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).finally(() => {
    if (typeof callback === "function") callback();
  });
}
