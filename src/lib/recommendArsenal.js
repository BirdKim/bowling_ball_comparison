import { scoreBall } from "./ScoreBall.js";

const GAP_PROFILES = {
  heavy: {
    title: "a stronger, earlier-reading option",
    reason: "Your lineup has limited traction for fresh or higher-volume oil.",
    target: { length: 28, midlaneRead: 82, flarePotential: 72, backendShape: 56, overallHook: 82 },
  },
  benchmark: {
    title: "a versatile benchmark shape",
    reason: "Your lineup has a gap in the controllable middle of the bag.",
    target: { length: 52, midlaneRead: 60, flarePotential: 58, backendShape: 62, overallHook: 62 },
  },
  angular: {
    title: "a cleaner, more angular option",
    reason: "Your lineup could use more length and response when the fronts break down.",
    target: { length: 78, midlaneRead: 35, flarePotential: 60, backendShape: 82, overallHook: 50 },
  },
  light: {
    title: "a weaker control option",
    reason: "Your lineup has limited choices for dry lanes or late blocks.",
    target: { length: 85, midlaneRead: 25, flarePotential: 38, backendShape: 58, overallHook: 35 },
  },
};

const METRICS = ["length", "midlaneRead", "flarePotential", "backendShape", "overallHook"];
const MINIMUM_SEPARATION = 50; // 90% overlap or less

function averageScores(selected) {
  if (!selected.length) return null;
  return METRICS.reduce((averages, metric) => {
    averages[metric] = selected.reduce((sum, ball) => sum + scoreBall(ball)[metric], 0) / selected.length;
    return averages;
  }, {});
}

function chooseGap(selected, specs) {
  if (specs.laneCondition === "heavy") return "heavy";
  if (specs.laneCondition === "light") return "light";
  if (specs.preferredShape === "smooth") return "benchmark";
  if (specs.preferredShape === "angular") return "angular";

  const averages = averageScores(selected);
  if (!averages) return "benchmark";
  if (averages.overallHook < 55 || averages.midlaneRead < 50) return "heavy";
  if (averages.length < 45 || averages.backendShape < 60) return "angular";
  return "light";
}

function distance(scores, target) {
  return METRICS.reduce((total, metric) => total + Math.abs(scores[metric] - target[metric]), 0);
}

function hasBalancedArsenal(selected) {
  if (selected.length < 5) return false;

  const scores = selected.map(scoreBall);
  const smallestPairDistance = Math.min(...scores.flatMap((score, index) =>
    scores.slice(index + 1).map(otherScore => distance(score, otherScore))
  ));

  // A distance of 50 or greater corresponds to 90% overlap or less.
  return smallestPairDistance >= MINIMUM_SEPARATION;
}

function findReplacement(selected, target, candidates) {
  if (selected.length < 2 || !candidates.length) return null;

  let closestPair = null;
  for (let first = 0; first < selected.length; first += 1) {
    for (let second = first + 1; second < selected.length; second += 1) {
      const firstBall = selected[first];
      const secondBall = selected[second];
      const similarityDistance = distance(scoreBall(firstBall), scoreBall(secondBall));
      if (!closestPair || similarityDistance < closestPair.similarityDistance) {
        closestPair = { firstBall, secondBall, similarityDistance };
      }
    }
  }
  if (closestPair.similarityDistance >= MINIMUM_SEPARATION) return null;

  const firstFit = distance(scoreBall(closestPair.firstBall), target);
  const secondFit = distance(scoreBall(closestPair.secondBall), target);
  const remove = firstFit >= secondFit ? closestPair.firstBall : closestPair.secondBall;
  const keep = remove.id === closestPair.firstBall.id ? closestPair.secondBall : closestPair.firstBall;

  const remainingBalls = selected.filter(ball => ball.id !== remove.id);
  const replacementCandidates = candidates.filter(candidate =>
    remainingBalls.every(ball => distance(candidate.scores, scoreBall(ball)) >= MINIMUM_SEPARATION)
  );
  if (!replacementCandidates.length) return null;

  const replacement = replacementCandidates
    .map(candidate => {
      const closestRemainingDistance = Math.min(
        ...remainingBalls.map(ball => distance(candidate.scores, scoreBall(ball)))
      );
      // Favor the missing role, while avoiding another near-duplicate in the five-ball bag.
      const rank = distance(candidate.scores, target) + Math.max(0, 130 - closestRemainingDistance) * 0.8;
      return { ...candidate, rank };
    })
    .sort((first, second) => first.rank - second.rank)[0];

  return {
    remove,
    keep,
    recommendation: replacement,
    similarity: Math.round(100 - closestPair.similarityDistance / 5),
  };
}

export function recommendArsenal(balls, selected, specs) {
  const gap = chooseGap(selected, specs);
  const profile = GAP_PROFILES[gap];
  const selectedIds = new Set(selected.map(ball => ball.id));
  const speedAdjustment = Number(specs.speed) >= 17 ? -4 : Number(specs.speed) <= 13 ? 4 : 0;
  const revAdjustment = Number(specs.revRate) >= 375 ? -4 : Number(specs.revRate) <= 275 ? 4 : 0;
  const target = {
    ...profile.target,
    length: Math.max(0, Math.min(100, profile.target.length + speedAdjustment - revAdjustment)),
  };
  const isBalanced = hasBalancedArsenal(selected);

  const candidates = balls
    .filter(ball => !selectedIds.has(ball.id))
    .map(ball => ({ ball, scores: scoreBall(ball) }))
    .sort((a, b) => distance(a.scores, target) - distance(b.scores, target))
    .map(({ ball, scores }) => ({
      ball,
      scores,
      fit: Math.max(72, Math.round(100 - distance(scores, target) / 4)),
      why: `${ball.coverstock_type} with ${ball.finish} helps create ${profile.title}.`,
    }));

  const recommendations = candidates.reduce((chosen, candidate) => {
    const differsFromSelected = selected.every(ball =>
      distance(candidate.scores, scoreBall(ball)) >= MINIMUM_SEPARATION
    );
    const differsFromSuggestions = chosen.every(suggestion =>
      distance(candidate.scores, suggestion.scores) >= MINIMUM_SEPARATION
    );
    if (chosen.length < 3 && differsFromSelected && differsFromSuggestions) chosen.push(candidate);
    return chosen;
  }, []);

  return {
    profile,
    isBalanced,
    recommendations,
    replacement: isBalanced ? null : findReplacement(selected, target, candidates),
  };
}
