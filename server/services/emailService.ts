import nodemailer from 'nodemailer';

export interface PaperSubmissionPayload {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'cat1' | 'cat2' | 'fat';
  year: number;
  fileName: string;
  fileSize: number;
  pdfBase64?: string;
  uploaderEmail?: string;
  uploaderNotes?: string;
  submittedAt: string;
  approvalToken: string;
}

const BHANU_EMAIL = 'bhanu.25bce8476@vitapstudent.ac.in';

export async function sendPaperSubmissionEmail(
  submission: PaperSubmissionPayload,
  appUrl: string = process.env.APP_URL || 'http://localhost:3000'
): Promise<{ success: boolean; method: 'smtp' | 'simulated'; mailtoUrl: string; message: string }> {
  const cleanAppUrl = appUrl.replace(/\/+$/, '');
  const approveUrl = `${cleanAppUrl}/api/submissions/${submission.id}/approve?token=${submission.approvalToken}`;
  const rejectUrl = `${cleanAppUrl}/api/submissions/${submission.id}/reject?token=${submission.approvalToken}`;
  const examTypeUpper = submission.examType.toUpperCase();
  const subjectLine = `[EXAM BREAD] New PYP Submission: ${submission.courseName} (${submission.courseCode}) - ${examTypeUpper} ${submission.year}`;

  const textBody = `Hello Bhanu,

A new VIT-AP University question paper has been submitted to EXAM BREAD and is awaiting your review:

--------------------------------------------------
PAPER DETAILS:
• Subject: ${submission.courseName} (${submission.courseCode})
• Exam Segment: ${examTypeUpper}
• Examination Year: ${submission.year}
• File Attached: ${submission.fileName} (${Math.round(submission.fileSize / 1024)} KB)
• Submitter Email: ${submission.uploaderEmail || 'Anonymous Student'}
• Submitter Notes: ${submission.uploaderNotes || 'No notes provided'}
• Submitted At: ${submission.submittedAt}
--------------------------------------------------

MODERATION ACTIONS:
If this question paper is authentic and legible, click below to approve and automatically add it into the official EXAM BREAD archive:

✅ APPROVE & ADD TO ARCHIVE:
${approveUrl}

❌ REJECT / DISCARD:
${rejectUrl}

Thank you for maintaining the EXAM BREAD VIT-AP University Question Paper Archive!
- EXAM BREAD Submission System
`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 16px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #1c1917; margin: 0 0 6px 0; font-size: 22px; font-weight: 800;">EXAM BREAD</h2>
    <p style="color: #78716c; margin: 0; font-size: 13px;">VIT-AP University Exam Question Paper Archive</p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 12px;">New Paper Awaiting Review</span>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #78716c; width: 140px; font-weight: 600;">Subject / Course:</td>
        <td style="padding: 6px 0; color: #1c1917; font-weight: 700;">${submission.courseName} <span style="color: #d97706; font-family: monospace;">(${submission.courseCode})</span></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78716c; font-weight: 600;">Exam Segment:</td>
        <td style="padding: 6px 0; color: #1c1917; font-weight: 700;">${examTypeUpper}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78716c; font-weight: 600;">Exam Year:</td>
        <td style="padding: 6px 0; color: #1c1917;">${submission.year}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78716c; font-weight: 600;">Attached File:</td>
        <td style="padding: 6px 0; color: #1c1917; font-weight: 600;">${submission.fileName} <span style="color: #78716c; font-size: 12px;">(${Math.round(submission.fileSize / 1024)} KB)</span></td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78716c; font-weight: 600;">Submitted By:</td>
        <td style="padding: 6px 0; color: #1c1917;">${submission.uploaderEmail || 'Anonymous Student'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #78716c; font-weight: 600;">Submission Time:</td>
        <td style="padding: 6px 0; color: #1c1917;">${submission.submittedAt}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1c1917;">Moderator One-Click Actions</h3>
    <p style="font-size: 12px; color: #78716c; margin: 0 0 16px 0;">If this question paper is authentic and good quality, click below to publish it directly into the repository:</p>
    
    <div style="display: flex; gap: 12px; justify-content: center;">
      <a href="${approveUrl}" style="display: inline-block; background-color: #f59e0b; color: #0c0a09; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px;">
        ✅ Approve & Add to Repository
      </a>
      <a href="${rejectUrl}" style="display: inline-block; background-color: #f5f5f4; color: #78716c; font-weight: 600; font-size: 13px; text-decoration: none; padding: 10px 16px; border-radius: 8px; border: 1px solid #d6d3d1;">
        Reject
      </a>
    </div>
  </div>

  <div style="text-align: center; font-size: 11px; color: #a8a29e;">
    <p style="margin: 0;">Sent automatically to <strong>${BHANU_EMAIL}</strong> for EXAM BREAD University Archive Maintenance.</p>
  </div>
</div>
`;

  // Pre-encoded mailto URL so the client or user can trigger it immediately from the browser
  const mailtoBody = encodeURIComponent(textBody);
  const mailtoSubject = encodeURIComponent(subjectLine);
  const mailtoUrl = `mailto:${BHANU_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const attachments: any[] = [];
      if (submission.pdfBase64) {
        attachments.push({
          filename: submission.fileName,
          content: Buffer.from(submission.pdfBase64.split(',')[1] || submission.pdfBase64, 'base64'),
          contentType: 'application/pdf',
        });
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"EXAM BREAD Submissions" <${smtpUser}>`,
        to: BHANU_EMAIL,
        subject: subjectLine,
        text: textBody,
        html: htmlBody,
        attachments,
      });

      return {
        success: true,
        method: 'smtp',
        mailtoUrl,
        message: `Email successfully delivered to ${BHANU_EMAIL} with question paper attachment.`,
      };
    } catch (err: any) {
      console.warn('SMTP delivery failed, falling back to simulated mail dispatch:', err.message);
    }
  }

  // Fallback: simulated mail dispatch (with full log & mailto link)
  console.log(`\n================== [EXAM BREAD EMAIL DISPATCH] ==================`);
  console.log(`TO: ${BHANU_EMAIL}`);
  console.log(`SUBJECT: ${subjectLine}`);
  console.log(`ATTACHMENT: ${submission.fileName} (${submission.fileSize} bytes)`);
  console.log(`APPROVE URL: ${approveUrl}`);
  console.log(`REJECT URL: ${rejectUrl}`);
  console.log(`=================================================================\n`);

  return {
    success: true,
    method: 'simulated',
    mailtoUrl,
    message: `Submission registered and notification prepared for ${BHANU_EMAIL}.`,
  };
}
