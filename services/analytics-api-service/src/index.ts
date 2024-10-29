import app from "./app";

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Analytics API Service is running on port ${PORT}`);
});
