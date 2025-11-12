// Tool execution handlers for AgentLLM

import { createLogLineClient } from "./logline"
import type { AgentTool } from "./agent-tools"

const apiKey = process.env.LOGLINE_API_KEY

export async function executeToolCall(toolName: AgentTool, input: any): Promise<any> {
  console.log(`[v0] Executing tool: ${toolName}`, input)

  if (!apiKey) {
    throw new Error("LOGLINE_API_KEY not configured")
  }

  const client = createLogLineClient(apiKey)

  switch (toolName) {
    case "create_flow":
      return await createFlow(client, input)

    case "register_contract":
      return await registerContract(client, input)

    case "search_contracts":
      return await searchContracts(client, input)

    case "get_flows":
      return await getFlows(client)

    case "render_chart":
      return renderChart(input)

    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

async function createFlow(client: any, input: any) {
  const { name, description, icon } = input

  // Store flow as a span in LogLine
  const response = await client.writeSpan({
    span: {
      context: `Create flow: ${name}`,
      response: JSON.stringify({ name, description, icon }),
      intent: "install",
      payload: {
        entity_type: "flow",
        name,
        description,
        icon: icon || "📁",
      },
      metadata: {
        app: "minicontratos",
        type: "flow_created",
        flow_name: name,
      },
    },
  })

  return {
    success: true,
    flow_id: response.span_id,
    name,
    description,
    icon,
  }
}

async function registerContract(client: any, input: any) {
  const { flow_id, who, did, this: what, when, if_ok, if_not } = input

  // Store contract as a span in LogLine
  const response = await client.writeSpan({
    span: {
      context: `Register contract in flow ${flow_id}: ${who.join(", ")} ${did} ${what}`,
      response: JSON.stringify({ who, did, what, when }),
      intent: "install",
      payload: {
        entity_type: "contract",
        flow_id,
        who,
        did,
        what,
        when,
        if_ok,
        if_not,
      },
      metadata: {
        app: "minicontratos",
        type: "contract_registered",
        flow_id,
        who,
      },
    },
  })

  return {
    success: true,
    contract_id: response.span_id,
    flow_id,
    who,
    did,
    what,
    when,
  }
}

async function searchContracts(client: any, input: any) {
  const { flow_id, person, date_from, date_to, keyword } = input

  // Query contracts from LogLine
  const response = await client.writeSpan({
    span: {
      context: `Search contracts: ${JSON.stringify(input)}`,
      response: JSON.stringify({ status: "searching" }),
      intent: "query",
      payload: {
        entity_type: "contract",
        flow_id,
        person,
        date_from,
        date_to,
        keyword,
      },
      metadata: {
        app: "minicontratos",
        type: "contract_search",
      },
    },
  })

  // In a real implementation, this would query the LogLine database
  // For now, return a mock response
  return {
    success: true,
    contracts: [],
    message: "Contract search functionality will query LogLine database",
  }
}

async function getFlows(client: any) {
  // Query all flows from LogLine
  const response = await client.writeSpan({
    span: {
      context: "Get all flows",
      response: JSON.stringify({ status: "querying" }),
      intent: "query",
      payload: {
        entity_type: "flow",
      },
      metadata: {
        app: "minicontratos",
        type: "flow_list",
      },
    },
  })

  // In a real implementation, this would query the LogLine database
  return {
    success: true,
    flows: [
      { id: "flow-1", name: "Vendas", icon: "💰", description: "Registros de vendas" },
      { id: "flow-2", name: "Estoque", icon: "📦", description: "Controle de estoque" },
    ],
  }
}

function renderChart(input: any) {
  const { type, data, title } = input

  // Return chart data that frontend can render
  return {
    success: true,
    chart: {
      type,
      title,
      data,
    },
    message: "Chart data ready for rendering",
  }
}
