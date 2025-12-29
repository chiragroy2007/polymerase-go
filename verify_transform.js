const http = require('http');

const tests = [
    {
        name: "Reverse Complement (DNA)",
        path: '/api/transform',
        method: 'POST',
        body: JSON.stringify({
            sequence: "ATGC",
            operation: "reverse_complement",
            type: "dna"
        }),
        check: (data) => data.result === "GCAT"
    },
    {
        name: "Complement (RNA)",
        path: '/api/transform',
        method: 'POST',
        body: JSON.stringify({
            sequence: "AUGG",
            operation: "complement",
            type: "rna"
        }),
        check: (data) => data.result === "UACC"
    },
    {
        name: "Expand Variants (IUPAC)",
        path: '/api/transform',
        method: 'POST',
        body: JSON.stringify({
            sequence: "ATR", // R = A or G
            operation: "expand_variants"
        }),
        check: (data) => data.variants && data.variants.length === 2 && data.variants.includes("ATA") && data.variants.includes("ATG")
    }
];

function runTest(test) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: test.path,
            method: test.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(test.body)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\n--- ${test.name} ---`);
                if (res.statusCode !== 200) {
                    console.log(`Response: ${data}`);
                    reject(new Error(`Status ${res.statusCode}`));
                    return;
                }

                try {
                    const json = JSON.parse(data);
                    console.log("Response:", JSON.stringify(json, null, 2));
                    if (test.check && !test.check(json)) {
                        reject(new Error("Custom check failed"));
                        return;
                    }
                    resolve();
                } catch (e) {
                    console.log("Failed to parse JSON:", data);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        req.write(test.body);
        req.end();
    });
}

async function runAll() {
    for (const test of tests) {
        try {
            await runTest(test);
        } catch (e) {
            console.error(`Test ${test.name} FAILED`);
            process.exit(1);
        }
    }
    console.log("\nAll Transform tests PASSED");
}

runAll();
