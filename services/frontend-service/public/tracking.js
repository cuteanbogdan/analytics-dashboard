(function () {
  const script =
    document.currentScript ||
    Array.from(document.getElementsByTagName("script")).pop();
  const urlParams = new URLSearchParams(script.src.split("?")[1]);
  const tracking_id = urlParams.get("tracking_id");

  let sessionToken = localStorage.getItem("sessionToken");
  if (!sessionToken) {
    sessionToken = crypto.randomUUID();
    localStorage.setItem("sessionToken", sessionToken);
  }

  let lastTrackedUrl = window.location.href;

  const trackingData = {
    trackingId: tracking_id,
    sessionToken: sessionToken,
    eventType: "pageview",
    pageUrl: lastTrackedUrl,
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

  function trackPageView() {
    const currentUrl = window.location.href;
    if (currentUrl !== lastTrackedUrl) {
      trackingData.pageUrl = currentUrl;
      trackingData.eventType = "pageview";
      lastTrackedUrl = currentUrl;
      sendTrackingData();
    }
  }

  sendTrackingData();

  // Track changes in page view in SPAs
  window.addEventListener("popstate", trackPageView);
  window.addEventListener("hashchange", trackPageView);
  setInterval(trackPageView, 1000);

  // Clear session token when all tabs are closed
  window.addEventListener("unload", () => {
    const cleanupTimeout = 100;
    setTimeout(() => {
      if (!document.hasFocus()) {
        localStorage.removeItem("sessionToken");
      }
    }, cleanupTimeout);
  });

  console.log("Tracking script initialized with config:", trackingData);
})();
