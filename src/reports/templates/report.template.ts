import { CreateReportDto } from '../dto/create-report.dto.js';

/**
 * Genera un template HTML tabular y presentable para las alertas de fuga de agua.
 */
export function generateReportTemplate(dto: CreateReportDto, photoUrl: string): string {
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
  const severityColors: Record<string, string> = {
    LOW: '#5cb85c',
    MEDIUM: '#f0ad4e',
    HIGH: '#d9534f',
    CRITICAL: '#c9302c',
  };

  const severity = dto.severity ?? 'MEDIUM';
  const severityColor = severityColors[severity] ?? '#f0ad4e';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1a73e8; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">💧 Sistema de Reportes de Fugas de Agua</h1>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #d9534f; margin-top: 0;">🚨 Nueva Alerta de Fuga</h2>
        <p style="color: #555;">Se ha registrado un nuevo reporte que requiere atención inmediata de la cuadrilla de mantenimiento:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #e9ecef;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; width: 35%;">📌 Título</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${escapeHtml(dto.title)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">📍 Ubicación</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${escapeHtml(dto.location)}</td>
          </tr>
          <tr style="background-color: #e9ecef;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">📝 Descripción</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${escapeHtml(dto.description)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Teléfono</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${escapeHtml(dto.phone ?? 'No proporcionado')}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">⚠️ Severidad</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">
              <span style="background-color: ${severityColor}; color: #fff; padding: 4px 12px; border-radius: 4px; font-weight: bold;">
                ${severity}
              </span>
            </td>
          </tr>
          <tr style="background-color: #e9ecef;">
            <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">📅 Fecha</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td>
          </tr>
        </table>

        <img src="${escapeHtml(photoUrl)}" alt="Evidencia fotografica de la fuga" width="560" style="display: block; width: 100%; max-width: 560px; height: auto; border-radius: 8px;" />

        <p style="color: #555;">Por favor, revisa el sistema para más detalles y toma las acciones correspondientes.</p>
      </div>

      <div style="background-color: #343a40; color: #adb5bd; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">Este es un correo automático del Sistema de Reportes de Fugas de Agua.</p>
        <p style="margin: 5px 0 0;">No responder a este mensaje.</p>
      </div>
    </div>
  `;
}
