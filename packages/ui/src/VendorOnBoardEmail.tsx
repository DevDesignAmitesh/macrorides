import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
} from "@react-email/components";

type VendorAccountCreatedEmailProps = {
  name: string;
};

export const VendorAccountCreatedEmail = ({
  name,
}: VendorAccountCreatedEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f6f7f9",
          color: "#1f2937",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "24px",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            padding: "32px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: "28px" }}>
            <Heading
              as="h1"
              style={{
                fontSize: "24px",
                margin: 0,
                fontWeight: 700,
                color: "#16a34a",
              }}
            >
              🎉 Vendor Account Created
            </Heading>

            <Text
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Welcome to Macro Rides
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ fontSize: "15px", lineHeight: 1.7 }}>
            <Text style={{ marginBottom: "14px" }}>
              Hi <strong>{name}</strong>,
            </Text>

            <Text style={{ marginBottom: "16px" }}>
              We’re happy to let you know that your{" "}
              <strong>vendor account has been successfully created</strong> on{" "}
              <strong style={{ color: "#16a34a" }}>Macro Rides</strong>.
            </Text>

            <Text style={{ marginBottom: "16px" }}>
              Our team is currently reviewing your details. This verification
              process usually takes <strong>24–48 hours</strong>.
            </Text>

            <Section
              style={{
                backgroundColor: "#ecfdf5",
                border: "1px solid #bbf7d0",
                padding: "16px",
                borderRadius: "8px",
                margin: "20px 0",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#065f46",
                  fontWeight: 600,
                }}
              >
                🔎 What happens next?
              </Text>

              <ul
                style={{
                  margin: "8px 0 0 18px",
                  padding: 0,
                  color: "#065f46",
                }}
              >
                <li>Your documents will be reviewed</li>
                <li>Your account will be verified</li>
                <li>You’ll be notified once approved</li>
              </ul>
            </Section>

            <Text style={{ marginBottom: "16px" }}>
              No action is required from your side at the moment. We’ll reach out
              to you as soon as the verification is complete.
            </Text>

            <Text style={{ marginBottom: "6px" }}>
              If you need help, feel free to reach us:
            </Text>

            <Text style={{ margin: 0, color: "#374151" }}>
              📞 <strong>8876567890</strong>
              <br />
              📧{" "}
              <Link
                href="mailto:support@macrorides.com"
                style={{
                  color: "#16a34a",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                support@macrorides.com
              </Link>
            </Text>

            <Text style={{ marginTop: "24px", marginBottom: "4px" }}>
              Regards,
            </Text>

            <Text
              style={{
                margin: 0,
                fontWeight: "bold",
                fontSize: "16px",
                color: "#16a34a",
              }}
            >
              The Macro Rides Team
            </Text>
          </Section>
        </Container>

        {/* Footer */}
        <Text
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "28px",
          }}
        >
          © 2025 Macro Rides. All rights reserved.
        </Text>
      </Body>
    </Html>
  );
};
