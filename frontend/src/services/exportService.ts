export class ExportService {
  public static async exportShortlistPDF(candidates: any[]): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create dummy pdf download
        const blob = new Blob(
          [
            `CIISIC Shortlisted Candidates Report\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal Shortlisted: ${candidates.length}\n`
          ],
          { type: 'application/pdf' }
        );
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ciisic_shortlist_${Date.now()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        resolve(true);
      }, 1500);
    });
  }

  public static async exportAnalyticsExcel(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob([`Challenge Title,Submissions,Shortlisted\nIoT Moisture Telemetry,14,2\nBio-Fuel Viscosity,8,1\n`], {
          type: 'text/csv'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ciisic_analytics_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        resolve(true);
      }, 1500);
    });
  }
}
