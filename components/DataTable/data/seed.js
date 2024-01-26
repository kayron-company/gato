const { faker } = require("@faker-js/faker")
const fs = require("fs")
const path = require("path")

// Supondo que você tenha definido esses valores ou que você os obtenha de algum lugar
const pageNames = ["Page A", "Page B", "Page C"] // Exemplo de nomes de páginas

const statuses = ["lead", "atendimento", "agendamento", "visita", "proposta", "fechamento"]

const leads = Array.from({ length: 100 }, () => ({
  id: faker.datatype.number({ min: 1000, max: 9999 }),
  full_name: faker.animal.cat(),
  lead_id: `LEAD-${faker.datatype.uuid()}`,
  form_id: `FORM-${faker.datatype.uuid()}`,
  created_time: faker.date.recent().toISOString(),
  facebook_page_id: `PAGE-${faker.datatype.uuid()}`,
  facebook_page_name: faker.helpers.arrayElement(pageNames),
  status: faker.helpers.arrayElement(statuses),
}))

const outputPath = path.join(__dirname, "leads.json") // Ajuste o caminho conforme necessário
fs.writeFileSync(outputPath, JSON.stringify(leads, null, 2))

console.log("✅ Leads data generated.")
