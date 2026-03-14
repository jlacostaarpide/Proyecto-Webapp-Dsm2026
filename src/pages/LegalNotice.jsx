import React from 'react';

function LegalNotice() {
  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="mb-4 text-primary border-bottom pb-2">⚖️ Información Legal</h1>
          
          <section className="mb-5">
            <h2 className="h4 text-secondary">1. Aviso Legal</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, del 11 de julio, de servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE), se exponen a continuación los datos identificativos:
            </p>
            <p className="bg-light p-3 border rounded">
              <strong>Titular:</strong> CineApp DSM Project (Proyecto Académico)<br />
              <strong>Institución:</strong> Universidad Pública de Navarra (UPNA)<br />
              <strong>Email:</strong> contacto@cineapp.example.com<br />
              <strong>Finalidad:</strong> Práctica docente de Desarrollo de Software Móvil.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h4 text-secondary">2. Política de Privacidad</h2>
            <p>
              De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril de 2016 (GDPR), le informamos que:
            </p>
            <ul>
              <li><strong>Responsable:</strong> Los datos recogidos a través del formulario de contacto se tratan con la única finalidad de responder a su consulta.</li>
              <li><strong>Legitimación:</strong> Su consentimiento expreso al enviar el formulario.</li>
              <li><strong>Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal.</li>
              <li><strong>Derechos:</strong> Tiene derecho a acceder, rectificar y suprimir los datos.</li>
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h4 text-secondary">3. Política de Cookies</h2>
            <p>
              Esta web utiliza cookies técnicas necesarias para el funcionamiento del sitio y para recordar las preferencias del usuario (como el idioma o la sesión).
            </p>
            <p> No se utilizan cookies de seguimiento ni de terceros con fines publicitarios.</p>
          </section>

          <div className="alert alert-info small mt-4">
            <strong>Nota Importante:</strong> Esta es una aplicación de demostración académica. No introduzca datos reales de carácter sensible.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalNotice;
