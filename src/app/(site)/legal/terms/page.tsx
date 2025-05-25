import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export const dynamic = 'force-dynamic'
const TermsOfService = () => {
  return (
    <section className='pt-24'>
      <div className='mx-auto max-w-4xl px-4 py-8'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold'>Terms and Conditions</h1>
          <p className='text-muted-foreground'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                By accessing and using SkillSwap (&apos;the Service&apos;), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
              <p>
                These Terms and Conditions (&apos;Terms&apos;) govern your use
                of our peer learning marketplace where users can exchange
                skills, knowledge, and expertise with one another.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                SkillSwap is a peer-to-peer learning platform that enables users
                to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Offer skills and knowledge they possess to teach others</li>
                <li>Request to learn skills from other users</li>
                <li>
                  Participate in skill exchanges through our credit system
                </li>
                <li>Schedule and conduct learning sessions</li>
                <li>Rate and review learning experiences</li>
                <li>Build a community of learners and teachers</li>
              </ul>
              <p>
                The Service facilitates connections between users but does not
                guarantee the quality, safety, or legality of any exchanges.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                To use certain features of the Service, you must register for an
                account. You agree to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>
                  Maintain and update your information to keep it accurate and
                  current
                </li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Accept responsibility for all activities under your account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
              <p>
                You must be at least 18 years old to create an account. Users
                under 18 may use the Service only with parental consent and
                supervision.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Skill Exchanges and Credit System</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>SkillSwap operates on a credit-based system where:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Users earn credits by teaching skills to others</li>
                <li>Users spend credits to learn skills from others</li>
                <li>
                  Credits have no monetary value and cannot be exchanged for
                  cash
                </li>
                <li>
                  Credits may expire if accounts remain inactive for extended
                  periods
                </li>
                <li>
                  We reserve the right to adjust credit balances in cases of
                  abuse or fraud
                </li>
              </ul>
              <p>
                All skill exchanges are agreements between individual users.
                SkillSwap is not a party to these exchanges and does not
                guarantee their completion or quality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. User Conduct and Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>You agree not to use the Service to:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate, offensive, or illegal content</li>
                <li>
                  Attempt to gain unauthorized access to the Service or other
                  users&apos; accounts
                </li>
                <li>
                  Use the Service for commercial purposes without authorization
                </li>
                <li>
                  Create fake accounts or misrepresent your identity or
                  qualifications
                </li>
                <li>Spam or send unsolicited communications to other users</li>
                <li>
                  Engage in any activity that could damage or impair the Service
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                You retain ownership of content you create and share on the
                Service. By posting content, you grant SkillSwap a
                non-exclusive, worldwide, royalty-free license to use, display,
                and distribute your content in connection with the Service.
              </p>
              <p>
                You represent that you have the right to share any content you
                post and that it does not violate any third-party rights.
              </p>
              <p>
                SkillSwap respects intellectual property rights and will respond
                to valid takedown notices under applicable law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your information when you use the
                Service. By using the Service, you agree to the collection and
                use of information in accordance with our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimers and Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                THE SERVICE IS PROVIDED &apos;AS IS&apos; WITHOUT WARRANTIES OF
                ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
                INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>SkillSwap is not responsible for:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  The quality, safety, or legality of skill exchanges between
                  users
                </li>
                <li>The accuracy of user profiles or skill descriptions</li>
                <li>Disputes between users</li>
                <li>Any damages resulting from your use of the Service</li>
                <li>Interruptions or technical issues with the Service</li>
              </ul>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR LIABILITY SHALL NOT
                EXCEED $100 OR THE AMOUNT YOU PAID TO USE THE SERVICE IN THE
                PAST 12 MONTHS.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                You agree to indemnify and hold harmless SkillSwap, its
                officers, directors, employees, and agents from any claims,
                damages, or expenses arising from your use of the Service,
                violation of these Terms, or infringement of any rights of
                another.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We may terminate or suspend your account and access to the
                Service at any time, with or without cause, with or without
                notice.
              </p>
              <p>
                You may terminate your account at any time by contacting us.
                Upon termination, your right to use the Service will cease
                immediately.
              </p>
              <p>
                Provisions that by their nature should survive termination will
                survive, including ownership provisions, warranty disclaimers,
                and limitations of liability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                Any disputes arising from these Terms or your use of the Service
                will be resolved through binding arbitration, except that you
                may assert claims in small claims court if they qualify.
              </p>
              <p>
                You waive any right to participate in class action lawsuits or
                class-wide arbitration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify users of significant changes via email or through the
                Service. Your continued use of the Service after changes
                constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                These Terms are governed by and construed in accordance with the
                laws of Nigeria, without regard to conflict of law principles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className='bg-muted rounded-lg p-4'>
                <p>Email: legal@skillswap.com</p>
                <p>Address: CBD, Abuja</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default TermsOfService
