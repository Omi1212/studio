// Use a global variable in development to preserve data across HMR
declare global {
  var __agentTokenAssignments__: Record<string, string[]> | undefined;
}

const initialData: Record<string, string[]> = {
    "user-001": ["example-1", "example-2"],
    "user-004": ["example-4"],
};

// To prevent the data from being lost on hot-reloads in development
if (process.env.NODE_ENV !== 'production' && !global.__agentTokenAssignments__) {
  global.__agentTokenAssignments__ = JSON.parse(JSON.stringify(initialData));
}

export let agentTokenAssignments: Record<string, string[]> = global.__agentTokenAssignments__ || initialData;
