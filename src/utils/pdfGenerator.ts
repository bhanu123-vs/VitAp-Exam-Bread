import { jsPDF } from 'jspdf';
import { AvailablePyqPaper } from '../types.js';

export function downloadPypPdf(paper: AvailablePyqPaper): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // Outer Border
  doc.setDrawColor(0, 33, 71); // VIT Navy Blue (#002147)
  doc.setLineWidth(0.6);
  doc.rect(margin, 10, pageWidth - margin * 2, 44);

  // University Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 33, 71); // Navy Blue
  doc.text('VIT-AP UNIVERSITY, AMARAVATI', pageWidth / 2, y + 2, { align: 'center' });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9); // Amber / Gold accent
  const schoolName = paper.courseCode.startsWith('ECE')
    ? 'SCHOOL OF ELECTRONICS ENGINEERING (SENSE)'
    : paper.courseCode.startsWith('MAT') || paper.courseCode.startsWith('PHY') || paper.courseCode.startsWith('CHY') || paper.courseCode.startsWith('ENG')
    ? 'SCHOOL OF ADVANCED SCIENCES (SAS)'
    : paper.courseCode.startsWith('MGT')
    ? 'VIT-AP SCHOOL OF BUSINESS (VSB)'
    : 'SCHOOL OF COMPUTER SCIENCE AND ENGINEERING (SCOPE)';
  doc.text(schoolName, pageWidth / 2, y + 2, { align: 'center' });

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  const examLabel =
    paper.examType === 'cat1'
      ? 'CONTINUOUS ASSESSMENT TEST 1 (CAT-1)'
      : paper.examType === 'cat2'
      ? 'CONTINUOUS ASSESSMENT TEST 2 (CAT-2)'
      : paper.examType === 'fat' || paper.examType === 'end_term'
      ? 'FINAL ASSESSMENT TEST (FAT) — TERM-END EXAMINATION'
      : 'CONTINUOUS ASSESSMENT TEST (CAT)';
  doc.text(`${examLabel} — ${paper.year}`, pageWidth / 2, y + 2, { align: 'center' });

  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);
  doc.text(
    `${paper.courseCode}: ${paper.courseName.toUpperCase()}  •  ${paper.semester || 'VIT-AP University Examination'}`,
    pageWidth / 2,
    y + 2,
    { align: 'center' }
  );

  y += 6;
  // Metadata Bar inside box
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y + 1, pageWidth - margin, y + 1);
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 20, 20);
  doc.text(`Time Allowed: ${paper.timeDuration}`, margin + 3, y);
  doc.text(`Slot / Session: Morning / Afternoon`, pageWidth / 2, y, { align: 'center' });
  doc.text(`Maximum Marks: ${paper.totalMarks}`, pageWidth - margin - 3, y, { align: 'right' });

  y = 58;

  // General Instructions Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, pageWidth - margin * 2, 17, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, pageWidth - margin * 2, 17, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 33, 71);
  doc.text('INSTRUCTIONS TO CANDIDATES (VIT-AP ACADEMIC REGULATIONS):', margin + 3, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text('1. Answer all questions strictly adhering to section instructions and marks breakdown.', margin + 3, y + 8);
  doc.text('2. Assume suitable missing data if necessary, stating assumptions clearly. Scientific calculators allowed.', margin + 3, y + 11.5);
  doc.text('3. Authentic academic archive from official university examination syllabus.', margin + 3, y + 15);

  y += 23;

  // Table Column Header for Questions
  doc.setFillColor(0, 33, 71);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Q. No.', margin + 3, y + 4.8);
  doc.text('Questions & Sub-Divisions', margin + 18, y + 4.8);
  doc.text('CO', pageWidth - margin - 22, y + 4.8);
  doc.text('Marks', pageWidth - margin - 10, y + 4.8, { align: 'right' });

  y += 10;

  // Render Questions
  let currentSection = '';

  paper.sampleQuestions.forEach((q, idx) => {
    // Check if new page is needed
    if (y > pageHeight - 25) {
      renderFooter(doc, pageWidth, pageHeight, margin, paper);
      doc.addPage();
      y = 16;
    }

    if (q.section && q.section !== currentSection) {
      currentSection = q.section;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9); // Amber / Gold
      doc.text(`${currentSection.toUpperCase()}`, margin, y);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
      y += 6;
    }

    // Question number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 33, 71);
    const qNumText = q.number.startsWith('Q') ? q.number : `Q${q.number}`;
    doc.text(qNumText, margin + 2, y);

    // CO level
    const coLevel = `CO${(idx % 4) + 1}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(coLevel, pageWidth - margin - 22, y);

    // Marks on the right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    const marksText = `[${q.marks}]`;
    doc.text(marksText, pageWidth - margin - 3, y, { align: 'right' });

    // Question text (wrapped)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    const textStartX = margin + 18;
    const maxTextWidth = pageWidth - margin * 2 - 44;
    const splitLines = doc.splitTextToSize(q.text, maxTextWidth);

    doc.text(splitLines, textStartX, y);
    y += splitLines.length * 4.2 + 4;
  });

  // Footer on final page
  renderFooter(doc, pageWidth, pageHeight, margin, paper);

  // Trigger browser download
  const safeCourse = paper.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
  const safeExam =
    paper.examType === 'cat1'
      ? 'CAT1'
      : paper.examType === 'cat2'
      ? 'CAT2'
      : paper.examType === 'fat' || paper.examType === 'end_term'
      ? 'FAT'
      : 'CAT';
  doc.save(`VIT_AP_${safeCourse}_${safeExam}_${paper.year}.pdf`);
}

function renderFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  paper: AvailablePyqPaper
) {
  const footerY = pageHeight - 8;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  const examShort =
    paper.examType === 'cat1'
      ? 'CAT-1'
      : paper.examType === 'cat2'
      ? 'CAT-2'
      : paper.examType === 'fat' || paper.examType === 'end_term'
      ? 'FAT'
      : 'CAT';

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `VIT-AP University Official Examination Archive • EXAM BREAD`,
    margin,
    footerY
  );
  doc.text(
    `VIT-AP ${paper.courseCode} ${examShort} • Page ${doc.getNumberOfPages()}`,
    pageWidth - margin,
    footerY,
    { align: 'right' }
  );
}
