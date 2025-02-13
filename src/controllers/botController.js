exports.botAsk = async (req, res, next) => {
  try {
    const { prompt, max_tokens } = req.body;
    if (!prompt || !max_tokens)
      return res.status(400).json({ msg: "All fields are required" });

    const response = await fetch("http://172.27.74.25:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        max_tokens,
      }),
    });
    if (response) {
      const data = await response.json();
      req.body = {
        sender: { id: "123", username: "bot" },
        content: data.response,
      };
      next();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
