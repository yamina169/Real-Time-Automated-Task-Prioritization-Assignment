const axios = require("axios");

// Fonction pour extraire les phrases clés
const extractKeyphrases = async (text) => {
  try {
    // Envoi d'une requête POST à l'API Hugging Face
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error extracting keyphrases");
  }
};

// Fonction pour catégoriser les phrases
const categorizeText = (keyphrases) => {
  const categories = {
    maintenance: ["maintenance", "réparation", "dépannage", "entretien"],
    urgent: ["urgent", "immédiat", "prioritaire", "critique"],
    "support client": [
      "service client",
      "assistance",
      "réclamation",
      "support",
    ],
    "nouvelle fonctionnalité": [
      "fonctionnalité",
      "amélioration",
      "nouveauté",
      "update",
    ],
  };

  let textCategories = [];

  keyphrases.forEach((phrase) => {
    if (typeof phrase === "string") {
      Object.keys(categories).forEach((category) => {
        if (
          categories[category].some((keyword) =>
            phrase.toLowerCase().includes(keyword)
          )
        ) {
          textCategories.push(category);
        }
      });
    }
  });

  return textCategories;
};

// Fonction pour mettre en évidence les mots-clés dans le texte
const highlightText = (text, keyphrases) => {
  let highlightedText = text;
  keyphrases.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    highlightedText = highlightedText.replace(regex, `<mark>${phrase}</mark>`);
  });
  return highlightedText;
};

module.exports = { extractKeyphrases, categorizeText, highlightText };
