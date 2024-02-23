import { newGraph } from "./Graph";
import { UpdateState } from "./state";

// {
//   nodes: [
//     {
//       id: "Life",
//       name: "Life",
//     },
//     {
//       id: "Outdoors",
//       name: "Outdoors",
//     },
//     {
//       id: "Career",
//       name: "Career",
//     },
//     {
//       id: "Learning",
//       name: "Learning",
//     },
//     {
//       id: "Relationships",
//       name: "Relationships",
//     },
//     {
//       id: "Home",
//       name: "Home",
//     },
//     {
//       id: "Health",
//       name: "Health",
//     },
//     {
//       id: "Environmentalism",
//       name: "Environmentalism",
//     },
//     {
//       id: "Eclectic Outdoorsman",
//       name: "Eclectic Outdoorsman",
//     },
//     {
//       id: "Respected Career",
//       name: "Respected Career",
//     },
//     {
//       id: "Knowledgeable",
//       name: "Knowledgeable",
//     },
//     {
//       id: "Competent Programmer",
//       name: "Competent Programmer",
//     },
//     {
//       id: "Fun & Tight Social Circle",
//       name: "Fun & Tight Social Circle",
//     },
//     {
//       id: "Good Partner",
//       name: "Good Partner",
//     },
//     {
//       id: "Caring Family Member",
//       name: "Caring Family Member",
//     },
//     {
//       id: "Financial Independence",
//       name: "Financial Independence",
//     },
//     {
//       id: "Live in a Cool Place",
//       name: "Live in a Cool Place",
//     },
//     {
//       id: "Healthy & Fit",
//       name: "Healthy & Fit",
//     },
//     {
//       id: "Lead a Conscious Life",
//       name: "Lead a Conscious Life",
//     },
//     {
//       id: "Environmentalist",
//       name: "Environmentalist",
//     },
//     {
//       id: "Road to the Nose",
//       name: "Road to the Nose",
//     },
//     {
//       id: "The Prow",
//       name: "The Prow",
//     },
//     {
//       id: "King Swing",
//       name: "King Swing",
//     },
//     {
//       id: "Masters",
//       name: "Masters",
//     },
//     {
//       id: "Wryze",
//       name: "Wryze",
//     },
//     {
//       id: "Climatebase Fellowship",
//       name: "Climatebase Fellowship",
//     },
//     {
//       id: "Rest Days",
//       name: "Rest Days",
//     },
//     {
//       id: "Smart Compass",
//       name: "Smart Compass",
//     },
//     {
//       id: "Tangled Trees",
//       name: "Tangled Trees",
//     },
//     {
//       id: "Yenta",
//       name: "Yenta",
//     },
//     {
//       id: "Throw a party",
//       name: "Throw a party",
//     },
//     {
//       id: "Cover Expenses",
//       name: "Cover Expenses",
//     },
//     {
//       id: "Freelance",
//       name: "Freelance",
//     },
//     {
//       id: "Fiverr",
//       name: "Fiverr",
//     },
//     {
//       id: "Reach out to paul",
//       name: "Reach out to paul",
//     },
//     {
//       id: "Call Mom",
//       name: "Call Mom",
//     },
//     {
//       id: "Call Dad",
//       name: "Call Dad",
//     },
//     {
//       id: "Call Gram",
//       name: "Call Gram",
//     },
//     {
//       id: "Call Jake",
//       name: "Call Jake",
//     },
//     {
//       id: "Something Nice for Courtney",
//       name: "Something Nice for Courtney",
//     },
//     {
//       id: "Running",
//       name: "Running",
//     },
//     {
//       id: "Mountain Biking",
//       name: "Mountain Biking",
//     },
//     {
//       id: "White Rim",
//       name: "White Rim",
//     },
//     {
//       id: "RRR",
//       name: "RRR",
//     },
//     {
//       id: "WURL",
//       name: "WURL",
//     },
//     {
//       id: "5 min mile",
//       name: "5 min mile",
//     },
//     {
//       id: "Boston",
//       name: "Boston",
//     },
//     {
//       id: "Journal",
//       name: "Journal",
//     },
//     {
//       id: "Reading",
//       name: "Reading",
//     },
//     {
//       id: "Atomic Habits",
//       name: "Atomic Habits",
//     },
//     {
//       id: "Mans Search for Meaning",
//       name: "Mans Search for Meaning",
//     },
//     {
//       id: "Movies",
//       name: "Movies",
//     },
//     {
//       id: "Dopesick",
//       name: "Dopesick",
//     },
//     {
//       id: "Before Sunrise",
//       name: "Before Sunrise",
//     },
//     {
//       id: "Try new meal",
//       name: "Try new meal",
//     },
//     {
//       id: "Vegetable Biryani",
//       name: "Vegetable Biryani",
//     },
//     {
//       id: "Van",
//       name: "Van",
//     },
//     {
//       id: "Monster Truck with Ben",
//       name: "Monster Truck with Ben",
//     },
//     {
//       id: "Real Salt Lake Game",
//       name: "Real Salt Lake Game",
//     },
//     {
//       id: "Backcountry Skiing",
//       name: "Backcountry Skiing",
//     },
//     {
//       id: "Get Skins",
//       name: "Get Skins",
//     },
//     {
//       id: "Replace Beacon",
//       name: "Replace Beacon",
//     },
//   ],
//   edges: [
//     {
//       from: "Life",
//       to: "Outdoors",
//     },
//     {
//       from: "Life",
//       to: "Career",
//     },
//     {
//       from: "Life",
//       to: "Learning",
//     },
//     {
//       from: "Life",
//       to: "Relationships",
//     },
//     {
//       from: "Life",
//       to: "Home",
//     },
//     {
//       from: "Life",
//       to: "Health",
//     },
//     {
//       from: "Life",
//       to: "Environmentalism",
//     },
//     {
//       from: "Outdoors",
//       to: "Eclectic Outdoorsman",
//     },
//     {
//       from: "Career",
//       to: "Respected Career",
//     },
//     {
//       from: "Learning",
//       to: "Knowledgeable",
//     },
//     {
//       from: "Learning",
//       to: "Competent Programmer",
//     },
//     {
//       from: "Relationships",
//       to: "Fun & Tight Social Circle",
//     },
//     {
//       from: "Relationships",
//       to: "Good Partner",
//     },
//     {
//       from: "Relationships",
//       to: "Caring Family Member",
//     },
//     {
//       from: "Home",
//       to: "Financial Independence",
//     },
//     {
//       from: "Home",
//       to: "Live in a Cool Place",
//     },
//     {
//       from: "Health",
//       to: "Healthy & Fit",
//     },
//     {
//       from: "Health",
//       to: "Lead a Conscious Life",
//     },
//     {
//       from: "Environmentalism",
//       to: "Environmentalist",
//     },
//     {
//       from: "Eclectic Outdoorsman",
//       to: "Road to the Nose",
//     },
//     {
//       from: "Road to the Nose",
//       to: "The Prow",
//     },
//     {
//       from: "Road to the Nose",
//       to: "King Swing",
//     },
//     {
//       from: "Respected Career",
//       to: "Masters",
//     },
//     {
//       from: "Respected Career",
//       to: "Wryze",
//     },
//     {
//       from: "Respected Career",
//       to: "Climatebase Fellowship",
//     },
//     {
//       from: "Knowledgeable",
//       to: "Masters",
//     },
//     {
//       from: "Knowledgeable",
//       to: "Climatebase Fellowship",
//     },
//     {
//       from: "Competent Programmer",
//       to: "Rest Days",
//     },
//     {
//       from: "Rest Days",
//       to: "Smart Compass",
//     },
//     {
//       from: "Rest Days",
//       to: "Tangled Trees",
//     },
//     {
//       from: "Rest Days",
//       to: "Yenta",
//     },
//     {
//       from: "Competent Programmer",
//       to: "Wryze",
//     },
//     {
//       from: "Fun & Tight Social Circle",
//       to: "Throw a party",
//     },
//     {
//       from: "Financial Independence",
//       to: "Cover Expenses",
//     },
//     {
//       from: "Cover Expenses",
//       to: "Freelance",
//     },
//     {
//       from: "Freelance",
//       to: "Fiverr",
//     },
//     {
//       from: "Freelance",
//       to: "Reach out to paul",
//     },
//     {
//       from: "Environmentalist",
//       to: "Wryze",
//     },
//     {
//       from: "Caring Family Member",
//       to: "Call Mom",
//     },
//     {
//       from: "Caring Family Member",
//       to: "Call Dad",
//     },
//     {
//       from: "Caring Family Member",
//       to: "Call Gram",
//     },
//     {
//       from: "Caring Family Member",
//       to: "Call Jake",
//     },
//     {
//       from: "Good Partner",
//       to: "Something Nice for Courtney",
//     },
//     {
//       from: "Eclectic Outdoorsman",
//       to: "Running",
//     },
//     {
//       from: "Eclectic Outdoorsman",
//       to: "Mountain Biking",
//     },
//     {
//       from: "Mountain Biking",
//       to: "White Rim",
//     },
//     {
//       from: "Running",
//       to: "RRR",
//     },
//     {
//       from: "Running",
//       to: "WURL",
//     },
//     {
//       from: "Running",
//       to: "5 min mile",
//     },
//     {
//       from: "Running",
//       to: "Boston",
//     },
//     {
//       from: "Lead a Conscious Life",
//       to: "Journal",
//     },
//     {
//       from: "Knowledgeable",
//       to: "Reading",
//     },
//     {
//       from: "Reading",
//       to: "Atomic Habits",
//     },
//     {
//       from: "Reading",
//       to: "Mans Search for Meaning",
//     },
//     {
//       from: "Knowledgeable",
//       to: "Movies",
//     },
//     {
//       from: "Movies",
//       to: "Dopesick",
//     },
//     {
//       from: "Movies",
//       to: "Before Sunrise",
//     },
//     {
//       from: "Healthy & Fit",
//       to: "Try new meal",
//     },
//     {
//       from: "Try new meal",
//       to: "Vegetable Biryani",
//     },
//     {
//       from: "Live in a Cool Place",
//       to: "Van",
//     },
//     {
//       from: "Caring Family Member",
//       to: "Monster Truck with Ben",
//     },
//     {
//       from: "Something Nice for Courtney",
//       to: "Real Salt Lake Game",
//     },
//     {
//       from: "Eclectic Outdoorsman",
//       to: "Backcountry Skiing",
//     },
//     {
//       from: "Backcountry Skiing",
//       to: "Get Skins",
//     },
//     {
//       from: "Backcountry Skiing",
//       to: "Replace Beacon",
//     },
//   ],
// };

let graph = JSON.parse(localStorage.getItem("graph")) || newGraph();

function setGraph(newGraph) {
  graph = newGraph;
  localStorage.setItem("graph", JSON.stringify(newGraph));
  UpdateState();
}

export { graph, setGraph };
