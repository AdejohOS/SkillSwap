import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export const dynamic = 'force-dynamic'
const PrivacyPage = () => {
  return (
    <section className='pt-24'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold'>Privacy Policy</h1>
          <p className='text-muted-foreground'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                SkillSwap ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our peer
                learning marketplace.
              </p>
              <p>
                By using our Service, you consent to the data practices
                described in this policy. If you do not agree with this policy,
                please do not use our Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <h4 className='font-semibold'>Personal Information</h4>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Name, email address, and profile information</li>
                <li>Skills, expertise, and learning interests</li>
                <li>Profile photos and other content you upload</li>
                <li>Messages and communications with other users</li>
                <li>Reviews and ratings you provide</li>
                <li>
                  Payment information (processed securely by third-party
                  providers)
                </li>
              </ul>

              <h4 className='mt-6 font-semibold'>
                Automatically Collected Information
              </h4>
              <p>
                We automatically collect certain information when you use our
                Service:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location information (if you enable location services)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h4 className='mt-6 font-semibold'>
                Information from Third Parties
              </h4>
              <p>We may receive information from:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Social media platforms when you connect your accounts</li>
                <li>Authentication services</li>
                <li>Analytics providers</li>
                <li>Other users who refer you to the Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>We use your information to:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Provide, maintain, and improve our Service</li>
                <li>Create and manage your account</li>
                <li>
                  Facilitate skill exchanges and connections between users
                </li>
                <li>Process transactions and manage our credit system</li>
                <li>
                  Send you notifications, updates, and promotional
                  communications
                </li>
                <li>Provide customer support and respond to your inquiries</li>
                <li>
                  Personalize your experience and recommend relevant content
                </li>
                <li>Ensure safety and security of our platform</li>
                <li>Comply with legal obligations and enforce our Terms</li>
                <li>Conduct research and analytics to improve our Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <h4 className='font-semibold'>With Other Users</h4>
              <p>
                Your profile information, skills, and reviews are visible to
                other users to facilitate skill exchanges. You can control what
                information is shared through your privacy settings.
              </p>

              <h4 className='mt-6 font-semibold'>With Service Providers</h4>
              <p>
                We share information with third-party service providers who help
                us operate our Service, including:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Cloud hosting and storage providers</li>
                <li>Payment processors</li>
                <li>Email and communication services</li>
                <li>Analytics and monitoring tools</li>
                <li>Customer support platforms</li>
              </ul>

              <h4 className='mt-6 font-semibold'>Legal Requirements</h4>
              <p>
                We may disclose your information if required by law or in
                response to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Legal process or government requests</li>
                <li>Protecting our rights, property, or safety</li>
                <li>Preventing fraud or illegal activities</li>
                <li>Enforcing our Terms and Conditions</li>
              </ul>

              <h4 className='mt-6 font-semibold'>Business Transfers</h4>
              <p>
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred as part of that transaction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Security</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We implement appropriate technical and organizational measures
                to protect your information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
              <p>
                However, no method of transmission over the internet or
                electronic storage is 100% secure. We cannot guarantee absolute
                security of your information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a
                  portable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your
                  information
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of
                  processing
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent for
                  processing based on consent
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us using the
                information provided below. We will respond to your request
                within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and provide personalized content.
                Types of cookies we use include:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Essential Cookies:</strong> Required for the Service
                  to function properly
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  users interact with our Service
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant
                  advertisements
                </li>
              </ul>
              <p>
                You can control cookies through your browser settings, but
                disabling certain cookies may affect the functionality of our
                Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                Our Service may contain links to third-party websites or
                integrate with third-party services. We are not responsible for
                the privacy practices of these third parties. We encourage you
                to review their privacy policies before providing any
                information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                Our Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected personal
                information from a child under 13, we will take steps to delete
                such information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your information in accordance with
                applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We retain your personal information for as long as necessary to
                provide our Service and fulfill the purposes outlined in this
                policy. We may retain certain information for longer periods as
                required by law or for legitimate business purposes.
              </p>
              <p>
                When you delete your account, we will delete or anonymize your
                personal information, except where we are required to retain it
                for legal or regulatory purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date. We encourage you
                to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className='bg-muted space-y-2 rounded-lg p-4'>
                <p>
                  <strong>Email:</strong> privacy@skillswap.com
                </p>
                <p>
                  <strong>Address:</strong> CBD, Abuja
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> dpo@skillswap.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPage
