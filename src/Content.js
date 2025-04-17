import React from "react";
import "./Content.css";

const contentCards = [
  {
    title: "Cellular Process Infographic",
    description:
      "A visual infographic depicting the process of autophagy at the cellular level—showing how old or damaged cell components are broken down and replaced by new, healthy ones.",
    link: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Autophagy_illustration_en.svg", // Example Wikimedia SVG
    type: "infographic",
  },
  {
    title: "Fasting Tips for Autophagy",
    description:
      "A quick reference chart to help you optimize fasting for maximum autophagy: fast for at least 16-18 hours, avoid high sugar intake, stay hydrated, and get enough sleep.",
    link: "https://i.imgur.com/0y8Ftya.png", // Placeholder image, replace with your own visual if desired
    type: "infographic",
  },
  {
    title: "Health Benefits of Fasting",
    description:
      "Discover how fasting can improve metabolism, reduce inflammation, support cellular repair (autophagy), and promote longevity.",
    link: "https://www.healthline.com/nutrition/fasting-benefits",
    type: "blog",
  },
  {
    title: "Expected Results",
    description:
      "Learn what you can expect during your fasting journey, including common experiences, weight loss, and improved mental clarity.",
    link: "https://www.medicalnewstoday.com/articles/fasting",
    type: "blog",
  },
  {
    title: "Case Study: Intermittent Fasting Success",
    description:
      "Read real-world case studies of people who have successfully improved their health with fasting.",
    link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5783752/",
    type: "case",
  },
  {
    title: "Animated Video: What is Autophagy?",
    description:
      "Watch a short explainer video on autophagy and how fasting triggers this powerful cellular process.",
    link: "https://www.youtube.com/watch?v=PKfR6bAXr-c",
    type: "video",
  },
  {
    title: "Beginner's Guide to Fasting",
    description:
      "A comprehensive blog post for those new to fasting, covering methods, tips, and safety considerations.",
    link: "https://www.dietdoctor.com/intermittent-fasting",
    type: "blog",
  },
  {
    title: "Podcast: Autophagy Benefits",
    description:
      "Listen to a podcast episode explaining the science and long-term benefits of autophagy.",
    link: "https://www.foundmyfitness.com/episodes/autophagy-fasting",
    type: "audio",
  },
  {
    title: "Infographic: Fasting Timeline",
    description:
      "Visualize when autophagy and other benefits begin during different fasting durations.",
    link: "https://www.siimland.com/what-happens-when-you-fast-timeline/",
    type: "infographic",
  },
];

function Content() {
  return (
    <div className="content-section">
      <h2>Educational Content</h2>
      <div className="content-cards">
        {contentCards.map((card, idx) => (
          <div className="content-card" key={idx}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <a href={card.link} target="_blank" rel="noopener noreferrer" className="content-link">
              {card.type === "video"
                ? "Watch Video"
                : card.type === "audio"
                ? "Listen"
                : card.type === "infographic"
                ? "View Infographic"
                : card.type === "case"
                ? "Read Case Study"
                : "Read More"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Content;
