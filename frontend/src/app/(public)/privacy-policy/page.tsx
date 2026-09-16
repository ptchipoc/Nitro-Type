"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { ChevronLeft } from "lucide-react";
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();

  return (
    <main className="min-h-screen bg-background flex flex-col">      
      <div className="flex-1 pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("privacy_policy.back")}
          </button>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold font-mono mb-4 ">
              {t("privacy_policy.title")}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {t("privacy_policy.last_updated")} {new Date().toLocaleDateString(locale === "pt" ? "pt-PT" : locale === "fr" ? "fr-FR" : "en-US")}
            </p>
          </div>

          {/* Content */}
          <article className="space-y-8 font-mono text-sm leading-relaxed">
            {/* 1. Introdução */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section1_title")}</h2>
              <p className="text-muted-foreground">
                <span className="text-foreground font-semibold">{t("privacy_policy.section1_welcome")}</span> — {t("privacy_policy.section1_description")}
              </p>
              <p className="text-muted-foreground">
                {t("privacy_policy.section1_description2")}
              </p>
            </section>

            {/* 2. Dados que Coletamos */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section2_title")}</h2>
              
              <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("privacy_policy.section2_account")}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("privacy_policy.section2_account_items")}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("privacy_policy.section2_activity")}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("privacy_policy.section2_activity_items")}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("privacy_policy.section2_technical")}</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("privacy_policy.section2_technical_items")}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">{t("privacy_policy.section2_third_party")}</h3>
                  <p className="text-muted-foreground mb-2">
                    {t("privacy_policy.section2_third_party_intro")}
                  </p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("privacy_policy.section2_third_party_items")}
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Como Usamos os Seus Dados */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section3_title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy_policy.section3_intro")}
              </p>
              
              <ul className="space-y-3 pl-6 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_service")}:</strong> {t("privacy_policy.section3_service_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_personalization")}:</strong> {t("privacy_policy.section3_personalization_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_communication")}:</strong> {t("privacy_policy.section3_communication_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_security")}:</strong> {t("privacy_policy.section3_security_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_analytics")}:</strong> {t("privacy_policy.section3_analytics_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_compliance")}:</strong> {t("privacy_policy.section3_compliance_desc")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-muted-foreground">•</span>
                  <span><strong>{t("privacy_policy.section3_reports")}:</strong> {t("privacy_policy.section3_reports_desc")}</span>
                </li>
              </ul>
            </section>

            {/* 4. Partilha de Dados */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section4_title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy_policy.section4_intro")}
              </p>

              <div className="space-y-3 pl-4 border-l-2 border-primary/30 text-muted-foreground">
                <p><strong className="text-foreground">{t("privacy_policy.section4_providers")}:</strong> {t("privacy_policy.section4_providers_desc")}</p>
                <p><strong className="text-foreground">{t("privacy_policy.section4_authorities")}:</strong> {t("privacy_policy.section4_authorities_desc")}</p>
                <p><strong className="text-foreground">{t("privacy_policy.section4_users")}:</strong> {t("privacy_policy.section4_users_desc")}</p>
                <p><strong className="text-foreground">{t("privacy_policy.section4_successors")}:</strong> {t("privacy_policy.section4_successors_desc")}</p>
              </div>
            </section>

            {/* 5. Segurança dos Dados */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section5_title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy_policy.section5_description")}
              </p>
              <p className="text-muted-foreground whitespace-pre-line mt-4">
                {t("privacy_policy.section5_items")}
              </p>
              <p className="text-muted-foreground text-xs">
                <strong>{t("privacy_policy.section5_note")}</strong>
              </p>
            </section>

            {/* 6. Retenção de Dados */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section6_title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy_policy.section6_description")}
              </p>
              <ul className="space-y-2 pl-6 text-muted-foreground mt-4">
                <li>• <strong>{t("privacy_policy.section6_account_data")}:</strong> {t("privacy_policy.section6_account_data_desc")}</li>
                <li>• <strong>{t("privacy_policy.section6_activity_data")}:</strong> {t("privacy_policy.section6_activity_data_desc")}</li>
                <li>• <strong>{t("privacy_policy.section6_logs")}:</strong> {t("privacy_policy.section6_logs_desc")}</li>
                <li>• <strong>{t("privacy_policy.section6_marketing")}:</strong> {t("privacy_policy.section6_marketing_desc")}</li>
              </ul>
            </section>

            {/* 7. Os Seus Direitos */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section7_title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy_policy.section7_intro")}
              </p>

              <div className="space-y-4 pl-4 border-l-2 border-primary/30">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_access")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_access_desc")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_rectification")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_rectification_desc")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_erasure")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_erasure_desc")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_portability")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_portability_desc")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_objection")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_objection_desc")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t("privacy_policy.section7_automated")}</h3>
                  <p className="text-muted-foreground">{t("privacy_policy.section7_automated_desc")}</p>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mt-4">
                {t("privacy_policy.section7_contact")}
              </p>
            </section>

            {/* 8. Cookies e Rastreamento */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section8_title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy_policy.section8_intro")}
              </p>
              <ul className="space-y-2 pl-6 text-muted-foreground">
                <li>• <strong>{t("privacy_policy.section8_auth")}:</strong> {t("privacy_policy.section8_auth_desc")}</li>
                <li>• <strong>{t("privacy_policy.section8_preferences")}:</strong> {t("privacy_policy.section8_preferences_desc")}</li>
                <li>• <strong>{t("privacy_policy.section8_analytics_label")}:</strong> {t("privacy_policy.section8_analytics_desc")}</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                {t("privacy_policy.section8_footer")}
              </p>
            </section>

            {/* 9. Contacto */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section9_title")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("privacy_policy.section9_description")}
              </p>
              <div className="bg-card/40 border border-border/30 rounded-lg p-4 space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">{t("privacy_policy.section9_email")}:</strong> {t("privacy_policy.section9_email_value")}</p>
                <p><strong className="text-foreground">{t("privacy_policy.section9_address")}:</strong> {t("privacy_policy.section9_address_value")}</p>
                <p><strong className="text-foreground">{t("privacy_policy.section9_dpo")}:</strong> {t("privacy_policy.section9_dpo_value")}</p>
              </div>
            </section>

            {/* 10. Consentimento */}
            <section className="space-y-4 bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section10_title")}</h2>
              <p className="text-muted-foreground">
                <strong className="text-foreground">{t("privacy_policy.section10_intro")}</strong>
              </p>
              <ul className="space-y-2 pl-6 text-muted-foreground mt-4">
                <li>✓ {t("privacy_policy.section10_item1")}</li>
                <li>✓ {t("privacy_policy.section10_item2")}</li>
                <li>✓ {t("privacy_policy.section10_item3")}</li>
                <li>✓ {t("privacy_policy.section10_item4")}</li>
                <li>✓ {t("privacy_policy.section10_item5")}</li>
              </ul>
              <p className="text-muted-foreground text-sm mt-4">
                {t("privacy_policy.section10_footer")}
              </p>
            </section>

            {/* 11. Alterações */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">{t("privacy_policy.section11_title")}</h2>
              <p className="text-muted-foreground">
                {t("privacy_policy.section11_description")}
              </p>
            </section>

            {/* Disclaimer */}
            <div className="mt-12 pt-8 border-t border-border/30 text-xs text-muted-foreground">
              <p>
                <strong>{locale === "pt" ? "Aviso Legal" : locale === "fr" ? "Avis juridique" : "Legal Notice"}:</strong> {t("privacy_policy.disclaimer")}
              </p>
            </div>
          </article>
        </div>
      </div>

    </main>
  );
}
