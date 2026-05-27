
document.addEventListener("DOMContentLoaded", function(){

  const form = document.getElementById("peliRepForm");
  const input = document.getElementById("postcodeInput");
  const result = document.getElementById("repResult");

  if (!form || !input || !result) {
    console.error("Rep lookup HTML not found. Check the embed is on this page.");
    return;
  }

  if (typeof postcodeMap === "undefined") {
    console.error("postcodeMap is not loaded. Check the postcode data script is above this footer script.");
    result.innerHTML = "<p>Postcode data has not loaded.</p>";
    return;
  }

  if (typeof REP_DETAILS === "undefined") {
    console.error("REP_DETAILS is not loaded. Check the rep details script is above this footer script.");
    result.innerHTML = "<p>Rep details have not loaded.</p>";
    return;
  }

  const availableDistricts = Object.keys(postcodeMap).sort(function(a, b){
    return b.length - a.length;
  });

  function escapeHtml(value){
    return String(value || "").replace(/[&<>"']/g, function(char){
      return {
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#39;"
      }[char];
    });
  }

  function getPostcodeDistrict(value){
    const cleaned = String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!cleaned) return null;
    if (postcodeMap[cleaned]) return cleaned;

    if (cleaned.length > 3) {
      const outward = cleaned.slice(0, -3);
      if (postcodeMap[outward]) return outward;
    }

    return availableDistricts.find(function(district){
      return cleaned.startsWith(district);
    }) || null;
  }

  form.addEventListener("submit", function(event){
    event.preventDefault();

    const district = getPostcodeDistrict(input.value);

    if (!district || !postcodeMap[district]) {
      result.innerHTML = "<p>No rep found for this postcode.</p>";
      return;
    }

    const match = postcodeMap[district];
    const rep = REP_DETAILS[match.rep] || {};
    const phone = rep.phone || "";
    const photo = rep.photo || "";
    const phoneHtml = phone
      ? '<p><strong>Phone:</strong> <a href="tel:' + escapeHtml(phone.replace(/\s+/g, "")) + '">' + escapeHtml(phone) + '</a></p>'
      : "";

    const photoHtml = photo
      ? '<img src="' + escapeHtml(photo) + '" alt="">'
      : "";

   result.innerHTML =
  '<div class="peli-rep-card">' +
    photoHtml +
    '<div>' +
      '<h3>' + escapeHtml(match.rep) + '</h3>' +
      '<p><strong>Postcode district:</strong> ' + escapeHtml(district) + '</p>' +
      '<p><strong>Region:</strong> ' + escapeHtml(match.region) + '</p>' +
      phoneHtml +
    '</div>' +
  '</div>';
  });

});
