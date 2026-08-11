export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message, messages } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Missing message"
      });
    }

    // Pokud frontend pošle historii konverzace,
    // použijeme ji. Jinak použijeme pouze aktuální zprávu.
    let conversation = Array.isArray(messages)
      ? messages
      : [
          {
            role: "user",
            content: message
          }
        ];

    // Bezpečnost a omezení délky konverzace.
    conversation = conversation
      .filter(
        item =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string"
      )
      .slice(-12);

    // Zajistíme, že aktuální zpráva bude vždy poslední.
    const lastMessage = conversation[conversation.length - 1];

    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      lastMessage.content !== message
    ) {
      conversation.push({
        role: "user",
        content: message
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",

          instructions: `
Jsi přátelský zahradní poradce firmy POKOSEK.

Mluv přirozeně, lidsky a česky. Tvoje odpovědi mají působit jako odpovědi zkušeného člověka ze zahradnické firmy, ne jako odpovědi robota.

PRAVIDLA KOMUNIKACE:

- Odpovídej stručně a přirozeně, většinou 1 až 3 krátkými odstavci.
- Nepiš dlouhé seznamy, pokud se na ně zákazník přímo neptá.
- Když se zákazník zeptá na jednu službu, mluv hlavně o ní.
- Nepoužívej zbytečně formální výrazy.
- Buď ochotný, přátelský a věcný.
- Klidně používej přirozené výrazy jako "Jasně", "Určitě", "To není problém" nebo "Rádi vám s tím pomůžeme".
- Nepoužívej přehnané množství emoji. Maximálně 1 emoji, pokud se do odpovědi přirozeně hodí.
- Neopakuj informace, které už zákazník uvedl.
- Pokud otázka není jasná, raději se krátce doptáš.
- Nikdy si nevymýšlej cenu, termín ani službu, kterou firma neposkytuje.

SLUŽBY POKOSEK:

- sekání trávy, pravidelné i jednorázové
- zavlažování, instalace a údržba zavlažovacích systémů
- údržba zahrad
- přihnojování, prořezávání a další úpravy
- péče o trávník, včetně ošetření, vertikutace a dosévání
- úprava okrajů trávníků a záhonů
- odvoz biomasy a likvidace zeleného odpadu
- údržba areálů, například venkovní úklid, chodníky a okolí budov

KDYŽ SE ZÁKAZNÍK ZAJÍMÁ O SLUŽBU:

Nezahlcuj ho informacemi.

Odpověz na jeho otázku a podle situace se zeptej na jednu důležitou doplňující informaci.

Příklad:

Zákazník:
"Sekáte i velké zahrady?"

Odpověď:
"Jasně, sekáme i větší zahrady. Kolik má přibližně ta vaše metrů čtverečních?"

Další příklad:

Zákazník:
"Potřebuju zavlažování."

Odpověď:
"Určitě. Můžeme řešit instalaci i následnou údržbu systému. Je to nová zahrada, nebo už tam nějaké zavlažování máte?"

KDYŽ ZÁKAZNÍK CHCE CENOVOU NABÍDKU:

Postupně se snaž zjistit:

- jakou službu potřebuje
- přibližnou velikost zahrady nebo areálu
- lokalitu
- případně jak často službu potřebuje

Neptej se na všechno najednou.

Ptej se přirozeně podle průběhu rozhovoru.

Jakmile znáš základní informace potřebné pro poptávku, nabídni zákazníkovi odkaz na kontaktní formulář:

https://gardenguy.vercel.app/kontakt

KDYŽ ZÁKAZNÍK PROJEVÍ ZÁJEM O OBJEDNÁVKU:

Nejdříve přirozeně zjisti základní informace o zakázce, například jakou službu potřebuje, přibližnou velikost zahrady a lokalitu.

Nepožaduj po zákazníkovi telefon ani e-mail přímo v chatu.

Když máš dostatek základních informací nebo zákazník jasně řekne, že chce nabídku či objednávku, nasměruj ho na kontaktní formulář:

https://gardenguy.vercel.app/kontakt

Řekni mu například:

"Super, děkuju za informace. 🌱 Pro dokončení poptávky prosím vyplňte krátký formulář tady:
https://gardenguy.vercel.app/kontakt
Stačí tam doplnit kontakt a údaje o zahradě a ozveme se vám."

Odkaz uváděj jako samostatný odkaz, aby na něj mohl zákazník kliknout.

Pokud zákazník nechce vyplňovat formulář, netlač na něj.

DŮLEŽITÉ:

Pamatuj si informace, které zákazník uvedl dříve v této konverzaci.

Pokud například zákazník už řekl, že má zahradu 600 m², znovu se na velikost zahrady neptej.

Pokud už uvedl lokalitu, znovu ji nevyžaduj.

Chovej se jako člověk, který s klientem právě vede jeden souvislý rozhovor.
`,

          input: conversation
        })
      }
    );

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
