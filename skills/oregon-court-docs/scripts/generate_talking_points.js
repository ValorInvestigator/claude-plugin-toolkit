#!/usr/bin/env node
/**
 * Talking Points Generator — Carol Fredrick Meeting
 * Simple "He did this" / "She did this" format
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, HeadingLevel } = require('docx');
const fs = require('fs');

const OUTPUT = 'D:\\Bingaman Master Files Old\\Home Base Claude\\TALKING_POINTS_CAROL_MEETING.docx';

// Helpers
const spacer = (pts = 120) => new Paragraph({ spacing: { after: pts }, children: [] });

const title = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
  children: [new TextRun({ text, bold: true, size: 32, font: 'Calibri' })]
});

const subtitle = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text, size: 22, font: 'Calibri', color: '666666' })]
});

const sectionHead = (text) => new Paragraph({
  spacing: { before: 360, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2563EB' } },
  children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 26, font: 'Calibri', color: '1e40af' })]
});

const bullet = (boldPart, rest) => new Paragraph({
  spacing: { after: 140, line: 276 },
  indent: { left: 360 },
  bullet: { level: 0 },
  children: [
    new TextRun({ text: boldPart, bold: true, size: 22, font: 'Calibri' }),
    new TextRun({ text: rest, size: 22, font: 'Calibri' })
  ]
});

const quoteBullet = (text) => new Paragraph({
  spacing: { after: 140, line: 276 },
  indent: { left: 720 },
  children: [
    new TextRun({ text: '\u2014 ', size: 22, font: 'Calibri', color: '666666' }),
    new TextRun({ text, italics: true, size: 22, font: 'Calibri', color: '666666' })
  ]
});

const note = (text) => new Paragraph({
  spacing: { before: 80, after: 200, line: 276 },
  indent: { left: 360 },
  shading: { type: 'clear', fill: 'F0F4FF' },
  children: [new TextRun({ text: '\u25B6 ' + text, size: 20, font: 'Calibri', color: '1e40af' })]
});

// ─────────────────────────────────────────────
// BUILD THE DOCUMENT
// ─────────────────────────────────────────────

const children = [
  title('TALKING POINTS'),
  subtitle('Meeting with Carol Fredrick \u2014 February 2026'),
  subtitle('Estate of Russell H. Bingaman \u2022 Case No. 23PR02271'),

  // ═══════════════════════════════════════════
  // SECTION 1: WHAT GLENN NULL DID
  // ═══════════════════════════════════════════
  sectionHead('What Glenn Null Did'),

  bullet('Null gutted Patty\u2019s petition. ',
    'Levi prepared a 7-page cross-petition with specific facts \u2014 the terminal diagnosis, the weight loss, the hospice fraud, the falls, the isolation. Null stripped all of it out and filed a 5-page boilerplate with none of the evidence. He deleted every fact that would have helped Patty.'),

  bullet('Null sat on the court visitor order for 13 days. ',
    'He dated the Order Appointing Visitor on December 6. He didn\u2019t file it until December 19. That gave the visitor 7 days over Christmas to do a job that normally takes 15\u201318 days. She failed. The judge said so.'),

  bullet('Null intentionally delayed the court visitor to ensure she would fail. ',
    'When Levi warned him the visitor wouldn\u2019t have enough time, Null said on tape: "A court visitor doesn\u2019t need time to evaluate Russell." When the visitor predictably failed, Null asked to push the hearing to January 29. Russell died on January 29.'),

  bullet('Null tampered with the discovery. ',
    'He held medical records for 20 days after scanning them. Then he opened them in Adobe Acrobat Pro, removed content (173 deleted objects), and flat-saved the files to erase the editing history. He extracted the moveout order into a separate file and wiped the audit trail \u2014 all in under 2 minutes. The timestamps prove it.'),

  bullet('Null used Baum\u2019s scanner. ',
    'He scanned his own documents on Wyatt Baum\u2019s Xerox machine \u2014 opposing counsel\u2019s equipment. That means he was physically in Baum\u2019s office. These two were supposed to be adversaries.'),

  bullet('Null ignored Patty for 11 straight days. ',
    'Between November 30 and December 10, Patty emailed him three times asking to see the petition before he filed it. He never responded to any of them. She walked into the December 5 meeting blind.'),

  bullet('Null never filed the motions Patty asked for. ',
    'Levi prepared a Motion to Extend Visitor Deadline and a Motion to Compel Records. Null never filed either one. He told Patty to "come in and talk about it" instead of acting.'),

  bullet('Null forwarded a fraud confession and did nothing with it. ',
    'On December 20, Baum sent a settlement offer that effectively admitted hospice fraud. Null forwarded it to Patty with one word: "Thoughts?" No analysis. No legal advice. No strategy. Just "Thoughts?"'),

  bullet('Null blamed Patty for her own problems. ',
    'On tape, December 26: "I think it just really comes back to your perpetual problem with Nadine\u2019s Nest." He was hired to solve that problem. Instead he blamed her for having it.'),

  bullet('Null admitted he failed. ',
    'On tape, December 26: "I didn\u2019t do a good job with her." His own words.'),

  bullet('Null called Russell\u2019s own wishes "self-serving testimony." ',
    'When Patty reported what Russell told her \u2014 that he wanted to see his wife \u2014 Null dismissed it as "self-serving testimony." A dying man\u2019s words to his wife.'),

  bullet('Null pushed the emergency hearing to the day Russell died. ',
    'After the visitor failed because of his delay, Null stood up in court and asked to consolidate the hearings and push everything to January 29. Russell Bingaman died on January 29, 2025. No hearing ever happened.'),

  bullet('Null accepted a $28,386 accounting error as a "scrivener\u2019s error." ',
    'Patty found $28,386 missing from Baum\u2019s final accounting. Null didn\u2019t challenge it. He called it a "scrivener\u2019s error" and left for a two-week vacation.'),

  bullet('Null\u2019s email was unreachable after Russell died. ',
    'After January 29, Patty tried to email Null. The message bounced \u2014 his email was on an IP block list. Her own attorney was literally unreachable.'),

  bullet('Null belittled Levi\u2019s work. ',
    'Null called Levi\u2019s legal filings "threat and bullying" \u2014 the same filings that identified every issue the court eventually confirmed. Null was billing for doing nothing while mocking the person actually doing the work.'),

  bullet('Null now wants the dead man\u2019s estate to pay for all of this. ',
    'Catalyst Law is petitioning the court to force Russell\u2019s estate to pay Null\u2019s attorney fees. Under ORS 125.098, the biggest factor is "benefit to the protected person." The benefit to Russell was zero. He\u2019s dead.'),

  note('BOTTOM LINE: Null provided zero benefit to Russell, ignored his client, delayed every proceeding, tampered with evidence, and the chain of events he set in motion ended with Russell dying on the rescheduled hearing date. He has no contract and no legal basis to charge the estate.'),

  // ═══════════════════════════════════════════
  // SECTION 2: THE CONTRACT PROBLEM
  // ═══════════════════════════════════════════
  sectionHead('The Contract Problem'),

  bullet('No signed contract has ever been produced. ',
    'Patty told Catalyst on July 29, 2025: "A contract with Catalyst was not signed." She has asked for it at least 5 times. Carol has asked for it. Catalyst once sent an email with no attachments. There is no signed retainer agreement.'),

  bullet('Without a contract, the fee petition collapses. ',
    'If Catalyst cannot produce a signed retainer agreement, there is no enforceable fee claim against the estate. This is the simplest defense: make them produce the contract or admit it doesn\u2019t exist.'),

  note('CAROL\u2019S FIRST MOVE: File a demand for Catalyst to produce the signed retainer agreement within 14 days, or move to deny the fee petition.'),

  // ═══════════════════════════════════════════
  // SECTION 3: WHAT CAROL HASN'T DONE
  // ═══════════════════════════════════════════
  sectionHead('What Carol Hasn\u2019t Done'),

  bullet('Carol never sent the Nadine\u2019s Nest demand letter. ',
    'Patty first asked on July 14, 2025. Carol confirmed on September 12: "We have requested the file." But when Patty asked for a copy of that letter \u2014 for a federal HIPAA complaint \u2014 it was never produced. Because the letter never existed, HHS dropped the HIPAA complaint last week.'),

  bullet('Carol never obtained the Emily Cooper records. ',
    'Patty asked on September 5, 2025. Carol replied: "Please resend and we will request it." Patty resent the info on January 2, 2026. No records have been received.'),

  bullet('Carol never got the Catalyst contract. ',
    'Patty has asked at least 5 times. As of January 19, 2026, Carol admitted she still hadn\u2019t received or reviewed it. Catalyst sent an email with no attachments and Carol said she\u2019d follow up. Nothing happened.'),

  bullet('Carol never filed the Limited Scope notice. ',
    'On December 18, Patty proposed a "Notice of Limited Scope Representation" so she could file a motion to compel records Pro Se. Carol neither filed the notice nor obtained the records \u2014 effectively blocking Patty from acting on her own.'),

  bullet('Carol never got the conservator settlement documentation. ',
    'On October 21, Patty told Carol about a $3,490 check that appeared with no paperwork. Carol promised to request documentation. No documentation was ever provided.'),

  bullet('Carol\u2019s non-action caused the HHS complaint to fail. ',
    'It took months to get HHS to look at the HIPAA issue. Because Carol never produced the demand letter, HHS dropped it. That window is now closed. Russell has been dead 13 months.'),

  note('CAROL DEFINED THE SCOPE HERSELF: On September 12, 2025, she said: "I am happy to request the documents from Nadine\u2019s Nest and the Disability Rights records, but nothing further than that." She chose these tasks. She has failed to complete either one.'),

  // ═══════════════════════════════════════════
  // SECTION 4: WHAT PATTY NEEDS FROM CAROL — NOW
  // ═══════════════════════════════════════════
  sectionHead('What Patty Needs from Carol \u2014 Right Now'),

  bullet('Demand the Catalyst contract. ',
    'File a demand for the signed retainer agreement. If they can\u2019t produce it, move to deny the fee petition.'),

  bullet('File the fee objection. ',
    'A complete objection with 19 exhibits (A through S) is already drafted. Carol needs to file it or tell Patty she won\u2019t so Patty can file it herself.'),

  bullet('Send the records demand letters. ',
    'Nadine\u2019s Nest and Emily Cooper \u2014 the tasks Carol agreed to do 7 months ago.'),

  bullet('File the Limited Scope notice \u2014 or do the work. ',
    'Either file the notice so Patty can act Pro Se on the records issue, or actually obtain the records. One or the other. Not neither.'),

  bullet('Review the recordings and the admissibility memo. ',
    'Three recorded meetings with Null contain his admissions. A full legal memo on admissibility under ORS 165.540 is prepared. Carol needs to confirm she\u2019ll use them.'),

  bullet('Contact Rob Beck as a witness. ',
    'Rob Beck was present at the December 11 meeting and received the December 22 emergency motion email. He can corroborate everything.'),

  spacer(200),

  // ═══════════════════════════════════════════
  // SECTION 5: THE ASK
  // ═══════════════════════════════════════════
  sectionHead('The Ask'),

  new Paragraph({
    spacing: { after: 200, line: 276 },
    children: [
      new TextRun({ text: 'Either ', size: 24, font: 'Calibri' }),
      new TextRun({ text: '(a) complete the work you agreed to do', bold: true, size: 24, font: 'Calibri' }),
      new TextRun({ text: ' \u2014 demand the records, file a motion to compel, get the Catalyst contract, object to the fee petition \u2014 or ', size: 24, font: 'Calibri' }),
      new TextRun({ text: '(b) file the Limited Scope notice so Patty can do it herself.', bold: true, size: 24, font: 'Calibri' }),
    ]
  }),

  new Paragraph({
    spacing: { after: 200, line: 276 },
    children: [
      new TextRun({ text: 'The one thing that is not acceptable is continuing to do neither.', bold: true, size: 24, font: 'Calibri', color: 'DC2626' }),
    ]
  }),
];

// ─────────────────────────────────────────────
// GENERATE DOCX
// ─────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [{
      reference: 'bullet-list',
      levels: [{
        level: 0,
        format: 'bullet',
        text: '\u2022',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 }
      }
    },
    children
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log('DONE: ' + OUTPUT);
  console.log('Size: ' + (buf.length / 1024).toFixed(1) + ' KB');
}).catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
