// API service for Baserow
const API_TOKEN = "sYd38oTJdDvSnS1N5dci6y12PUEt9mKg"
const BASE_URL = "https://baserow.codewave-ia.com.br/api/database/rows/table/"

// Função para buscar todos os dados de uma tabela, incluindo todas as páginas
export async function fetchData(tableId: number) {
  try {
    console.log(`Fetching data from table ${tableId}`)

    // Buscar a primeira página para obter o total e iniciar o processo
    const firstPageResponse = await fetchPage(tableId, 1, 100)
    let allResults = [...firstPageResponse.results]

    // Calcular quantas páginas precisamos buscar
    const totalItems = firstPageResponse.count
    const totalPages = Math.ceil(totalItems / 100)

    console.log(`Total items: ${totalItems}, Total pages: ${totalPages}`)

    // Buscar as páginas restantes em paralelo
    if (totalPages > 1) {
      const pagePromises = []
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(fetchPage(tableId, page, 100))
      }

      const pageResponses = await Promise.all(pagePromises)

      // Combinar todos os resultados
      pageResponses.forEach((response) => {
        allResults = [...allResults, ...response.results]
      })
    }

    console.log(`Total records fetched from table ${tableId}: ${allResults.length}`)

    // Retornar no mesmo formato da resposta original, mas com todos os resultados
    return {
      count: totalItems,
      next: null,
      previous: null,
      results: allResults,
    }
  } catch (error) {
    console.error(`Error fetching all data from table ${tableId}:`, error)
    throw error
  }
}

// Função auxiliar para buscar uma página específica
async function fetchPage(tableId: number, page: number, size: number) {
  try {
    const response = await fetch(`${BASE_URL}${tableId}/?user_field_names=true&page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log(`Fetched page ${page} from table ${tableId}, got ${data.results.length} records`)
    return data
  } catch (error) {
    console.error(`Error fetching page ${page} from table ${tableId}:`, error)
    throw error
  }
}

export async function updateSettings(tableId: number, rowId: number, data: any) {
  try {
    // Convert field names to match the API expectations
    const apiData: Record<string, any> = {}

    // Map our form fields to the actual Baserow field names
    if (data.bot_name !== undefined) apiData.nomeBot = data.bot_name
    if (data.welcome_message !== undefined) apiData.link = data.welcome_message
    if (data.auto_reply !== undefined) apiData.Active = data.auto_reply

    const response = await fetch(`${BASE_URL}${tableId}/${rowId}/?user_field_names=true`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error updating settings in table ${tableId}:`, error)
    throw error
  }
}

