/**
 * Pure graph algorithms for movie prerequisite dependency management.
 * No external libraries or database dependencies.
 */

/**
 * 1) wouldCreateCycle
 *
 * Checks if adding `newPrerequisiteIds` as prerequisites to `movieId` would form a circular dependency.
 *
 * A cycle occurs if:
 * - `movieId` is directly listed in `newPrerequisiteIds` (self-loop: movie depends on itself).
 * - `movieId` can be reached by walking through the prerequisites of any movie in `newPrerequisiteIds`
 *   (i.e., a proposed prerequisite already depends, directly or transitively, on `movieId`).
 *
 * Uses iterative Depth-First Search (DFS) with a visited Set to prevent infinite loops.
 *
 * @param movieId - ID of the movie being created or updated
 * @param newPrerequisiteIds - Proposed prerequisite IDs for `movieId`
 * @param edges - Map where each key is a movieId and value is an array of its prerequisite IDs
 * @returns true if adding the prerequisites would create a cycle, false otherwise
 */
export function wouldCreateCycle(
  movieId: string,
  newPrerequisiteIds: string[],
  edges: Map<string, string[]>
): boolean {
  // Check for immediate self-dependency: a movie cannot depend on itself
  if (newPrerequisiteIds.includes(movieId)) {
    return true;
  }

  // Initialize DFS stack with the starting nodes to explore (the proposed prerequisites)
  const stack: string[] = [...newPrerequisiteIds];

  // Track visited movie IDs to prevent revisiting nodes and avoid infinite loops
  const visited = new Set<string>();

  // Process nodes in the stack iteratively
  while (stack.length > 0) {
    const current = stack.pop()!;

    // If traversal reaches the movie itself, a circular dependency chain exists
    if (current === movieId) {
      return true;
    }

    // Only inspect neighbors if this node hasn't been visited yet
    if (!visited.has(current)) {
      visited.add(current);

      // Retrieve all prerequisites of the current movie
      const prereqs = edges.get(current) || [];

      // Push each unvisited prerequisite onto the stack for further exploration
      for (const nextId of prereqs) {
        if (!visited.has(nextId)) {
          stack.push(nextId);
        }
      }
    }
  }

  // No path from newPrerequisiteIds reaches movieId, so no cycle is created
  return false;
}

/**
 * 2) getRewatchOrder
 *
 * Returns an ordered array of movie IDs representing all direct and indirect
 * prerequisites of `targetId`, each occurring exactly once.
 *
 * Ordering rule:
 * - Every movie appears strictly AFTER all of its own prerequisites.
 * - The `targetId` movie itself is NOT included in the final result.
 *
 * Uses Depth-First Search (DFS) post-order traversal:
 * - A movie is added to the result list only after all of its prerequisites have been fully visited and added.
 *
 * @param targetId - ID of the movie we want to watch
 * @param edges - Map where each key is a movieId and value is an array of its prerequisite IDs
 * @returns Array of prerequisite movie IDs in valid rewatch order
 */
export function getRewatchOrder(
  targetId: string,
  edges: Map<string, string[]>
): string[] {
  // Track visited nodes to ensure each prerequisite is processed exactly once
  const visited = new Set<string>();

  // Array collecting movie IDs in topological post-order
  const order: string[] = [];

  // Recursive DFS helper function
  function dfs(nodeId: string): void {
    // Mark current node as visited
    visited.add(nodeId);

    // Retrieve prerequisites for the current node
    const prereqs = edges.get(nodeId) || [];

    // Recursively visit all unvisited prerequisites first
    for (const prereqId of prereqs) {
      if (!visited.has(prereqId)) {
        dfs(prereqId);
      }
    }

    // Post-order: append node to order only after all its prerequisites have been placed
    // Exclude the target movie itself from the rewatch prerequisites list
    if (nodeId !== targetId) {
      order.push(nodeId);
    }
  }

  // Kick off DFS traversal from the target movie
  dfs(targetId);

  return order;
}

