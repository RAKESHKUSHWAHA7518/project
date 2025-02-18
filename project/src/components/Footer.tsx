import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);

  return (
    <>
      <footer className="bg-white text-gray-400 py-6 mt-auto z-20 ">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-sm text-gray-400  "
              >
                Datenschutz
              </button>
              <button
                onClick={() => setShowImpressumModal(true)}
                className="text-sm text-gray-400 "
              >
                Impressum
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Impressum Modal */}
      {showImpressumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-red-500 text-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-red-600">
              <h2 className="text-4xl font-bold italic">Impressum</h2>
              <button
                onClick={() => setShowImpressumModal(false)}
                className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-red-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Verantwortlich gem.§ 5 TMG:
                </h3>
                <p>Stefan Lukas, Engelskirchen</p>
                <p>Kontakt: info@edmund-schiefeling.de</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">
                  Konzeption und Projektleitung:
                </h3>
                <p>Dr. Katrin Hieke</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">
                  Website-Programmierung:
                </h3>
                <p>SugarPool GmbH</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">
                  Scrolly-Story Art Direktion, Redaktion, Programmierung:
                </h3>
                <p>tinkerbrain. Institut für Bildungsinitiativen GmbH</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">
                  Aufbau des digitalen Archivs:
                </h3>
                <p>Marianne Möller</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Illustration:</h3>
                <p>Astrid Jaekel</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Sprecher:</h3>
                <p>Kai Mönnich</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Sprecherin:</h3>
                <p>Heike Bänsch</p>
              </div>

              <div className="pt-6 border-t border-red-600">
                <h3 className="text-xl font-bold mb-4">
                  Wir danken allen Mitwirkenden:
                </h3>
                <ul className="space-y-2">
                  <li>Dr. Gero Karthaus, Bürgermeister Engelskirchen</li>
                  <li>Rat und Verwaltung der Gemeinde Engelskirchen</li>
                  <li>Domenik Olbrisch</li>
                  <li>Christian Teipel</li>
                  <li>LVR-Freilichtmuseum Lindlar</li>
                  <li>Schulgemeinschaft des Aggertal-Gymnasiums</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-sky-200 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Datenschutzerklärung
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose max-w-none">
                <p className="mb-6">
                  Wir freuen uns über Ihr Interesse an dieser Website.
                  Nachstehend informieren wir Sie ausführlich über den Umgang
                  mit Ihren Daten. Wir weisen darauf hin, dass die
                  Datenübertragung im Internet Sicherheitslücken aufweisen kann,
                  etwa bei der Kommunikation per E-Mail. Ein lückenloser Schutz
                  der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">
                  NAME UND ANSCHRIFT DES FÜR DIE VERARBEITUNG VERANTWORTLICHEN
                </h3>
                <p className="mb-4">
                  Stefan Lukas
                  <br />
                  LUKAS-ERZETT
                  <br />
                  Gebrüder-Lukas-Straße 1<br />
                  51766 Engelskirchen
                  <br />
                  E-Mail: stefan.lukas@lukas-erzett.de
                  <br />
                  Tel.: +49226384306
                </p>

                <p className="mb-6">
                  Jede betroffene Person kann sich jederzeit bei allen Fragen
                  und Anregungen zum Datenschutz direkt an uns wenden.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">
                  PERSONENBEZOGENE DATEN
                </h3>
                <p className="mb-6">
                  Eine Weitergabe Ihrer personenbezogenen Daten an Dritte
                  erfolgt nur mit Ihrer ausdrücklichen Zustimmung.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">
                  SSL-VERSCHLÜSSELUNG
                </h3>
                <p className="mb-6">
                  Wenn die SSL Verschlüsselung aktiviert ist, können die Daten,
                  die Sie an uns übermitteln, nicht von Dritten mitgelesen
                  werden.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">
                  RECHT AUF AUSKUNFT, LÖSCHUNG, SPERRUNG
                </h3>
                <p className="mb-6">
                  Sie haben jederzeit das Recht auf unentgeltliche Auskunft über
                  Ihre gespeicherten personenbezogenen Daten, deren Herkunft und
                  Empfänger und den Zweck der Datenverarbeitung sowie ein Recht
                  auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu
                  sowie zu weiteren Fragen zum Thema personenbezogene Daten
                  können Sie sich jederzeit unter der im Impressum angegebenen
                  Adresse an uns wenden.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">COOKIES</h3>
                <p className="mb-4">
                  Diese Webseite verwendet Cookies, um Präferenzen der Besucher
                  erkennen und die Webseiten entsprechend optimal gestalten zu
                  können. Cookies sind kleine Dateien, die auf der Festplatte
                  abgelegt werden.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Cookie-Kategorien:
                </h4>
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">
                    <strong>Unbedingt erforderliche Cookies (Typ 1):</strong>{' '}
                    Diese Cookies sind zwingend erforderlich, damit diese
                    Website und alle ihre Funktionen ordnungsgemäß arbeiten
                    können.
                  </li>
                  <li className="mb-2">
                    <strong>Funktions-Cookies (Typ 2):</strong> Diese Cookies
                    ermöglichen es, Komfort und Leistung von Websites zu
                    verbessern und verschiedene Funktionen zur Verfügung zu
                    stellen.
                  </li>
                  <li className="mb-2">
                    <strong>Leistungs-Cookies (Typ 3):</strong> Diese Cookies
                    sammeln Informationen darüber, wie unsere Website verwendet
                    wird.
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Verwendete Cookies:
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      name: 'volume',
                      description: 'Speichert die Wiedergabelautstärke',
                      author: 'flowPage.de',
                      type: 2,
                    },
                    {
                      name: 'font_size',
                      description: 'Speichert die ausgewählte Schriftgröße',
                      author: 'flowPage.de',
                      type: 2,
                    },
                    {
                      name: 'consent',
                      description:
                        'Speichert die Zustimmung zur Cookie/Datenschutz-Policy',
                      author: 'flowPage.de',
                      type: 2,
                    },
                  ].map((cookie, index) => (
                    <div key={index} className="  p-4 rounded-lg">
                      <div className="font-semibold mb-1">
                        Name: {cookie.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Beschreibung: {cookie.description}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Urheber: {cookie.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        Typ: {cookie.type}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 mb-6">
                  Diese Webseite kann auch ohne Cookies besucht werden. Die
                  meisten Browser akzeptieren Cookies automatisch. Das Speichern
                  von Cookies kann verhindert werden durch die Aktivierung der
                  Browser-Einstellung "keine Cookies akzeptieren".
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">
                  AUSWERTUNG VON NUTZUNGSDATEN
                </h3>
                <p className="mb-6">
                  Diese Webseite verwendet Matomo als Webanalysedienst. Matomo
                  verwendet Cookies, die eine Analyse der Benutzung der Webseite
                  ermöglichen. Die durch den Cookie erzeugten
                  Nutzungsinformationen werden anonymisiert und nicht an Dritte
                  weitergegeben.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
