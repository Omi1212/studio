// Use a global variable in development to preserve data across HMR
declare global {
  var __agentAssetAssignments__: Record<string, string[]> | undefined;
}

const initialData: Record<string, string[]> = {
    "user-001": ["example-1", "example-2"],
};

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__agentAssetAssignments__) {
  global.__agentAssetAssignments__ = JSON.parse(JSON.stringify(initialData));
}

export let agentAssetAssignments: Record<string, string[]> = global.__agentAssetAssignments__ || initialData;
