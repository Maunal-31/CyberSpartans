export const mockTickets = [
  {
    id: "TCK-1042",
    customerName: "Alex Mercer",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    summary: "Received shattered display unit. Unacceptable!",
    channel: "Email",
    timeAgo: "10m ago",
    sentiment: "Angry",
    priority: "High",
    category: "Product Issue",
    product: "Quantum Display Monitor",
    sku: "QDM-2000",
    details: "I ordered the quantum display monitor and it arrived completely shattered. The packaging was barely intact. This is completely unacceptable and I need a replacement immediately.",
    image: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&auto=format&fit=crop&q=60", // Broken screen
    aiAnalysis: {
      suggestedCategory: "Product Damage",
      confidence: 98,
      sentimentScore: -0.9,
      keyPhrases: ["shattered display", "barely intact packaging", "need replacement immediately"],
    },
    aiRecommendation: {
      action: "Approve Replacement",
      reasoning: "Image analysis confirms severe transit damage. Customer sentiment is highly negative. SLA requires immediate action.",
      autoResponse: "We sincerely apologize for the damaged monitor. A replacement has been approved and is being processed."
    }
  },
  {
    id: "TCK-1043",
    customerName: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    summary: "Missing power cable in the box",
    channel: "Web Form",
    timeAgo: "45m ago",
    sentiment: "Frustrated",
    priority: "Medium",
    category: "Packaging Issue",
    product: "Echo Smart Speaker",
    sku: "ESS-100",
    details: "The package arrived yesterday but it's missing the main power cable so I can't even turn the device on. Please send one.",
    image: null,
    aiAnalysis: {
      suggestedCategory: "Missing Parts",
      confidence: 95,
      sentimentScore: -0.4,
      keyPhrases: ["missing power cable", "can't turn device on"],
    },
    aiRecommendation: {
      action: "Ship Missing Part",
      reasoning: "Standard missing item claim. Low fraud risk. Part in stock.",
      autoResponse: "We apologize for the missing cable. A replacement cable has been scheduled for dispatch today."
    }
  },
  {
    id: "TCK-1044",
    customerName: "David Chen",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    summary: "Question about bulk ordering",
    channel: "Chat",
    timeAgo: "2h ago",
    sentiment: "Neutral",
    priority: "Low",
    category: "Trade Inquiry",
    product: "Quantum Display Monitor",
    sku: "QDM-2000",
    details: "Hi, I represent a school district and we are looking to order 50 units. Are there any bulk discounts available?",
    image: null,
    aiAnalysis: {
      suggestedCategory: "Sales / B2B",
      confidence: 99,
      sentimentScore: 0.1,
      keyPhrases: ["bulk ordering", "school district", "50 units", "bulk discounts"],
    },
    aiRecommendation: {
      action: "Route to Sales",
      reasoning: "B2B sales inquiry. Not a support issue.",
      autoResponse: "Thank you for your interest! I'm transferring your request to our B2B sales team who will provide you with a custom quote."
    }
  },
  {
    id: "TCK-1045",
    customerName: "Maria Garcia",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    summary: "Package delayed for 3 days",
    channel: "Twitter",
    timeAgo: "3h ago",
    sentiment: "Frustrated",
    priority: "Medium",
    category: "Shipping Issue",
    product: "Quantum Display Monitor",
    sku: "QDM-2000",
    details: "My tracking says out for delivery but it's been 3 days. FedEx is the worst.",
    image: null,
    aiAnalysis: {
      suggestedCategory: "Delivery Delay",
      confidence: 94,
      sentimentScore: -0.6,
      keyPhrases: ["delayed for 3 days", "FedEx is the worst"],
    },
    aiRecommendation: {
      action: "Contact Shipper",
      reasoning: "Continuous issues detected with this shipper route. Requires intervention.",
      autoResponse: "We apologize for the delay. We are contacting the courier immediately to resolve this."
    }
  },
  {
    id: "TCK-1046",
    customerName: "James Wilson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    summary: "Box crushed on arrival",
    channel: "Email",
    timeAgo: "4h ago",
    sentiment: "Angry",
    priority: "High",
    category: "Shipping Issue",
    product: "Quantum Display Monitor",
    sku: "QDM-2000",
    details: "The FedEx driver practically threw the box and it is completely crushed.",
    image: null,
    aiAnalysis: {
      suggestedCategory: "Transit Damage",
      confidence: 97,
      sentimentScore: -0.8,
      keyPhrases: ["box crushed", "threw the box", "FedEx"],
    },
    aiRecommendation: {
      action: "Approve Replacement & Log Carrier Strike",
      reasoning: "High correlation of damage with this carrier in the region.",
      autoResponse: "We are so sorry about this. A replacement is being processed and we are logging a formal complaint with the carrier."
    }
  }
];
