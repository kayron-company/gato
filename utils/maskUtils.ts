//crie uma função para formatar o telefone, mas sem o +55 do país, somente dd e o número com o digito 9 na frente depois do ddd:
export function formatWhatsApp(phone: string): string {
  // Remove todos os caracteres não-numéricos exceto o sinal de '+'
  const digits = phone.replace(/[^\d+]/g, '');
  // Formata considerando o código do país e o DDD brasileiro (XX) XXXXX-XXXX
  const formatted = digits.replace(/^\+?(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  return formatted;
}

export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não-numéricos exceto o sinal de '+'
  const digits = phone.replace(/[^\d+]/g, '');
  // Formata considerando o código do país e o DDD brasileiro (+55) (XX) XXXXX-XXXX
  const formatted = digits.replace(/^\+?(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4');
  return formatted;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Formata a data para o padrão brasileiro
  const formatted = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatted;
}
