(function () {
  const script =
    document.currentScript ||
    Array.from(document.getElementsByTagName("script")).pop();
  const urlParams = new URLSearchParams(script.src.split("?")[1]);
  const tracking_id = urlParams.get("tracking_id");

  const trackingData = {
    trackingId: tracking_id,
    eventType: "pageview",
    pageUrl: window.location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    customData: {},
  };

  function sendTrackingData() {
    fetch("http://localhost:5001/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackingData),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => console.log("Tracking data sent:", data))
      .catch((error) => console.error("Error sending tracking data:", error));
  }

  window.addEventListener("load", sendTrackingData);
})();
