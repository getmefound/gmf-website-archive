// Test EVERY industry. Assert every +1 review changes at least one output.

const industries = {
  petgroomer:    { defaultValue: 70,    vol: 180, velocityTarget: 12, label: "pet groomers" },
  vet:           { defaultValue: 290,   vol: 220, velocityTarget: 18, label: "vet practices" },
  autoshop:      { defaultValue: 480,   vol: 160, velocityTarget: 15, label: "auto repair shops" },
  funeral:       { defaultValue: 9500,  vol: 12,  velocityTarget: 5,  label: "funeral homes" },
  moving:        { defaultValue: 2100,  vol: 35,  velocityTarget: 10, label: "moving companies" },
  seniorliving:  { defaultValue: 4800,  vol: 40,  velocityTarget: 8,  label: "senior living facilities" },
  marketing:     { defaultValue: 3200,  vol: 8,   velocityTarget: 5,  label: "marketing consultants" },
  b2b:           { defaultValue: 2400,  vol: 15,  velocityTarget: 5,  label: "B2B service businesses" },
};

const rankingTraffic = {
  1:1.00, 2:0.78, 3:0.61, 4:0.38, 5:0.28, 6:0.21, 7:0.15, 8:0.11, 9:0.08, 10:0.06,
  11:0.04, 12:0.03, 13:0.03, 14:0.02, 15:0.02, 16:0.02, 17:0.01, 18:0.01, 19:0.01, 20:0.01,
};

function fmt(n) {
  if (n >= 1000) return "$" + (n / 1000).toFixed(1) + "K";
  return "$" + n.toLocaleString();
}

function calc({ industry, customerValue, reviewsPerMonth, stars, ranking }) {
  const ind = industries[industry];
  let starPenalty = 0;
  if (stars < 3.3) starPenalty = 0.55;
  else if (stars < 3.7) starPenalty = 0.35;
  else if (stars < 4.0) starPenalty = 0.20;
  else if (stars < 4.2) starPenalty = 0.10;
  else if (stars < 4.5) starPenalty = 0.04;

  const reviewPenalty = 0.65 * Math.pow(0.5, reviewsPerMonth / ind.velocityTarget);
  const currentTraffic = rankingTraffic[Math.min(ranking, 20)];
  const trafficLoss = 1 - currentTraffic;
  const totalPenalty = Math.min(0.90, trafficLoss * 0.40 + starPenalty * 0.15 + reviewPenalty * 0.45);

  const monthlyRevenue = customerValue * ind.vol;
  const lostRevenueRaw = monthlyRevenue * totalPenalty;
  const lostCustomersRaw = ind.vol * totalPenalty;
  const totalLostRevenue = Math.round(lostRevenueRaw / 100) * 100;
  const totalLostCustomers = Math.round(lostCustomersRaw);
  return { customers: totalLostCustomers, revenue: fmt(totalLostRevenue) };
}

let failures = 0;
let totalSteps = 0;

for (const [industry, data] of Object.entries(industries)) {
  let prev = null;
  let frozenSteps = [];
  for (let r = 0; r <= 20; r++) {
    totalSteps++;
    const result = calc({
      industry,
      customerValue: data.defaultValue,
      reviewsPerMonth: r,
      stars: 3.8,
      ranking: 8,
    });
    if (prev) {
      const customersSame = prev.customers === result.customers;
      const revenueSame = prev.revenue === result.revenue;
      if (customersSame && revenueSame) {
        frozenSteps.push(`${r-1}->${r} both unchanged (${result.customers}/mo, ${result.revenue})`);
        failures++;
      }
    }
    prev = result;
  }
  const status = frozenSteps.length === 0 ? "✓ PASS" : `✗ FAIL (${frozenSteps.length} frozen)`;
  console.log(`${status}  ${industry.padEnd(14)} target=${data.velocityTarget}/mo`);
  if (frozenSteps.length > 0) {
    frozenSteps.forEach(s => console.log(`     ${s}`));
  }
}

console.log(`\n=== ${failures}/${totalSteps - 8} step transitions had BOTH numbers frozen ===`);
console.log(failures === 0 ? "ALL INDUSTRIES PASS — every +1 review changes at least one output" : "FAILURES FOUND ABOVE");
