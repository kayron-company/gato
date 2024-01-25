import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "lead",
    label: "Lead",
    icon: QuestionMarkCircledIcon, // Substitua pelo ícone desejado
  },
  {
    value: "atendimento",
    label: "Atendimento",
    icon: CircleIcon, // Substitua pelo ícone desejado
  },
  {
    value: "agendamento",
    label: "Agendamento",
    icon: StopwatchIcon, // Substitua pelo ícone desejado
  },
  {
    value: "visita",
    label: "Visita",
    icon: CheckCircledIcon, // Substitua pelo ícone desejado
  },
  {
    value: "proposta",
    label: "Proposta",
    icon: CheckCircledIcon, // Substitua pelo ícone desejado
  },
  {
    value: "fechamento",
    label: "Fechamento",
    icon: CrossCircledIcon, // Substitua pelo ícone desejado
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
