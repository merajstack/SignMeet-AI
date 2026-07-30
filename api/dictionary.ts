const aslDictionary = [
  {
    id: "asl-1",
    sign: "HELLO",
    category: "Greetings",
    description: "Touch fingertips of right hand to forehead, then move hand outward in a small wave gesture.",
    handshape: "Flat B-handshape",
    movement: "Salute outward from forehead"
  },
  {
    id: "asl-2",
    sign: "THANK YOU",
    category: "Polite",
    description: "Touch fingertips of right hand to chin, then extend hand outward towards the person.",
    handshape: "Open flat palm",
    movement: "Forward movement from chin"
  },
  {
    id: "asl-3",
    sign: "PLEASE",
    category: "Polite",
    description: "Place open right hand over chest and rub in a gentle circular motion.",
    handshape: "Open palm on chest",
    movement: "Circular motion clockwise"
  },
  {
    id: "asl-4",
    sign: "ACCESSIBILITY",
    category: "Tech & Workplace",
    description: "Circle both hands with thumbs and index fingers joined, then open palms upward.",
    handshape: "OK hands transitioning to open palms",
    movement: "Outward expanding arc"
  },
  {
    id: "asl-5",
    sign: "HELP",
    category: "Common",
    description: "Place closed right hand with thumb up onto open left palm, move both hands upward together.",
    handshape: "A-handshape thumbs up resting on flat palm",
    movement: "Upward lift"
  },
  {
    id: "asl-6",
    sign: "MEETING",
    category: "Tech & Workplace",
    description: "Bring both hands together with fingers tapping in front of chest repeatedly.",
    handshape: "Open claw hands facing each other",
    movement: "Repeated closing tap"
  },
  {
    id: "asl-7",
    sign: "GOOD MORNING",
    category: "Greetings",
    description: "Sign 'GOOD' (chin to palm) followed by 'MORNING' (arm rising like sun).",
    handshape: "Flat hand chin to palm + forearm horizontal rise",
    movement: "Two part compound gesture"
  },
  {
    id: "asl-8",
    sign: "YES",
    category: "Common",
    description: "Make an S-handshape fist and nod it up and down like a head nodding.",
    handshape: "S-fist",
    movement: "Up and down nod motion"
  }
];

export default async function handler(req, res) {
  const query = (req.query.q || "").toLowerCase();
  if (query) {
    const filtered = aslDictionary.filter(item =>
      item.sign.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
    return res.status(200).json(filtered);
  }
  return res.status(200).json(aslDictionary);
}
