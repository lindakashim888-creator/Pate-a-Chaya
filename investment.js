/* Pâte à Chaya | investment comparison and cash-flow model */
(() => {
  "use strict";
  const study = {
  "small": {
    "kit": [
      [
        "Four-tray convection oven",
        1,
        70000,
        "Prego CV043E advertised 60,000, tax status to confirm. Budget 70,000. Four 450 × 340 mm trays, 2.6 kW, 230 V. Compare dealer service and full-load browning.",
        "https://www.aajjo.com/product/electric-convection-oven-enamel-coat-cv043e-prego-in-ernakulam-universal-catering-kitchen-equipment"
      ],
      [
        "10 L planetary mixer",
        1,
        41300,
        "35,000 plus seller-listed 18% GST. 1 kg flour / 2 kg cream reference. Trial actual paste weight.",
        "https://restaurant.store/product/planetary-food-mixer-10-litre/"
      ],
      [
        "172 L undercounter chiller",
        1,
        73160,
        "Hoshizaki RTW70MS4 listed at 62,000 plus seller-listed 18% GST. 702 × 765 × 850 mm. Validate loaded recovery and packing space.",
        "https://alisterindia.com/product/hoshizaki-ss-undercounter-chiller-single-door-rtw-70-ms4/"
      ],
      [
        "Induction hob and cookware",
        1,
        8500,
        "3.5 kW hob comparison 7,200. Allow 1,300 for pan/top-up.",
        "https://www.tradeindia.com/products/commercial-induction-stainless-steel-3-5-kw-425-350-110-mm-c10222142.html"
      ],
      [
        "Single-bowl wash station",
        1,
        15000,
        "Kerala supplier category benchmark 14,500. A larger Edappally sink-table lists at 19,800.",
        "https://www.dial4trade.com/kerala/stainless-steel-kitchen-sinks.htm"
      ],
      [
        "Separate handwash basin and tap",
        1,
        7500,
        "Allowance. Specify independent handwash next to entry.",
        ""
      ],
      [
        "Stainless clean prep bench",
        1,
        14000,
        "Allowance for local fabrication. Take room and tray measurements.",
        ""
      ],
      [
        "Cooling rack and shelves",
        1,
        8500,
        "Allowance. Confirm foot depth, pan compatibility and tray count.",
        ""
      ],
      [
        "Trays, piping kit and bowls",
        1,
        7500,
        "Allowance for spare trays, bags, tips, bowls and washable bins.",
        ""
      ],
      [
        "Scales, probes and data logger",
        1,
        4500,
        "Allowance. Check calibration and logged holding temperatures.",
        ""
      ],
      [
        "Insulated pickup carriers",
        1,
        3500,
        "Allowance. Test travel and thermal performance with real orders.",
        ""
      ],
      [
        "Folding pickup counter and sign",
        1,
        6000,
        "Allowance. Reuse gate and pavilion shade once access is suitable.",
        ""
      ],
      [
        "Electrical circuits and isolators",
        1,
        18000,
        "Provisional. Oven + hob alone draw 6.1 kW before chiller, mixer and base loads.",
        ""
      ],
      [
        "Water points and drainage",
        1,
        15000,
        "Provisional. Separate fixtures and verify potable water and waste connections.",
        ""
      ],
      [
        "Washable finishes and repairs",
        1,
        12000,
        "Provisional patch repairs. Obtain a measured contractor quote.",
        ""
      ],
      [
        "Screening and basic hygiene setup",
        1,
        8000,
        "Allowance for screens, lids, cleanable storage and cleaning station.",
        ""
      ],
      [
        "Entry, awning and route survey",
        1,
        7500,
        "Allowance for assessment and minor works only. Major roofing and service upgrades trigger rebudget.",
        ""
      ],
      [
        "Freight, commissioning and install",
        1,
        13500,
        "One shared allowance across orders. Request delivered, tax-inclusive item breakdown.",
        ""
      ],
      [
        "Preopening trials, admin and training",
        1,
        6500,
        "Allowance. Includes pre-trading trial materials and admin only.",
        ""
      ]
    ],
    "optional": [
      [
        "Guest chairs",
        4,
        980,
        "Nilkamal CHR4002 listed at 980. Novella 07 at 2,250 would cost 9,000 for four, a 5,080 premium.",
        "https://www.nilkamalfurniture.com/collections/armless-plastic-chairs"
      ],
      [
        "Two-seat folding tables",
        2,
        2990,
        "IKEA TÄRNÖ 55×54 cm. Confirm delivery and flat, dry placement.",
        "https://www.ikea.com/in/en/cat/outdoor-tables-700191/f/foldable-outdoor-tables-f-feature--47467/"
      ],
      [
        "Chilled display cabinet",
        1,
        50000,
        "Indicative cake display listing only. Check chilling and cleanability.",
        "https://www.rahaindia.net/display-counter.html"
      ],
      [
        "Tea, crockery and counter kit",
        1,
        12000,
        "Unquoted allowance.",
        ""
      ],
      [
        "Ground-level servicing, finishes, lighting",
        1,
        45000,
        "Unquoted allowance. Add toilets, structural or access work if needed.",
        ""
      ]
    ],
    "recipe": [
      [
        "Unsalted butter",
        1,
        "kg",
        600
      ],
      [
        "Maida",
        1,
        "kg",
        55
      ],
      [
        "White eggs",
        40,
        "each",
        7.5
      ],
      [
        "Milk",
        4,
        "litre",
        64
      ],
      [
        "Cream",
        1.4,
        "litre",
        240
      ],
      [
        "Dark chocolate",
        1.1,
        "kg",
        850
      ],
      [
        "Sugar and starch",
        1,
        "kg equivalent",
        80
      ],
      [
        "Vanilla, cardamom and garnish",
        1,
        "batch",
        198
      ]
    ],
    "staff": [
      [
        "Owner draw for orders, prep and handover",
        8000,
        "32 planning hours/month at 250. Include draw in cash reserve."
      ],
      [
        "Sessional baker",
        8000,
        "4 eight-hour sessions at 2,000. Arrange paid prep/cleaning within hours."
      ],
      [
        "Compound use and upkeep payment",
        4000,
        "Model assumes a monthly cash allocation paid to site owner. No external lease deposit."
      ],
      [
        "Cleaning, pests and grounds",
        2000,
        "Monthly service allowance."
      ],
      [
        "Base power, phone and admin",
        2000,
        "Fixed provision. Incremental oven/hob use sits in box cost."
      ]
    ]
  },
  "big": {
    "kit": [
      [
        "Four-tray UNOX convection oven",
        1,
        294000,
        "248,920 ex tax × 1.18 ≈ 293,726, rounded. 6.3 kW.",
        "https://www.unox.com/en_in/ovens/bakerlux-classic-xena-04eu-ealp/"
      ],
      [
        "RDS-520T reversible sheeter",
        1,
        199000,
        "168,000 comparator; tax status to confirm. 18% model buffer.",
        "https://www.tradeindia.com/products/520-dough-sheeter-rds-520t-c12551536.html"
      ],
      [
        "EPO16 proofer",
        1,
        60000,
        "50,399 ex tax. Check trolley, tray pitch, humidity and usable height.",
        "https://www.coldshell.in/product/coldshell-electric-proofer-16-tray-epo16/"
      ],
      [
        "Upright chiller STF600TNM",
        1,
        77000,
        "65,048 ex tax. Check service and pull-down against product sizes.",
        "https://www.thecentrl.in/category/kitchen-essentials"
      ],
      [
        "Upright freezer STF600BTM",
        1,
        107000,
        "90,405 ex tax. Separate frozen and positive storage.",
        "https://www.thecentrl.in/category/kitchen-essentials"
      ],
      [
        "HS-20 spiral dough mixer",
        1,
        69000,
        "58,000 comparator plus tax provision. Check minimum dough weight.",
        "https://www.tradeindia.com/products/hs-20-spiral-mixer-c12551507.html"
      ],
      [
        "10 L planetary mixer",
        1,
        41300,
        "35,000 plus seller-stated 18% GST.",
        "https://restaurant.store/product/planetary-food-mixer-10-litre/"
      ],
      [
        "Induction hob + pans",
        1,
        8500,
        "3.5 kW hob benchmark 7,200; cookware allowance included.",
        "https://www.tradeindia.com/products/commercial-induction-stainless-steel-3-5-kw-425-350-110-mm-c10222142.html"
      ],
      [
        "Rolling-room AC + normal install",
        1,
        50000,
        "Item benchmark ~35,990. Obtain heat-load survey and confirm installation.",
        "https://www.myg.in/air-conditioners-en/voltas-en/1-5-ton/"
      ],
      [
        "Prep and rolling benches",
        2,
        18000,
        "Fabricator allowance.",
        ""
      ],
      [
        "Utensil sink and handwash",
        1,
        22500,
        "Allow for two separate fixtures.",
        ""
      ],
      [
        "Trays, rack, tins and piping",
        1,
        30000,
        "Budget for second tray set and cooling rack.",
        ""
      ],
      [
        "Scales, probes and loggers",
        1,
        6500,
        "Allowance for calibrated instruments.",
        ""
      ],
      [
        "Insulated carriers",
        1,
        5000,
        "Pickup and dispatch allowance.",
        ""
      ],
      [
        "Water pretreatment",
        1,
        25000,
        "Allowance pending source-water testing.",
        ""
      ],
      [
        "Drain and water hookups",
        1,
        20000,
        "Provisional. Measure locally.",
        ""
      ],
      [
        "Survey, circuits and earthing",
        1,
        45000,
        "Preliminary distribution. Supply reinforcement excluded.",
        ""
      ],
      [
        "Oven extraction and ventilation",
        1,
        35000,
        "Design and price against oven maker guidance.",
        ""
      ],
      [
        "Freight, stand and commissioning",
        1,
        40000,
        "One shared allowance for machine delivery and startup.",
        ""
      ]
    ],
    "front": [
      [
        "Everyday stackable chairs",
        24,
        950,
        "Planning allowance, alternative purchase by local quote.",
        "https://www.nilkamalfurniture.com/collections/armless-plastic-chairs"
      ],
      [
        "Four-seat tables",
        6,
        3590,
        "Nilkamal price comparator.",
        "https://www.nilkamalfurniture.com/"
      ],
      [
        "Front counter and storage",
        1,
        35000,
        "Local fabrication allowance.",
        ""
      ],
      [
        "Refrigerated display",
        1,
        59000,
        "50,000 cabinet comparator plus model tax buffer.",
        "https://www.rahaindia.net/display-counter.html"
      ],
      [
        "Chaya / filter coffee setup",
        1,
        22000,
        "Hot beverage and service equipment allowance.",
        ""
      ],
      [
        "POS, printer and connectivity",
        1,
        12000,
        "Allowance.",
        ""
      ],
      [
        "Crockery and service utensils",
        1,
        15000,
        "Allowance.",
        ""
      ],
      [
        "Ground-level WC and guest wash",
        1,
        50000,
        "Allowance. Confirm accessible ground-level layout.",
        ""
      ],
      [
        "Dry route, weather and damp repairs",
        1,
        55000,
        "Minor works only. Check monsoon route.",
        ""
      ],
      [
        "Kitchen washable finishes",
        1,
        50000,
        "Minor works only.",
        ""
      ],
      [
        "Lighting, sign and menu boards",
        1,
        22000,
        "Allowance.",
        ""
      ],
      [
        "Site survey and layout fees",
        1,
        15000,
        "Allowance. Verify building condition.",
        ""
      ]
    ],
    "staff": [
      [
        "Lead pastry baker",
        1,
        32000,
        "Lead lamination schedule and batch records."
      ],
      [
        "Baker / commis",
        1,
        24000,
        "Choux, filling, bake and handover."
      ],
      [
        "Kitchen prep/utility staff",
        2,
        16000,
        "One prep and one wash/utility role."
      ],
      [
        "Counter lead / cashier",
        1,
        19000,
        "POS, pickup and returns."
      ],
      [
        "Floor / bar service",
        1,
        17000,
        "Table turnaround and drinks."
      ],
      [
        "Owner-manager cash draw",
        1,
        22000,
        "Active floor and ordering cover."
      ],
      [
        "Relief / overtime budget",
        1,
        13000,
        "Cover rotating rest days, prep peaks and events."
      ],
      [
        "Payroll on-cost allowance",
        1,
        10000,
        "Provision; verify employment terms locally."
      ],
      [
        "Site rent/use cash payment",
        1,
        30000,
        "Unquoted cash occupancy assumption."
      ],
      [
        "Power, water and fuel",
        1,
        20000,
        "Monthly operating bill allowance."
      ],
      [
        "Cleaning, pest and grounds",
        1,
        8000,
        "Routine outsourced service."
      ],
      [
        "POS, phone and accounting",
        1,
        5000,
        "Monthly allowance."
      ],
      [
        "Local marketing",
        1,
        8000,
        "Routine monthly promotion."
      ],
      [
        "Routine maintenance",
        1,
        5000,
        "Service and minor repairs."
      ],
      [
        "Insurance and miscellaneous",
        1,
        5000,
        "Allowance."
      ]
    ],
    "initial": [
      [
        "Applications / onboarding",
        12000
      ],
      [
        "Recruitment and trial batches",
        20000
      ],
      [
        "Opening marketing",
        12000
      ],
      [
        "Refundable rent deposit",
        90000
      ],
      [
        "Ingredient minimum stock",
        30000
      ],
      [
        "Packaging minimum stock",
        10000
      ]
    ],
    "event": [
      [
        "Rental chairs",
        16,
        35
      ],
      [
        "Rental four-seat tables",
        4,
        200
      ],
      [
        "Rain canopy modules",
        3,
        2000
      ],
      [
        "Delivery, erection and dismantling",
        1,
        1500
      ],
      [
        "Casual event stewards",
        2,
        800
      ]
    ],
    "ramp": [
      [
        22,
        3,
        2,
        0,
        0
      ],
      [
        30,
        5,
        3,
        1,
        30
      ],
      [
        36,
        6,
        4,
        1,
        36
      ],
      [
        40,
        7,
        5,
        2,
        36
      ],
      [
        42,
        8,
        5,
        2,
        40
      ],
      [
        45,
        8,
        6,
        2,
        40
      ]
    ]
  }
};

  const money = n => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0
  }).format(n);
  const unitRate = n => Number.isInteger(n) ? money(n) : new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const count = n => new Intl.NumberFormat("en-IN").format(n);
  const sumLines = rows => rows.reduce((total, row) => total + row[1] * row[2], 0);
  const clean = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lakh = n => "₹" + (n / 100000).toFixed(2) + " lakh";
  const upgrade = {
  "parking": [
    [
      "Exterior turning and runoff survey",
      1,
      18000,
      "Provisional. Measure only the separate exterior parking land."
    ],
    [
      "Compacted permeable gravel pilot strip",
      120,
      600,
      "120 m² trial surface on sound formation. Verify excavation, bearing and drainage."
    ],
    [
      "Exterior surface drain and discharge tie",
      30,
      1150,
      "30 linear metres. Separate from building water hookups and internal damp repairs."
    ],
    [
      "External pedestrian approach",
      24,
      900,
      "24 m² surfaced crossing and arrival strip outside the compound."
    ],
    [
      "Traffic cones, reflective markers and stops",
      1,
      24000,
      "External direction and vehicle segregation allowance."
    ],
    [
      "Parking approach lighting",
      4,
      4000,
      "Four exterior installations. Separate from café/menu lighting."
    ],
    [
      "Groundcover, mulch and edge planting",
      40,
      400,
      "40 m² first planting area. Keep mature canopy and roots."
    ]
  ],
  "unitAssets": [
    [
      "Batch label printer and starter media",
      1,
      22000,
      "Dedicated batch IDs and trace labels. Existing POS receipt printer and probes remain separate."
    ]
  ],
  "program": [
    [
      "Standard recipes, process sheets and SOPs",
      8,
      5500,
      "Eight development days. Produce weighed formulas, waste limits and opening and closing checklists."
    ],
    [
      "Training manual and train-the-trainer sessions",
      6,
      6500,
      "Six days of master training development, distinct from hiring and regular shift pay."
    ],
    [
      "Packaging artwork and prototype dielines",
      3,
      8000,
      "Three original formats for a box, sleeve and transport insert."
    ],
    [
      "Transit and seal validation trials",
      6,
      3000,
      "Six delivery trials. Covers additional trial materials and couriers."
    ],
    [
      "Initial external laboratory and QA work",
      4,
      6000,
      "Four private lab test allowances. Obtain proposed method, sample count and lab quote."
    ],
    [
      "Brand/IP and franchise document review",
      1,
      35000,
      "Legal and professional preparation budget. No external brand rights assumed."
    ],
    [
      "Supplier qualification and mock recall",
      3,
      5500,
      "Three supervised exercises to trace inputs to lots and check alternate vendors."
    ],
    [
      "Neighbourhood demand and partner trials",
      2,
      12000,
      "Two independent paid-market tests, beyond the opening-day marketing budget."
    ]
  ],
  "franchiseeStart": [
    [
      "Replica operator induction and launch audit",
      1,
      35000,
      "Local induction, travel and opening QA."
    ],
    [
      "Hypothetical franchise entry fee",
      1,
      100000,
      "Commercial test term only. No franchise rights offered or signed."
    ]
  ],
  "smallExtra": [
    [
      "Exterior collection cones and portable direction sign",
      1,
      5000,
      "Timed pedestrian pickup only. Excludes car-park installation."
    ]
  ],
  "ownerOngoing": [
    [
      "Ongoing QA sampling and supplier reviews",
      1,
      5000,
      "Incremental site QA."
    ],
    [
      "New-starter coaching and recipe control",
      1,
      6000,
      "Incremental training allowance."
    ],
    [
      "Trace system support and audit records",
      1,
      4000,
      "Incremental systems support, distinct from POS."
    ]
  ],
  "replicaOngoing": [
    [
      "Local calibration and compliance sampling",
      1,
      3000,
      "Incremental replica QA."
    ],
    [
      "New-starter and trace record allowance",
      1,
      4000,
      "Local training and trace upkeep."
    ]
  ],
  "owner": {
    "opening": 2282614,
    "fixed": 240000,
    "royalty": 0
  },
  "franchisee": {
    "opening": 2264164,
    "fixed": 257000,
    "royalty": 0.05
  }
};
  study.small.kit.push(...upgrade.smallExtra);
  study.small.staff[2] = ["Owner-site carry and upkeep",4000,"Cash allowance for the owner property, with zero commercial rent."];
  const copy = {
    small: {
      title: "The pickup kitchen", short: "Pickup kitchen", tag: "Preorder model", image: "plan-small.webp",
      alt: "A small Kerala bakehouse with a ground-level pickup counter",
      summary: "Four éclairs in a box. One prepaid collection day a week.",
      opening: Math.round(sumLines(study.small.kit) * 1.1), fixed: 24000,
      fixedLabel: "Owner + one sessional baker", base: [100, 0], quiet: [60, 0], strong: [150, 0],
      start: 3, fields: [["boxes", "Boxes sold per month", 0, 200, 1], ["trade", "Dealer share", 0, 100, 1, "%"]]
    },
    big: {
      title: "The garden flagship", short: "Garden flagship", tag: "Franchise development", image: "plan-big.webp",
      alt: "A low-rise café and outdoor tables in a shaded Kerala garden",
      summary: "Twenty-four everyday seats, in-house pastry and a training system for future operators.",
      opening: upgrade.owner.opening,
      fixed: upgrade.owner.fixed, fixedLabel: "Six staff + working owner", base: [45, 8, 6, 2, 40], quiet: [32, 5, 3, 1, 30], strong: [60, 11, 7, 2, 40],
      start: 7, fields: [["onsite", "On-site orders per day", 0, 100, 1], ["swiggy", "Swiggy orders per day", 0, 30, 1], ["zomato", "Zomato orders per day", 0, 30, 1], ["events", "Events per month", 0, 2, 1], ["guests", "Guests per event", 0, 40, 1]]
    }
  };

  function smallMonth(values) {
    const [boxes, share] = values;
    const trade = Math.round(boxes * share / 100);
    const direct = boxes - trade;
    const sales = 400 * direct + 320 * trade;
    const variable = 160 * boxes;
    return {sales, variable, trade, direct, gross: sales - variable, profit: sales - variable - copy.small.fixed, ar: 0, eventCost: 0};
  }

  function bigMonth(values, operator="owner", royaltyRate=upgrade[operator].royalty) {
    const [onsite, swiggy, zomato, events, guests] = values;
    const onsiteCount = onsite * 26;
    const appCount = (swiggy + zomato) * 26;
    const attendance = events * guests;
    const apps = appCount * 410;
    const sales = onsiteCount * 250 + apps + attendance * 650;
    const platform = apps * 0.25;
    const food = onsiteCount * 80 + appCount * 137 + attendance * 185;
    const pack = onsiteCount * 8 + appCount * 20 + attendance * 25;
    const eventCost = events * sumLines(study.big.event);
    const variable = platform + food + pack + eventCost;
    const royalty = sales * royaltyRate;
    const fixed = upgrade[operator].fixed;
    const bills = food + pack + eventCost + royalty + fixed;
    return {sales, food, pack, platform, eventCost, variable, gross: sales - variable, royalty, fixed, bills, profit: sales - variable - fixed - royalty, ar: (apps - platform) * 14 / 30};
  }

  function forecast(plan, values, operator="owner", royaltyRate=upgrade[operator].royalty) {
    const model = copy[plan];
    const calc = plan === "small" ? smallMonth : units => bigMonth(units,operator,royaltyRate);
    const ramp = plan === "small" ? [[60, 0], [100, 0]] : study.big.ramp;
    let position = -(plan === "small" ? model.opening : upgrade[operator].opening);
    let lastAR = 0;
    let deepest = position;
    const months = ramp.map(units => {
      const month = calc(units);
      const movement = month.profit - month.ar + lastAR;
      position += movement;
      lastAR = month.ar;
      deepest = Math.min(deepest, position);
      return {...month, movement, position,receipts:movement+(month.bills??(month.variable+model.fixed))};
    });
    const steady = calc(values);
    const firstCash = steady.profit - steady.ar + lastAR;
    const firstClose = position + firstCash;
    const payback = firstClose >= 0 ? model.start : steady.profit > 0 ? model.start + Math.ceil(-firstClose / steady.profit) : null;
    const fiveYears = firstClose + (60 - model.start) * steady.profit;
    return {...steady, payback, fiveYears, months, peakRamp: -deepest};
  }

  const table = (headers, rows) => `<div class="inv-table-scroll"><table><thead><tr>${headers.map(h => `<th scope="col">${clean(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((v, i) => i === 0 ? `<th scope="row">${v}</th>` : `<td>${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const source = (label, url) => `<a href="${clean(url)}" target="_blank" rel="noopener noreferrer">${clean(label)} <span aria-label="opens in new tab">↗</span></a>`;
  function items(rows) {
    return table(["Item", "Qty", "Unit", "Budget"], rows.map(([label, qty, rate, note, url]) => [
      `<span>${clean(label)}</span>${note ? `<small>${clean(note.replace(/;/g, ".")).replace(/\. ([A-Z])/g, ". $1")}${url ? " " + source("Price reference", url) : ""}</small>` : ""}`,
      count(qty), money(rate), money(qty * rate)
    ]));
  }
  function accordion(label, amount, content) {
    return `<details class="inv-disclosure"><summary><span>${label}</span><span class="inv-disclosure-value">${amount}</span><i class="inv-toggle" aria-hidden="true"></i></summary><div class="inv-disclosure-body">${content}</div></details>`;
  }
  const description = t => `<p class="inv-note">${t}</p>`;
  const sub = t => `<h5 class="inv-subtitle">${t}</h5>`;
  function smallLedger() {
    const rows = study.small.kit;
    return [
      accordion("Opening purchases & site works", money(copy.small.opening),
        description("One production room, a ground-level dispatch counter and four prepaid collection sessions per month. Capital allowances assume the existing shell and services can be reused.") +
        sub("Kitchen & dispatch · ₹2,53,460") + items(rows.slice(0, 11)) + sub("Frontage, connections & opening · ₹91,500") + items(rows.slice(11)) +
        table(["Opening budget", "Amount"], [["Direct items", money(sumLines(rows))], ["10% contingency", money(34496)], ["Total opening allocation", money(copy.small.opening)]])),
      accordion("Staffing & monthly overhead", money(copy.small.fixed),
        table(["Role or expense", "Monthly cash"], study.small.staff.map(([label, amount, note]) => [`${clean(label)}<small>${clean(note)}</small>`, money(amount)])) +
        description("One baker works four eight-hour sessions. The owner contributes 32 paid hours each planning month. Higher output requires a timed capacity trial and a new labour provision if these hours are exceeded.")),
      accordion("Recipe, sale price & dealer margin", "₹160 / box",
        description("One box holds two chocolate and two cardamom éclairs. One test batch yields 24 saleable boxes. Keep a written record of rejects and the weight of each shell and filling.") +
        table(["Ingredient", "Batch", "Rate", "Cost"], study.small.recipe.map(([label, qty, unit, rate]) => [clean(label), qty + " " + clean(unit), unitRate(rate), money(qty * rate)])) +
        description("₹2,760 ingredients ÷ 24 boxes = ₹115. Add ₹25 for packaging, ₹10 incremental energy and ₹10 dispatch supplies. Direct pickup retains ₹400 and contributes ₹240 per box. Dealer pickup retains ₹320 and contributes ₹160. A ₹400 delivery paid by the kitchen on a ten-box dealer order reduces contribution to ₹120 per box.") +
        description("Ingredient stress test: at ₹640/kg butter and ₹1,905.96/kg premium couverture, the same recipe costs about ₹210.06 per box including the other inputs. At 100 direct boxes, monthly cash falls to about −₹5,006. The ₹160 base uses the less expensive chocolate provision shown above. Verify the actual supplier specification and saleable yield.") +
        description("For dealer share, the calculator rounds wholesale boxes to the nearest whole box. All prices are retained values before income tax. Buyer pickup and advance payment are assumed.")),
      accordion("Two-month opening cash flow", "₹9,600 absorbed",
        table(["Cash flow", "Month 1", "Month 2", "Total"], [["Direct prepaid boxes",60,100,160],["Receipts", money(24000),money(40000),money(64000)],["Operating bills",money(33600),money(40000),money(73600)],["Operating cash",money(-9600),money(0),money(-9600)]] ) +
        description("₹3,79,456 opening + ₹73,600 cash bills = ₹4,53,056 before customer receipts. After ₹64,000 prepaid sales, peak month-end funding is ₹3,89,056. There is no external lease deposit in this model.")),
      accordion("Optional four-seat café", "+₹1,28,590",
        description("A later four-seat service test can use movable chairs and tables. Its additional capital and the income from its activity are excluded from the pickup calculator.") + items(study.small.optional) +
        description("Five optional lines total ₹1,16,900. With ₹11,690 contingency the add-on is ₹1,28,590. Pickup kitchen plus the four-seat option totals ₹5,08,046 before operating cash.")),
    ].join("");
  }
  function bigLedger() {
    const {kit, front, staff, event} = study.big;
    const owner = upgrade.owner, replica = upgrade.franchisee, base = copy.big.base;
    const o = forecast("big", base), r = forecast("big", base,"franchisee",.05);
    const both = (a,b) => [money(a),money(b)];
    const t2 = (v, key, i) => money(v.months[i][key]);
    return [
      accordion("Opening investment & funding", money(owner.opening),
        description("Owner-reported land comprises 40 cents at the compound plus a separate 21 cents for exterior parking. Land purchase, site rent and deposit are zero in the company cash model. The replica assumes a comparable leased site.") +
        table(["Opening uses of funds","Owned flagship","Franchisee test"],[
          ["Existing café, kitchen and site works",...both(1550140,1550140)],["Exterior parking and garden works",...both(202100,202100)],["Batch trace printer and media",...both(22000,22000)],["Physical contingency 10%",...both(177424,177424)],["Physical asset budget",...both(1951664,1951664)],["Original preopening expenses",...both(44000,44000)],["Opening stock",...both(40000,40000)],["Program development or local induction + fee",...both(224500,135000)],["Program contingency",...both(22450,3500)],["Refundable security deposit",...both(0,90000)],["Opening cash",...both(owner.opening,replica.opening)],["Additional working cash through M6",...both(o.peakRamp-owner.opening,r.peakRamp-replica.opening)],["Funding through M6",...both(o.peakRamp,r.peakRamp)]])+
        description("A sustained post-ramp loss creates further cash needs. Allow for intra-month payment peaks, major works and replacement separately. Earnback calculations exclude terminal resale or deposit refunds.")),
      accordion("Kitchen machinery, services & 24-seat café", "₹15,50,140",
        sub("Production equipment and connections · ₹11,70,800") + items(kit) + sub("Existing front-of-house scope · ₹3,79,340") + items(front) +
        description("Four-tray convection oven, reversible sheeter, proofer, chiller and freezer support on-site lamination and choux. The monthly event model hires 16 extra chairs and weather cover. The original ₹55,000 allowance here is for the internal guest route and damp repairs.")),
      accordion("Exterior parking & garden works", "₹2,02,100",
        items(upgrade.parking) + description("Only 120 m² of initial external gravel surfacing and 24 m² of approach are budgeted. The full 21 cents equates to about 850 m². A measured layout must establish the usable bay count, setbacks, stormwater outfall and total civil cost. Existing equipment and interior works carry separate budgets.")+
        description("Kerala Ecostat lists Ernakulam 20 mm stone ballast at ₹2,135/m³ for Q1 2026–27. The trial-surface rate includes preliminary preparation, laying and compaction allowances. "+source("Regional materials survey","https://ecostat.kerala.gov.in/publication-detail/market-price-of-building-materials-and-labour-wage-rates-for-the-first-quarter-of-2026---27"))),
      accordion("Franchise preparation & traceability", "₹2,24,500 + reserve",
        items(upgrade.program) + sub("Dedicated equipment") + items(upgrade.unitAssets) + description("The ₹22,000 label printer and media sit in the physical asset budget once. Brother lists a QL-800 at ₹16,990 including tax. Verify food-pack label compatibility and wet/cold adhesion.")+
        description(source("Brother India product reference","https://www.brother.in/en/labellers/all-labellers/ql-800"))+
        sub("Leased replica opening instead of founder program") + items(upgrade.franchiseeStart) + description("The owner funds ₹2,24,500 in development plus ₹22,450 reserve. An independent replica substitutes a ₹35,000 induction, ₹3,500 reserve and a hypothetical ₹1 lakh entry fee. A franchise agreement, brand rights and field validation still require separate work. No franchise sales or royalties earned are credited to the flagship.")),
      accordion("Two store P&Ls, payroll & rent", "₹18,602 / −₹23,085",
        table(["Monthly P&L at base demand","Owned flagship","Leased replica"],[
          ["Sales excluding customer GST",...both(o.sales,r.sales)],["Ingredients",...both(o.food,r.food)],["Pack and service supplies",...both(o.pack,r.pack)],["App deductions",...both(o.platform,r.platform)],["Event hire and casuals",...both(o.eventCost,r.eventCost)],["Contribution before fixed cost and royalty",...both(o.gross,r.gross)],["Payroll, owner draw, relief and on-costs",...both(169000,169000)],["Recurring cost excluding payroll / occupancy / QA",...both(51000,51000)],["Property carry or cash rent",...both(5000,30000)],["QA, coaching and trace systems",...both(15000,7000)],["Royalty on ex-tax sales",...both(0,r.royalty)],["Cash operating profit",...both(o.profit,r.profit)],["Illustrative depreciation¹",...both(1951664/60,1951664/60)],["Operating result after depreciation¹",...both(o.profit-1951664/60,r.profit-1951664/60)]]) +
        description("¹ Straight-line illustration over 60 months on funded physical assets. Accounting policy, taxes, financing and major replacements require separate treatment.") +
        sub("People and shared overhead") + items(staff.filter((x,i)=>i!==8)) + sub("Flagship monthly QA, coaching and trace budget") + items(upgrade.ownerOngoing) + sub("Replica monthly QA and trace budget") + items(upgrade.replicaOngoing)),
      accordion("Channels, platforms & event margin", "₹7,140 / full event",
        table(["Per order / guest","Retained sale","Food + pack","Other costs","Contribution"],[["On-site",money(250),money(88),"—",money(162)],["Swiggy / Zomato",money(410),money(157),"₹102.50","₹150.50"],["Booked guest",money(650),money(210),"See hire",money(440)]]) +
        description("The ₹250 in-store ticket can be one ₹155 croissant and one ₹95 mini éclair. ₹410 is the assumed average app basket. 25% platform deductions are provisional. Each month-end receivable holds 14/30 of net app sales. None of the franchise royalties are included in these transaction contribution figures.") +
        items(event)+description("A 40-person booking contributes ₹17,600 before hire. ₹10,460 buys temporary furniture, three canopy modules, transport and stewards, leaving ₹7,140. If permanent cover for the initial 24 seats is unavailable the fully temporary setup costs about ₹21,960, creating a ₹4,360 event loss before any royalty.")+
        description("Blinkit is a separate packaged-goods test. A ₹100 ex-tax brand invoice less ₹59 food, pack and logistics leaves ₹41 per four-biscuit pack. The retail MRP hypothesis is ₹160. No quick-commerce volume enters the main model.")),
      accordion("First two months & opening ramp", "₹2,37,215 absorbed • owner",
        table(["Cash schedule","Owner M1","Owner M2","Replica M1","Replica M2"],[
         ["Sales",t2(o,'sales',0),t2(o,'sales',1),t2(r,'sales',0),t2(r,'sales',1)],["Merchant cash bills",t2(o,'bills',0),t2(o,'bills',1),t2(r,'bills',0),t2(r,'bills',1)],["Cash receipts",t2(o,'receipts',0),t2(o,'receipts',1),t2(r,'receipts',0),t2(r,'receipts',1)],["Net operating cash",t2(o,'movement',0),t2(o,'movement',1),t2(r,'movement',0),t2(r,'movement',1)]]) +
        table(["Month","Store / Swiggy / Zomato per day","Events × guests","Owner cumulative","Replica cumulative"],study.big.ramp.map(([v,s,z,e,g],i)=>[i+1,`${v} / ${s} / ${z}`,`${e} × ${g}`,money(o.months[i].position),money(r.months[i].position)]))+
        description("Opening cash is paid at month zero. App fees are deducted by platforms, so merchant-paid bills exclude withheld fees. The landlord/deposit assumption applies only to the hypothetical leased site.")),
      accordion("Recovery targets & royalty stress", "52 owner orders / day for 5 years",
        table(["Royalty on total ex-tax sales","Owner cash profit / mo","Replica cash profit / mo"],[0,.03,.05,.08].map(roy=>[Math.round(100*roy)+"%",money(bigMonth(base,"owner",roy).profit),money(bigMonth(base,"franchisee",roy).profit)]))+
        description("At 14 app orders per day and two full booked events per month, an owned flagship needs 52 on-site orders per day from month seven to recover investment within 60 months. The leased replica needs 65. For a 36-month target the thresholds are 61 and 75.")+
        description("Mature owner cash surplus is ₹18,602. A monthly ₹10,000 replacement reserve reduces it to ₹8,602. The baseline owned model returns to zero mechanically at month 145, beyond the modelled asset life. A sustained slower-sales case cannot repay opening cash."))
    ].join("");
  }

  function card(id, current) {
    const plan = copy[id];
    return `<button type="button" data-plan="${id}" id="${id}-investment" class="inv-card" aria-pressed="${id === current}" aria-controls="inv-model" aria-label="Explore ${plan.short} investment plan">
      <span class="inv-card-photo"><img src="assets/${plan.image}" alt="${plan.alt}" loading="lazy" decoding="async"><span class="inv-card-tag">${plan.tag}</span></span>
      <span class="inv-card-copy"><span class="inv-card-name">${plan.title}.</span><span class="inv-card-intro">${plan.summary}</span>
      <span class="inv-card-footer"><span><small>Opening cash</small><strong>${lakh(plan.opening)}</strong><span class="inv-card-peak">Ramp funding ${lakh(forecast(id,plan.base).peakRamp)}</span></span><span class="inv-card-mark" aria-hidden="true">↘</span></span></span>
    </button>`;
  }
  function slider(field, value) {
    const [key,label,min,max,step,suffix=""] = field;
    return `<label class="inv-slider" for="inv-${key}"><span>${label}</span><output for="inv-${key}">${value}${suffix}</output><input id="inv-${key}" type="range" data-field="${key}" min="${min}" max="${max}" step="${step}" value="${value}" aria-valuetext="${value}${suffix}"></label>`;
  }
  const presets = [["base","Study base"],["quiet","Slower sales"],["strong","Stronger sales"]];
  class InvestmentPlans extends HTMLElement {
    constructor() {
      super();
      this.selected = "small";
      this.operator = "owner";
      this.royalties = {owner:0,franchisee:5};
      this.units = { small: [...copy.small.base], big: [...copy.big.base] };
      this.handleHash = () => {
        const id = { "#small-investment":"small", "#big-investment":"big" }[location.hash];
        if (id) this.select(id, {scroll:true});
      };
    }
    connectedCallback() {
      if (!this.ready) {
        this.ready = true;
        const hashPlan = { "#small-investment":"small", "#big-investment":"big" }[location.hash];
        this.selected = hashPlan || this.selected;
        this.innerHTML = `<div class="inv-wrap"><header class="inv-intro"><div><p class="inv-kicker"><i></i> Investment plans</p><h2>Two ways to <em>open.</em></h2></div><p class="inv-intro-note">Start with a prepaid pickup kitchen or build a pastry flagship on the owner’s Kerala compound. Compare opening cash, monthly earnings and the cost of a leased replica.</p></header>
          <div class="inv-cards" role="group" aria-label="Choose an investment plan">${card("small",this.selected)}${card("big",this.selected)}</div>
          <div class="inv-model" id="inv-model"></div></div>`;
        this.addEventListener("click", e => this.clickAction(e));
        this.addEventListener("input", e => this.adjust(e));
        this.renderPlan();
      }
      window.addEventListener("hashchange", this.handleHash);
      if (["#small-investment","#big-investment"].includes(location.hash)) {
        requestAnimationFrame(() => this.handleHash());
      }
    }
    disconnectedCallback() { window.removeEventListener("hashchange",this.handleHash); }
    select(id, options={}) {
      if (!copy[id]) return;
      this.selected = id;
      this.querySelectorAll("[data-plan]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.plan === id)));
      this.renderPlan();
      if (options.scroll) {
        const heading = this.querySelector("#inv-heading");
        heading.focus({preventScroll: true});
        heading.scrollIntoView({block:"start",behavior:"instant"});
      }
    }
    clickAction(e) {
      const cardButton = e.target.closest("button[data-plan]");
      if (cardButton) {
        this.select(cardButton.dataset.plan,{scroll:true});
        history.replaceState(history.state,"","#" + cardButton.dataset.plan + "-investment");
        return;
      }
      const operatorButton=e.target.closest("button[data-operator]");
      if (operatorButton) {
        this.operator=operatorButton.dataset.operator;
        this.renderPlan();
        this.querySelector('[data-operator="'+this.operator+'"]').focus({preventScroll:true});
        return;
      }
      const preset = e.target.closest("button[data-preset]");
      if (preset) {
        const id = this.selected, wanted = copy[id][preset.dataset.preset];
        this.units[id] = [...wanted];
        this.querySelectorAll("input[data-field]").forEach((input,i) => { if(input.dataset.field!=="royalty") input.value = wanted[i]; });
        this.refresh();
      }
    }
    adjust(e) {
      if (!e.target.matches("input[data-field]")) return;
      if(e.target.dataset.field==="royalty") { this.royalties[this.operator]=Number(e.target.value);this.refresh();return; }
      const id = this.selected;
      const index = copy[id].fields.findIndex(f => f[0] === e.target.dataset.field);
      if (index < 0) return;
      const [, , min, max] = copy[id].fields[index];
      this.units[id][index] = Math.min(max,Math.max(min,Number(e.target.value)));
      this.refresh();
    }
    renderPlan() {
      const id = this.selected, plan = copy[id], values = this.units[id];
      this.querySelector(".inv-model").innerHTML = `
        <div class="inv-model-heading"><div><p class="inv-kicker"><i></i> Selected model</p><h3 id="inv-heading" tabindex="-1">${plan.title}.</h3></div>
          <span class="inv-model-facts">${plan.fixedLabel}<br><strong>${money(id==="big"?upgrade[this.operator].fixed:plan.fixed)}</strong> monthly fixed cost</span></div>
        ${id==="big"?`<div class="inv-operator"><span>Operating structure</span><div class="inv-presets" role="group" aria-label="Operating structure">${[["owner","Company-owned flagship"],["franchisee","Leased franchisee test"]].map(([v,t])=>`<button type="button" data-operator="${v}" aria-pressed="${v===this.operator}">${t}</button>`).join("")}</div></div>`:""}
        <div class="inv-lab"><div class="inv-controls"><h4>Test your demand.</h4><p>${id === "small" ? "Set a monthly box target after the first eight weeks of prepaid sales." : "Set trading volumes from month seven, after the six-month launch ramp."}</p>
          <div class="inv-presets" role="group" aria-label="Demand presets">${presets.map(([k,t]) => `<button type="button" data-preset="${k}" aria-pressed="false">${t}</button>`).join("")}</div>
          <div class="inv-sliders">${plan.fields.map((f,i)=>slider(f,values[i])).join("")}${id==="big"?slider(["royalty","Royalty on pre-tax sales",0,10,1,"%"],this.royalties[this.operator]):""}</div>
          <p class="inv-timing">${id === "small" ? "Four sessions per planning month. Check baker hours and oven capacity above 100 boxes." : "26 trading days per month. Event revenue assumes that guests and staffing are additional to the daily trade."}</p>
        </div><div class="inv-results" aria-label="Scenario results" aria-live="polite" aria-atomic="true"></div></div>
        <div class="inv-detail-heading"><h4>Inside the budget.</h4><p>Amounts in Indian rupees · November 2026 study</p></div><div class="inv-ledger">${id === "small" ? smallLedger() : bigLedger()}</div>`;
      this.refresh();
    }
    refresh() {
      const id = this.selected, model = copy[id], values = this.units[id], f = forecast(id, values,this.operator,this.royalties[this.operator]/100);
      this.querySelectorAll("input[data-field]").forEach((input, i) => {
        const royaltyField=input.dataset.field==="royalty";
        const [, , min, max, , suffix=""] = royaltyField ? ["royalty","Royalty",0,10,1,"%"] : model.fields[i];
        const v = royaltyField ? this.royalties[this.operator] : values[i], valueText = v + suffix;
        input.style.setProperty("--inv-pct", 100 * (v-min)/(max-min) + "%");
        input.setAttribute("aria-valuetext", valueText);
        input.closest("label").querySelector("output").textContent = valueText;
      });
      this.querySelectorAll("[data-preset]").forEach(btn => btn.setAttribute("aria-pressed", String(model[btn.dataset.preset].every((v,i)=>v===values[i]))));
      const fixed=id==="small"?model.fixed:upgrade[this.operator].fixed;
      const ratio = (f.gross-(f.royalty||0)) / fixed;
      const payback = f.payback ? "Month " + count(f.payback) : "No recovery";
      const share = id === "small" ? `${count(f.direct)} direct + ${count(f.trade)} dealer boxes` : `${count(values[0]*26)} on-site + ${count((values[1]+values[2])*26)} app orders + ${count(values[3]*values[4])} event guests`;
      const fixedcovered = Math.round(ratio*100);
      const yearsNote = f.fiveYears < 0 ? money(-f.fiveYears) + " remains unrecovered at year five." : money(f.fiveYears) + " cumulative cash above the opening investment at year five.";
      this.querySelector(".inv-results").innerHTML = `<div class="inv-result-top"><span class="inv-result-label">Monthly operating ${f.profit < 0 ? "loss" : "surplus"}</span><strong class="inv-profit" data-result="profit">${money(f.profit)}</strong><p>${share}</p></div>
        <dl class="inv-metrics"><div><dt>Monthly sales</dt><dd data-result="sales">${money(f.sales)}</dd></div><div><dt>Variable costs${id === "big" ? " & event hire" : ""}</dt><dd>${money(f.variable)}</dd></div>${id==="big"?`<div><dt>Royalty</dt><dd>${money(f.royalty)}</dd></div>`:""}<div><dt>Monthly fixed costs</dt><dd>${money(fixed)}</dd></div><div><dt>Funding through launch ramp</dt><dd>${money(f.peakRamp)}</dd></div><div class="inv-recovery"><dt>Capital recovery¹</dt><dd data-result="payback">${payback}</dd></div></dl>
        <div class="inv-bar-title"><span>Fixed costs covered</span><b>${fixedcovered}%</b></div><div class="inv-bar" aria-hidden="true"><i style="width:${Math.min(100,Math.max(0,ratio*100))}%"></i></div>
        <p class="inv-method">¹ ${yearsNote} Includes opening and ramp cash. Assumes sustained prices and costs before financing, replacement or income tax.</p>`;
    }
  }
  if (!customElements.get("investment-plans")) customElements.define("investment-plans", InvestmentPlans);
  window.selectPlan = function(id) {
    if (!copy[id]) return;
    document.querySelector("investment-plans")?.select(id,{scroll:true});
    history.replaceState(history.state,"","#" + id + "-investment");
  };
})();
