/**
 * Pure booking algorithm for cinema bundle seat allocation.
 * No external libraries or database dependencies.
 *
 * Problem: Given a list of available bundle sizes (e.g. [3, 5, 9]) and a
 * target groupSize (e.g. 13), find the fewest number of bundles that add up
 * to EXACTLY groupSize. Return null if no exact combination exists.
 *
 * This is the classic "minimum coin change" problem solved with
 * bottom-up Dynamic Programming in O(groupSize * bundleSizes.length) time.
 */

export interface BundleGroup {
  size: number;
  count: number;
}

/**
 * findMinBundles
 *
 * @param bundleSizes - Available bundle seat counts (e.g. [3, 5, 9])
 * @param groupSize   - Total seats to fill exactly
 * @returns Array of { size, count } groups ordered largest size first,
 *          or null if the groupSize cannot be filled exactly.
 */
export function findMinBundles(
  bundleSizes: number[],
  groupSize: number
): BundleGroup[] | null {
  // --- Step 1: Build the DP table ---
  //
  // dp[n] = the minimum number of bundles needed to make EXACTLY n seats.
  // We initialise every entry to Infinity, meaning "not reachable yet",
  // except dp[0] = 0 (zero bundles are needed to fill zero seats).
  const dp: number[] = new Array(groupSize + 1).fill(Infinity);
  dp[0] = 0;

  // choice[n] = which bundle size we chose when we set dp[n].
  // We use this later to reconstruct the actual breakdown.
  const choice: number[] = new Array(groupSize + 1).fill(0);

  // --- Step 2: Fill the table bottom-up ---
  //
  // For each seat count n from 1 up to groupSize, try every bundle size.
  // If using that bundle brings us to n seats using fewer bundles than
  // whatever we found before, update dp[n] and remember the bundle used.
  for (let n = 1; n <= groupSize; n++) {
    for (const size of bundleSizes) {
      // We can only use this bundle if it doesn't overshoot (n >= size)
      // AND the sub-problem dp[n - size] was reachable (not Infinity).
      if (size <= n && dp[n - size] !== Infinity) {
        const candidate = dp[n - size] + 1; // one more bundle than the sub-problem

        if (candidate < dp[n]) {
          dp[n] = candidate;      // best (fewest bundles) so far for n seats
          choice[n] = size;       // remember which bundle got us here
        }
      }
    }
  }

  // --- Step 3: Check if groupSize is reachable ---
  //
  // If dp[groupSize] is still Infinity, no exact combination exists.
  if (dp[groupSize] === Infinity) {
    return null;
  }

  // --- Step 4: Reconstruct the breakdown by walking back through choice[] ---
  //
  // Starting at groupSize, we look up which bundle was chosen,
  // subtract it, and repeat until we reach 0.
  // This gives us the full list of bundle sizes used (possibly with repeats).
  const usedSizes: number[] = [];
  let remaining = groupSize;

  while (remaining > 0) {
    const bundleUsed = choice[remaining]; // which bundle was last added to reach 'remaining'
    usedSizes.push(bundleUsed);
    remaining -= bundleUsed;             // step back to the sub-problem
  }

  // --- Step 5: Group by size, largest first ---
  //
  // Count how many times each bundle size appears and sort descending.
  const countMap = new Map<number, number>();
  for (const size of usedSizes) {
    countMap.set(size, (countMap.get(size) ?? 0) + 1);
  }

  const breakdown: BundleGroup[] = Array.from(countMap.entries())
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size); // largest bundle size first

  return breakdown;
}

