import type { KnipConfig } from "knip";

export default {
  workspaces: {
    "examples/tanstack-router": { typescript: { config: "tsconfig.app.json" } },
  },
} satisfies KnipConfig;
