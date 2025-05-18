// This is a placeholder for a real email sending function
// In a production environment, you would use a service like SendGrid, Mailgun, etc.

export async function sendNotificationEmail({
  to,
  subject,
  body
}: {
  to: string
  subject: string
  body: string
}) {
  // In a real implementation, you would call your email service API here
  console.log(`Sending email to ${to} with subject "${subject}": ${body}`)

  // For demonstration purposes, we'll just return a success response
  return {
    success: true,
    messageId: `mock-message-id-${Date.now()}`
  }
}
