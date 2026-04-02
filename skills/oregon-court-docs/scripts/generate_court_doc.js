#!/usr/bin/env node
/**
 * Oregon Court Document Generator
 * 
 * Usage: node generate_court_doc.js <config.json> <output.docx>
 * 
 * Config structure:
 * {
 *   "county": "MARION",
 *   "plaintiff": { "name": "LEVI BAKKE", "address": ["501 C Avenue", "La Grande, OR 97850"] },
 *   "defendant": { "name": "OREGON DEPARTMENT OF HUMAN SERVICES", "shortName": "ODHS" },
 *   "caseNumber": "",
 *   "documentTitle": "SUMMONS",
 *   "footerTitle": "SUMMONS",
 *   "captionExtras": ["(ORS 192.431)"],
 *   "serviceAddresses": [...],
 *   "body": [...],
 *   "includeNoticeToDefendant": true
 * }
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, Footer, PageNumber, TabStopType } = require('docx');
const fs = require('fs');

// Standard tab stops for case caption
const CAPTION_TABS = [
  { type: TabStopType.LEFT, position: 4680 },
  { type: TabStopType.LEFT, position: 5040 }
];

// Standard page settings
const PAGE_SETTINGS = {
  page: {
    size: { width: 12240, height: 15840 },
    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
  }
};

function createCourtHeader(county) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: "IN THE CIRCUIT COURT OF THE STATE OF OREGON", bold: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 480 },
      children: [new TextRun({ text: `FOR THE COUNTY OF ${county.toUpperCase()}`, bold: true })]
    })
  ];
}

function createCaseCaption(config) {
  const { plaintiff, defendant, caseNumber, documentTitle, captionExtras = [] } = config;
  const paragraphs = [];
  
  // Line 1: Plaintiff name with case number
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [
      new TextRun({ text: `${plaintiff.name},` }),
      new TextRun({ text: `\t)\tCase No. ${caseNumber || '_________________'}` })
    ]
  }));
  
  // Line 2: Empty with )
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [new TextRun({ text: "\t)" })]
  }));
  
  // Line 3: Plaintiff designation with document title
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [
      new TextRun({ text: "          Plaintiff," }),
      new TextRun({ text: "\t)\t" }),
      new TextRun({ text: documentTitle, bold: true })
    ]
  }));
  
  // Additional caption lines (ORS citation, oral argument, etc.)
  captionExtras.forEach((extra, i) => {
    paragraphs.push(new Paragraph({
      tabStops: CAPTION_TABS,
      spacing: { after: 0 },
      children: [
        new TextRun({ text: "\t)\t" }),
        new TextRun({ text: extra, bold: i > 0 })
      ]
    }));
  });
  
  // v. line
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [
      new TextRun({ text: "     v." }),
      new TextRun({ text: "\t)" })
    ]
  }));
  
  // Empty line
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [new TextRun({ text: "\t)" })]
  }));
  
  // Defendant name (may span multiple lines)
  const defLines = defendant.name.split('\n');
  defLines.forEach((line, i) => {
    paragraphs.push(new Paragraph({
      tabStops: CAPTION_TABS,
      spacing: { after: 0 },
      children: [
        new TextRun({ text: line + (i === defLines.length - 1 ? "," : "") }),
        new TextRun({ text: "\t)" })
      ]
    }));
  });
  
  // Empty line
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [new TextRun({ text: "\t)" })]
  }));
  
  // Defendant designation
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 0 },
    children: [
      new TextRun({ text: "          Defendant." }),
      new TextRun({ text: "\t)" })
    ]
  }));
  
  // Closing line
  paragraphs.push(new Paragraph({
    tabStops: CAPTION_TABS,
    spacing: { after: 480 },
    children: [new TextRun({ text: "_________________________________________)" })]
  }));
  
  return paragraphs;
}

function createServiceAddresses(addresses) {
  const paragraphs = [];
  
  addresses.forEach((addr, i) => {
    const prefix = i === 0 ? "TO:" : "AND TO:";
    
    paragraphs.push(new Paragraph({
      spacing: { after: 0 },
      children: [
        new TextRun({ text: prefix, bold: true }),
        new TextRun({ text: `   ${addr.name}` })
      ]
    }));
    
    addr.lines.forEach((line, j) => {
      paragraphs.push(new Paragraph({
        spacing: { after: j === addr.lines.length - 1 ? 240 : 0 },
        indent: { left: 720 },
        children: [new TextRun({ text: line })]
      }));
    });
  });
  
  return paragraphs;
}

function createNoticeToDefendant() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: "NOTICE TO DEFENDANT: READ THESE PAPERS CAREFULLY!", bold: true, underline: {} })]
    }),
    new Paragraph({
      spacing: { after: 240, line: 276 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({ text: "You must " }),
        new TextRun({ text: "\"appear\"", bold: true }),
        new TextRun({ text: " in this case or the other side will win automatically. To " }),
        new TextRun({ text: "\"appear\"", bold: true }),
        new TextRun({ text: " you must file with the court a legal paper called a " }),
        new TextRun({ text: "\"motion\"", bold: true }),
        new TextRun({ text: " or " }),
        new TextRun({ text: "\"answer.\"", bold: true }),
        new TextRun({ text: " The " }),
        new TextRun({ text: "\"motion\"", bold: true }),
        new TextRun({ text: " or " }),
        new TextRun({ text: "\"answer\"", bold: true }),
        new TextRun({ text: " must be given to the court clerk or administrator within 30 days along with the required filing fee. It must be in proper form and have proof of service on the plaintiff's attorney or, if the plaintiff does not have an attorney, proof of service on the plaintiff." })
      ]
    }),
    new Paragraph({
      spacing: { after: 240, line: 276 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: "If you have questions, you should see an attorney immediately. If you need help in finding an attorney, you may call the Oregon State Bar's Lawyer Referral Service at (503) 684-3763 or toll-free in Oregon at (800) 452-7636." })]
    }),
    new Paragraph({
      spacing: { after: 480, line: 276 },
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: "Pursuant to ORS 192.431(2), this case is to take precedence over other causes and shall be assigned for hearing and trial at the earliest practicable date." })]
    })
  ];
}

function createSignatureBlock(plaintiff) {
  return [
    new Paragraph({
      spacing: { after: 480 },
      children: [new TextRun({ text: "DATED: ____________________" })]
    }),
    new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: "____________________________________" })]
    }),
    new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: `${plaintiff.name}, Pro Se` })]
    }),
    ...plaintiff.address.map(line => new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({ text: line })]
    }))
  ];
}

function createFooter(title) {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `${title} - Page `, font: "Courier New", size: 20 }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Courier New", size: 20 }),
          new TextRun({ text: " of ", font: "Courier New", size: 20 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Courier New", size: 20 })
        ]
      })
    ]
  });
}

async function generateDocument(configPath, outputPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  
  const children = [
    ...createCourtHeader(config.county),
    ...createCaseCaption(config)
  ];
  
  if (config.serviceAddresses) {
    children.push(...createServiceAddresses(config.serviceAddresses));
  }
  
  if (config.includeNoticeToDefendant) {
    children.push(...createNoticeToDefendant());
  }
  
  // Add custom body paragraphs if provided
  if (config.body) {
    config.body.forEach(para => {
      const runs = para.runs.map(r => new TextRun(r));
      children.push(new Paragraph({
        spacing: para.spacing || { after: 240, line: 360 },
        alignment: para.alignment === 'center' ? AlignmentType.CENTER : 
                   para.alignment === 'justified' ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
        indent: para.indent,
        children: runs
      }));
    });
  }
  
  children.push(...createSignatureBlock(config.plaintiff));
  
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Courier New", size: 24 }
        }
      }
    },
    sections: [{
      properties: PAGE_SETTINGS,
      footers: { default: createFooter(config.footerTitle || config.documentTitle) },
      children
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document created: ${outputPath}`);
}

// CLI execution
if (require.main === module) {
  const [,, configPath, outputPath] = process.argv;
  if (!configPath || !outputPath) {
    console.error('Usage: node generate_court_doc.js <config.json> <output.docx>');
    process.exit(1);
  }
  generateDocument(configPath, outputPath).catch(console.error);
}

module.exports = { 
  createCourtHeader, 
  createCaseCaption, 
  createServiceAddresses,
  createNoticeToDefendant,
  createSignatureBlock,
  createFooter,
  generateDocument,
  CAPTION_TABS,
  PAGE_SETTINGS
};
