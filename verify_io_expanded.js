const http = require('http');

function post(data, label) {
    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/api/io',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            console.log(`\n--- ${label} ---`);
            console.log(`Status: ${res.statusCode}`);
            console.log(`Body: ${body.substring(0, 200)}...`);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
}

// FASTQ Test
const fastqData = "@SEQ_ID\nGATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT\n+\n!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65";
const fastqRequest = JSON.stringify({
    input_content: fastqData,
    input_format: "fastq",
    output_format: "fasta"
});

post(fastqRequest, "FASTQ to FASTA");

// GFF Test (Example GFF from GFF3 spec)
const gffData = "##gff-version 3\nct123\t.\tgene\t1000\t9000\t.\t+\t.\tID=gene00001;Name=EDEN";
const gffRequest = JSON.stringify({
    input_content: gffData,
    input_format: "gff",
    output_format: "genbank"
});

setTimeout(() => post(gffRequest, "GFF to GenBank"), 500);
