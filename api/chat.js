export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Missing message"
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions: `
Jsi zahradní poradce pro firmu GardenGuy.

Pomáháš zákazníkům s:
- sekáním trávy
- zavlažováním
- údržbou zahrad
- péčí o trávník
- úpravou okrajů
- odvozem biomasy
- údržbou areálů

Odpovídej vždy česky.
Buď příjemný, stručný a praktický.

Pokud se zákazník ptá na cenu, nevymýšlej si konkrétní cenu,
pokud ji nemáš v poskytnutých informacích.

Pokud zákazník projeví zájem o službu, snaž se zjistit:
- jakou službu potřebuje
- přibližnou velikost zahrady
- lokalitu
- jak často službu potřebuje

Pokud chce zákazník nabídku, doporuč mu zanechat kontakt.
        `,
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: "OpenAI API error"
      });
    }

    const reply =
  data.output_text ||
  data.output
    ?.filter(item => item.type === "message")
    ?.flatMap(item => item.content || [])
    ?.filter(item => item.type === "output_text")
    ?.map(item => item.text)
    ?.join("\n") ||
  "Promiňte, nepodařilo se vytvořit odpověď.";

return res.status(200).json({
  reply
});

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
