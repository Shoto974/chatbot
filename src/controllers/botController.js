exports.botAsk = async (req, res) => {
  try {
    const { prompt, max_tokens } = req.body;
    if (!prompt || !max_tokens)
      return res.status(400).json({ msg: "All fields are required" });

    const res = await fetch("http://172.27.74.25:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        max_tokens,
      }),
    });
    if (res) {
      const data = await res.json();
      return res.status(200).send(data);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
