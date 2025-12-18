import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";


export default function PrivacyPolicy() {
  return (
    <Box
      component="pre"
      sx={{
        // backgroundColor: '#f5f5f5',
        padding: 2,
        borderRadius: 1,
        overflow: 'auto',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}
    >
      <ReactMarkdown>
        {`# Privacy Policy

**Last updated:** 18/12/25

This Privacy Policy explains how **Gym Junkie** ("we", "our", or "us") collects, uses, discloses, and protects your information when you use our mobile application and related services (the "App").

By using the App, you agree to the collection and use of information in accordance with this Privacy Policy.

---

## 1. Information We Collect

### 1.1 Personal Information

We may collect personal information that can identify you, including but not limited to:

* Name or username
* Email address
* Account identifiers
* Device identifiers

### 1.2 Health and Fitness Data

The App is designed to store and process personal health and fitness data, which may include:

* Workout and exercise data
* Training plans and performance metrics
* Body measurements (e.g. height, weight)
* Fitness goals and activity history

This data may be considered **sensitive personal data** or **health information** under applicable privacy laws.

### 1.3 Usage and Technical Data

We may automatically collect certain information when you use the App, including:

* IP address
* Device type, operating system, and app version
* Log files, crash reports, and diagnostics
* Usage patterns and interactions with the App

---

## 2. How We Use Your Information

We use the collected information for the following purposes:

* To provide, operate, and maintain the App
* To store and display your fitness and health data
* To personalize your experience
* To improve app functionality and performance
* To communicate with you about updates, support, or important notices
* To comply with legal obligations

We do **not** use your health data for advertising purposes.

---

## 3. Legal Basis for Processing

Depending on your location, we process your personal data under one or more of the following legal bases:

* Your consent
* Performance of a contract (providing the App)
* Legitimate interests (improving and securing the App)
* Compliance with legal obligations

You may withdraw your consent at any time where consent is the applicable legal basis.

---

## 4. Data Storage and Security

We take reasonable technical and organizational measures to protect your data, including:

* Encryption in transit and at rest where appropriate
* Access controls and authentication
* Secure cloud infrastructure

Despite our efforts, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.

---

## 5. Data Sharing and Disclosure

We do **not** sell your personal data.

We may share your information only in the following circumstances:

* With service providers who help operate the App (e.g. hosting, analytics), under strict confidentiality agreements
* If required by law, regulation, or legal process
* To protect the rights, safety, and security of users or the App

---

## 6. Data Retention

We retain your personal and health data only for as long as necessary to provide the App and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.

You may request deletion of your data at any time.

---

## 7. Your Rights

Depending on your jurisdiction, you may have the right to:

* Access your personal data
* Correct inaccurate or incomplete data
* Delete your data
* Restrict or object to processing
* Export your data (data portability)
* Withdraw consent at any time

To exercise these rights, contact us using the details below.

---

## 8. Children’s Privacy

The App is not intended for use by individuals under the age of 13 (or the minimum age required in your jurisdiction). We do not knowingly collect personal data from children.

If you believe a child has provided us with personal data, please contact us so we can delete it.

---

## 9. International Data Transfers

Your information may be stored and processed in countries outside your own. Where required, we take steps to ensure appropriate safeguards are in place to protect your data.

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be posted within the App or on our website, and the "Last updated" date will be revised.

Your continued use of the App after changes become effective constitutes acceptance of the updated Privacy Policy.

---

## 11. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or your data, contact us at:

**Email:** marcusjoates@gmail.com

**Entity name:** Gym Junkie`}
      </ReactMarkdown>
    </Box>
  )
}