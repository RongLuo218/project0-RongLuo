window.HEADPHONE_FACTS = [
  {
    id: "market-to-waste",
    parts: [],
    title: "FROM MARKET TO WASTE",
    fact: "Because headphones are small, most discarded pairs are already collected and recycled efficiently.",
    modelFact: "Headphone sales could reach 211.7 million units by 2028. Yet only around 15% of discarded headphones are recycled, while more than 85% are thrown away as waste.",
    sourcePlacement: "model",
    sources: [
      { title: "European Commission JRC repairability report", url: "https://publications.jrc.ec.europa.eu/repository/bitstream/JRC139725/JRC139725_01.pdf" },
      { title: "Sidiqua et al. (2024)", url: "https://www.sciencedirect.com/science/article/pii/S2949750724000464" }
    ]
  },
  {
    id: "cushions",
    parts: ["top-cushion", "left-cushion", "right-cushion"],
    title: "Cushions",
    fact: "Ear pads and headband padding are among the parts most likely to wear out. Exposed to pressure, heat and moisture during use, they can fail before the electronics do. Replacing them should be a simple repair that does not require opening the main electronic structure.",
    sources: [
      { title: "European Commission JRC repairability report", url: "https://publications.jrc.ec.europa.eu/repository/bitstream/JRC139725/JRC139725_01.pdf" }
    ]
  },
  {
    id: "battery",
    parts: ["battery"],
    title: "Battery",
    fact: "A life-cycle study of wireless over-ear headphones found a total climate impact of 12.17 kg CO2-eq, with manufacturing responsible for 81.2%. When the study modelled a battery replacement that doubled the product lifetime, impact per hour fell from 4.7 g to 2.4 g CO2-eq.",
    modelFact: "Replacing a battery has almost no environmental benefit because the battery is only a small part of the headphone.",
    sources: [
      { title: "Life Cycle Assessment of Wireless Headphones", url: "https://link.springer.com/chapter/10.1007/978-3-031-29294-1_2" }
    ]
  },
  {
    id: "circuit-board",
    parts: ["circuit-board"],
    title: "Circuit board and charging",
    fact: "A charging port is always a separate standard part, so a charging fault is usually easy to repair.",
    modelFact: "A circuit board may be small, but it connects charging, control and audio functions. If the charging port is integrated into the main board, a small fault can make repair much harder.",
    sourcePlacement: "model",
    sources: [
      { title: "iFixit wireless headphone repairability research", url: "https://www.ifixit.com/News/117206/were-now-scoring-wireless-headphones-for-repairability" }
    ]
  },
  {
    id: "noise-cancellation",
    parts: ["left-earcup", "right-earcup"],
    title: "Earcups and noise cancellation",
    fact: "Opening or replacing an earcup never affects active noise cancellation, because each part works independently.",
    modelFact: "Active noise cancellation can make repair more difficult. microphones and earcups may be calibrated together, so opening or replacing a part can affect how the system performs.",
    sourcePlacement: "model",
    sources: [
      { title: "iFixit wireless headphone repairability research", url: "https://www.ifixit.com/News/117206/were-now-scoring-wireless-headphones-for-repairability" }
    ]
  },
  {
    id: "green-is-not-enough",
    parts: [],
    title: "Green is not enough",
    fact: "Solar charging makes a headphone sustainable even when its battery cannot be replaced, because renewable energy matters more than repair.",
    modelFact: "Fairbuds XL and some Sony headphone models offer selected replacement parts, such as ear pads or batteries, so users may repair one part instead of replacing the whole product. After seeing these parts, what do you think makes a headphone truly sustainable?",
    sourcePlacement: "model",
    sources: [
      { title: "Fairbuds XL spare parts", url: "https://www.fairphone.com/shop/category/spare-parts-fairbuds-xl-2023-186" },
      { title: "Sony WH-1000XM6 replacement ear pads", url: "https://pur.store.sony.jp/parts/products/hp-earpad/ZZ-WHXM6EAR_product/" },
      { title: "Sony repair guidance", url: "https://www.sony.com.au/electronics/support/mobile-phone-tablet-accessories-power-docks-cables/uch12/articles/00405708" }
    ]
  }
];
