export const agentTools = [
  {
    name: "create_flow",
    description:
      "Creates a new flow/category for organizing contracts. Use when user wants to create a new type of record.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Flow name (e.g., 'Vendas', 'Experimentos', 'Treinos')",
        },
        description: {
          type: "string",
          description: "Brief description of what this flow tracks",
        },
        icon: {
          type: "string",
          description: "Emoji icon for the flow",
        },
      },
      required: ["name", "description"],
    },
  },
  {
    name: "register_contract",
    description: "Registers a new contract/record in a flow. Use when user describes something that happened.",
    input_schema: {
      type: "object",
      properties: {
        flow_id: {
          type: "string",
          description: "ID of the flow to register in",
        },
        who: {
          type: "array",
          items: { type: "string" },
          description: "All people involved",
        },
        did: {
          type: "string",
          description: "What action happened",
        },
        this: {
          type: "object",
          description: "Details about what happened (items, amounts, etc)",
        },
        when: {
          type: "string",
          description: "When it happened (ISO timestamp)",
        },
        if_ok: {
          type: "string",
          description: "What should happen if agreement is fulfilled",
        },
        if_not: {
          type: "string",
          description: "What should happen if agreement is NOT fulfilled",
        },
      },
      required: ["flow_id", "who", "did", "this", "when"],
    },
  },
  {
    name: "search_contracts",
    description: "Searches contracts in a flow with filters. Use when user asks questions about past records.",
    input_schema: {
      type: "object",
      properties: {
        flow_id: {
          type: "string",
          description: "Flow ID to search in (optional, searches all if not provided)",
        },
        person: {
          type: "string",
          description: "Filter by person name",
        },
        date_from: {
          type: "string",
          description: "Start date (ISO format)",
        },
        date_to: {
          type: "string",
          description: "End date (ISO format)",
        },
        keyword: {
          type: "string",
          description: "Search in contract details",
        },
      },
    },
  },
  {
    name: "get_flows",
    description: "Gets all flows created by the user. Use when user asks 'what flows do I have?' or 'show my flows'",
    input_schema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "render_chart",
    description: "Renders a chart with data. Use when user asks for visualizations.",
    input_schema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["bar", "line", "pie"],
          description: "Chart type",
        },
        data: {
          type: "array",
          description: "Data points for the chart",
        },
        title: {
          type: "string",
          description: "Chart title",
        },
      },
      required: ["type", "data", "title"],
    },
  },
] as const

export type AgentTool = (typeof agentTools)[number]["name"]
